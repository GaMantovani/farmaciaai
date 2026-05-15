// SpeedyIndex — submete URLs direto via API para indexação no Google
//
// Setup:
//   1. Crie conta em https://speedyindex.com
//   2. Copie sua API key em https://speedyindex.com/dashboard/api
//   3. Rode: SPEEDYINDEX_KEY=sua_chave node scripts/speedyindex-submit.js
//      ou coloque a chave em .env.local: SPEEDYINDEX_KEY=sua_chave
//
// Preços SpeedyIndex (referência):
//   ~$0.002–0.005 por URL dependendo do plano
//   Pacote 10.000 URLs ≈ $20–40
//
// Uso:
//   node scripts/speedyindex-submit.js                    # top 5.000 URLs
//   node scripts/speedyindex-submit.js --limit=20000      # mais URLs
//   node scripts/speedyindex-submit.js --type=meds        # só remédios
//   node scripts/speedyindex-submit.js --type=produtos
//   node scripts/speedyindex-submit.js --type=farmacias

const https = require('https')
const ws = require('ws')
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://lbatmgvrqvjchbodzymy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo'
const BASE = 'https://farmaciaai.com.br'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function apiRequest(method, path, body, apiKey) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : null
    const req = https.request({
      hostname: 'api.speedyindex.com',
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': apiKey,
        ...(bodyStr ? { 'Content-Length': Buffer.byteLength(bodyStr) } : {}),
      },
      timeout: 30000,
    }, res => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(d) }) }
        catch { resolve({ status: res.statusCode, data: d }) }
      })
    })
    req.on('error', reject)
    req.on('timeout', () => { req.destroy(); reject(new Error('timeout')) })
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

async function main() {
  // Lê API key
  let apiKey = process.env.SPEEDYINDEX_KEY
  if (!apiKey) {
    // Tenta ler do .env.local
    const envPath = path.join(__dirname, '../.env.local')
    if (fs.existsSync(envPath)) {
      const env = fs.readFileSync(envPath, 'utf8')
      const match = env.match(/SPEEDYINDEX_KEY=(.+)/)
      if (match) apiKey = match[1].trim()
    }
  }
  if (!apiKey) {
    console.error('\n❌ API key não encontrada.')
    console.error('Rode: SPEEDYINDEX_KEY=sua_chave node scripts/speedyindex-submit.js')
    console.error('Ou adicione SPEEDYINDEX_KEY=sua_chave ao arquivo .env.local\n')
    process.exit(1)
  }

  const args = process.argv.slice(2)
  const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1]
  const limitArg = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 5000

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws } })
  const urls = []

  console.log('Coletando URLs...')

  urls.push(`${BASE}/`, `${BASE}/remedios`, `${BASE}/produtos`, `${BASE}/cidades`, `${BASE}/bulas`)

  if (!typeArg || typeArg === 'meds') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.3)
    const { data } = await supabase
      .from('medicamentos').select('slug').eq('tem_preco', true).order('slug').limit(limit)
    data?.forEach(m => urls.push(`${BASE}/remedio/${m.slug}`))
    console.log(`  ${data?.length || 0} remédios`)
  }

  if (!typeArg || typeArg === 'produtos') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.3)
    const { data } = await supabase
      .from('produtos').select('slug').not('slug', 'is', null).order('slug').limit(limit)
    data?.forEach(p => urls.push(`${BASE}/produto/${p.slug}`))
    console.log(`  ${data?.length || 0} produtos`)
  }

  if (!typeArg || typeArg === 'farmacias') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.25)
    const { data } = await supabase
      .from('farmacias_fisicas').select('cidade, estado, bairro, nome')
      .not('nome', 'is', null).not('cidade', 'is', null).limit(limit)
    data?.forEach(f => {
      const cidadeSlug = `${norm(f.cidade)}-${f.estado?.toLowerCase()}`
      const slug = f.bairro && norm(f.bairro) !== norm(f.cidade)
        ? `${norm(f.bairro)}-${norm(f.nome)}` : norm(f.nome)
      urls.push(`${BASE}/farmacia/${cidadeSlug}/${slug}`)
    })
    console.log(`  ${data?.length || 0} farmácias`)
  }

  if (!typeArg || typeArg === 'cidades') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.15)
    const { data } = await supabase
      .from('farmacias_fisicas').select('cidade, estado')
      .not('cidade', 'is', null).not('estado', 'is', null).limit(50000)
    const unicas = [...new Map(data?.map(c => [`${c.cidade}-${c.estado}`, c]) || []).values()]
    unicas.slice(0, limit).forEach(c => urls.push(`${BASE}/cidade/${norm(c.cidade)}-${c.estado.toLowerCase()}`))
    console.log(`  ${Math.min(unicas.length, limit)} cidades`)
  }

  console.log(`\nTotal: ${urls.length} URLs`)

  // SpeedyIndex aceita até 10.000 URLs por task
  const CHUNK = 10000
  let totalOk = 0

  for (let i = 0; i < urls.length; i += CHUNK) {
    const chunk = urls.slice(i, i + CHUNK)
    process.stdout.write(`Submetendo ${i + 1}–${i + chunk.length}... `)

    const result = await apiRequest('POST', '/v2/task/google/indexer/create', { urls: chunk }, apiKey)

    if (result.status === 200 || result.status === 201) {
      totalOk += chunk.length
      const taskId = result.data?.task_id || result.data?.id || '?'
      console.log(`✓ task_id: ${taskId}`)
    } else {
      console.log(`✗ status ${result.status}: ${JSON.stringify(result.data)}`)
    }

    if (i + CHUNK < urls.length) await sleep(2000)
  }

  console.log(`\n✅ SpeedyIndex: ${totalOk}/${urls.length} URLs submetidas`)
  console.log('Acompanhe em: https://speedyindex.com/dashboard')
}

main().catch(console.error)
