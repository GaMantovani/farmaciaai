// scripts/enriquecer-enderecos.js
const https = require('https')

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function httpGet(url, headers = {}) {
  return new Promise((resolve) => {
    const req = https.get(url, { headers }, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { resolve(null) }
      })
    })
    req.on('error', () => resolve(null))
    req.setTimeout(10000, () => { req.destroy(); resolve(null) })
  })
}

function httpPatch(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body)
    const options = {
      hostname: 'lbatmgvrqvjchbodzymy.supabase.co',
      path,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Length': Buffer.byteLength(data),
        'Prefer': 'return=minimal'
      }
    }
    const req = https.request(options, res => {
      res.on('data', () => {})
      res.on('end', () => resolve(res.statusCode))
    })
    req.on('error', () => resolve(null))
    req.write(data)
    req.end()
  })
}

function supabaseGet(query) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'lbatmgvrqvjchbodzymy.supabase.co',
      path: `/rest/v1/${query}`,
      method: 'GET',
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Accept': 'application/json'
      }
    }
    const req = https.request(options, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve(JSON.parse(data)) }
        catch { resolve([]) }
      })
    })
    req.on('error', () => resolve([]))
    req.end()
  })
}

function extrairEndereco(data) {
  const est = data?.estabelecimento
  if (!est) return null
  const logradouro = [est.tipo_logradouro, est.logradouro].filter(Boolean).join(' ')
  return {
    logradouro: logradouro || null,
    numero: est.numero || null,
    complemento: est.complemento || null,
    cep: est.cep || null,
    telefone: est.ddd1 && est.telefone1 ? `${est.ddd1} ${est.telefone1}` : null,
  }
}

async function main() {
  console.log('Buscando farmacias sem endereco...')
  let processadas = 0, atualizadas = 0, erros = 0, from = 0

  while (true) {
    const farmacias = await supabaseGet(
      `farmacias_fisicas?select=id,cnpj,nome,cidade,estado,telefone&logradouro=is.null&cnpj=not.is.null&offset=${from}&limit=100`
    )

    if (!farmacias || farmacias.length === 0) break

    console.log(`\nLote ${Math.floor(from/100)+1}: ${farmacias.length} farmacias`)

    for (const f of farmacias) {
      processadas++
      const cnpjLimpo = f.cnpj?.replace(/\D/g, '')
      if (!cnpjLimpo || cnpjLimpo.length !== 14) { erros++; continue }

      const data = await httpGet(
        `https://publica.cnpj.ws/cnpj/${cnpjLimpo}`,
        { 'User-Agent': 'FarmaciaAI/1.0' }
      )

      if (!data || data.status === 'ERROR') {
        erros++
        process.stdout.write('x')
        await sleep(500)
        continue
      }

      const end = extrairEndereco(data)
      if (!end || !end.logradouro) {
        process.stdout.write('o')
        await sleep(300)
        continue
      }

      const update = {
        logradouro: end.logradouro,
        numero: end.numero,
        complemento: end.complemento,
        cep: end.cep,
      }
      if (end.telefone && !f.telefone) update.telefone = end.telefone

      const status = await httpPatch(
        `/rest/v1/farmacias_fisicas?id=eq.${f.id}`,
        update
      )

      if (status === 204) {
        atualizadas++
        process.stdout.write('.')
      } else {
        erros++
        process.stdout.write('x')
      }

      await sleep(400)
    }

    from += 100
    console.log(`\nTotal: ${processadas} processadas, ${atualizadas} atualizadas, ${erros} erros`)
    await sleep(2000)
  }

  console.log(`\nConcluido! ${processadas} processadas, ${atualizadas} atualizadas`)
}

main().catch(console.error)
