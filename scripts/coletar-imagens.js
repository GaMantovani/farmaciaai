const https = require('https')
const ws = require('ws')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = process.env.APIFY_TOKEN || 'apify_api_vmjbQpgi4hhyvA9RC8JJ7hqkdyEk6V0uj8jv'
const ACTOR_ID = 'JWEHgf5HWeoLlbchr'

const supabase = createClient(
  'https://lbatmgvrqvjchbodzymy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo',
  { realtime: { transport: ws } }
)

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function runActor(query) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ searchQuery: query + ' farmacia', country: 'br', language: 'pt', sortBy: 'BEST_MATCH', limit: 20 })
    const req = https.request({
      hostname: 'api.apify.com',
      path: '/v2/acts/' + ACTOR_ID + '/runs?token=' + APIFY_TOKEN + '&waitForFinish=120',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch(e) { resolve(null) } })
    })
    req.on('error', () => resolve(null))
    req.write(body)
    req.end()
  })
}

function getDataset(id) {
  return new Promise((resolve) => {
    https.get('https://api.apify.com/v2/datasets/' + id + '/items?token=' + APIFY_TOKEN, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => { try { resolve(JSON.parse(d)) } catch(e) { resolve([]) } })
    }).on('error', () => resolve([]))
  })
}

async function main() {
  // Pega todos os medicamentos únicos paginando
  let allMeds = new Set()
  let from = 0
  while (true) {
    const res = await supabase.from('precos').select('medicamento').is('imagem', null).range(from, from + 999)
    if (!res.data || res.data.length === 0) break
    res.data.forEach(p => allMeds.add(p.medicamento))
    from += 1000
    if (res.data.length < 1000) break
  }

  const meds = [...allMeds].sort()
  console.log('Medicamentos sem imagem:', meds.length)
  console.log('Estimativa: ~' + Math.ceil(meds.length * 1.5 / 60) + ' minutos\n')

  let salvos = 0
  for (let i = 0; i < meds.length; i++) {
    const med = meds[i]
    process.stdout.write('[' + (i+1) + '/' + meds.length + '] ' + med + '... ')

    const run = await runActor(med)
    if (!run?.data?.defaultDatasetId) { console.log('sem dataset'); continue }

    const items = await getDataset(run.data.defaultDatasetId)
    const imagem = items[0]?.productPhotos?.[0]

    if (imagem) {
      await supabase.from('precos').update({ imagem }).eq('medicamento', med)
      salvos++
      console.log('✓')
    } else {
      console.log('sem imagem')
    }

    await sleep(1500)
  }

  console.log('\n✅ Pronto! Imagens salvas para ' + salvos + ' medicamentos.')
}

main().catch(console.error)
