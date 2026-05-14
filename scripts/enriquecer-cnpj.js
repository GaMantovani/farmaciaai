// scripts/enriquecer-cnpj.js
// Enriches farmacias_fisicas address fields using BrasilAPI CNPJ lookup
// Usage: node scripts/enriquecer-cnpj.js
// Resumes from progress file automatically

const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
const fs = require('fs')
const https = require('https')

const PROGRESS_FILE = './cnpj-progress.json'
const BATCH_SIZE = 500
const CONCURRENCY = 1
const DELAY_MS = 1200

const supabase = createClient(
  'https://lbatmgvrqvjchbodzymy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo',
  { realtime: { transport: ws } }
)

function loadProgress() {
  try { return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8')) }
  catch { return { done: [], lastId: 0 } }
}

function saveProgress(p) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(p))
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function fetchCnpj(cnpj) {
  return new Promise((resolve, reject) => {
    const url = `https://brasilapi.com.br/api/cnpj/v1/${cnpj}`
    const req = https.get(url, { headers: { 'User-Agent': 'farmaciaai/1.0' } }, res => {
      let body = ''
      res.on('data', c => body += c)
      res.on('end', () => {
        if (res.statusCode === 429) return reject(Object.assign(new Error('rate_limit'), { code: 429 }))
        if (res.statusCode === 404) return resolve(null)
        if (res.statusCode !== 200) return resolve(null)
        try { resolve(JSON.parse(body)) }
        catch { resolve(null) }
      })
    })
    req.on('error', reject)
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('timeout')) })
  })
}

async function fetchWithRetry(cnpjRaw, retries = 3) {
  const cnpj = cnpjRaw.replace(/\D/g, '').padStart(14, '0')
  for (let i = 0; i < retries; i++) {
    try {
      return await fetchCnpj(cnpj)  // already padded above
    } catch (e) {
      if (e.code === 429) {
        console.log('  rate limit, aguardando 10s...')
        await sleep(10000)
      } else if (i < retries - 1) {
        await sleep(1000 * (i + 1))
      } else {
        return null
      }
    }
  }
  return null
}

function limpar(s) {
  return (s || '').trim().toUpperCase()
}

async function processarBatch(registros, progresso) {
  let atualizados = 0
  let processados = 0

  async function processar(f) {
    const api = await fetchWithRetry(f.cnpj)
    await sleep(DELAY_MS)
    processados++

    if (!api) { progresso.done.push(f.id); return }

    const updates = {}

    if (!f.logradouro && api.logradouro) {
      const tipo = api.descricao_tipo_de_logradouro ? `${api.descricao_tipo_de_logradouro} ` : ''
      updates.logradouro = limpar(tipo + api.logradouro)
    }
    if (!f.numero && api.numero && api.numero !== 'S/N') {
      updates.numero = limpar(api.numero)
    }
    if (!f.complemento && api.complemento) {
      updates.complemento = limpar(api.complemento)
    }
    if (!f.bairro && api.bairro) {
      updates.bairro = limpar(api.bairro)
    }
    if (!f.cep && api.cep) {
      updates.cep = api.cep.replace(/\D/g, '')
    }
    if (!f.telefone && api.ddd_telefone_1) {
      updates.telefone = api.ddd_telefone_1.replace(/\D/g, '')
    }

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from('farmacias_fisicas')
        .update(updates)
        .eq('id', f.id)

      if (!error) {
        atualizados++
        process.stdout.write(`\r  atualizados: ${atualizados} / processados: ${processados}`)
      }
    }

    progresso.done.push(f.id)
  }

  const fila = [...registros]
  const workers = Array.from({ length: CONCURRENCY }, async () => {
    while (fila.length > 0) {
      const f = fila.shift()
      if (!f) break
      await processar(f)
    }
  })

  await Promise.all(workers)
  return atualizados
}

async function main() {
  const progresso = loadProgress()
  const doneset = new Set(progresso.done)

  console.log(`Progresso anterior: ${doneset.size} registros processados`)

  // Keyset pagination: always fetch starting after lastId
  let lastId = progresso.lastId || 0
  let totalProcessados = 0
  let totalAtualizados = 0
  let continuar = true

  while (continuar) {
    const { data, error } = await supabase
      .from('farmacias_fisicas')
      .select('id, cnpj, logradouro, numero, complemento, bairro, cep, telefone')
      .not('cnpj', 'is', null)
      .neq('cnpj', '')
      .or('logradouro.is.null,logradouro.eq.,cep.is.null,cep.eq.')
      .gt('id', lastId)
      .order('id')
      .limit(BATCH_SIZE)

    if (error) { console.error('Erro Supabase:', error.message); break }
    if (!data || data.length === 0) { continuar = false; break }

    const pendentes = data.filter(f => !doneset.has(f.id))
    lastId = data[data.length - 1].id
    progresso.lastId = lastId
    console.log(`\nBatch até id=${lastId}: ${data.length} registros, ${pendentes.length} pendentes`)

    if (pendentes.length > 0) {
      const atualizados = await processarBatch(pendentes, progresso)
      totalAtualizados += atualizados
      totalProcessados += pendentes.length
      saveProgress(progresso)
      console.log(`\n  Batch concluído: ${atualizados} atualizados`)
    }

    if (data.length < BATCH_SIZE) continuar = false
  }

  console.log(`\nConcluído! Total processados: ${totalProcessados} | Atualizados: ${totalAtualizados}`)
  saveProgress(progresso)
}

main().catch(console.error)
