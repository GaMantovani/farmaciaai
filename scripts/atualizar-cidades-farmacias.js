const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
const fs = require('fs')
const readline = require('readline')

const supabase = createClient(
  'https://lbatmgvrqvjchbodzymy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo',
  { realtime: { transport: ws } }
)

async function atualizar() {
  const fileStream = fs.createReadStream(process.argv[2])
  const rl = readline.createInterface({ input: fileStream })

  const municipios = {}
  let header = null

  for await (const line of rl) {
    if (!header) { header = true; continue }
    const cols = line.split(';').map(c => c.replace(/^"|"$/g, '').trim())
    municipios[cols[0]] = { cidade: cols[1], estado: cols[2] }
  }

  console.log(`${Object.keys(municipios).length} municípios carregados`)

  const { data: farmacias, error } = await supabase
    .from('farmacias_fisicas')
    .select('id, municipio_cod')
    .is('cidade', null)

  if (error) { console.error(error); return }
  console.log(`${farmacias.length} farmácias para atualizar`)

  let total = 0
  const batch = []

  for (const f of farmacias) {
    const mun = municipios[f.municipio_cod]
    if (!mun) continue
    batch.push({ id: f.id, cidade: mun.cidade })

    if (batch.length >= 500) {
      for (const item of batch) {
        await supabase.from('farmacias_fisicas').update({ cidade: item.cidade }).eq('id', item.id)
      }
      total += batch.length
      console.log(`Atualizadas: ${total}`)
      batch.length = 0
    }
  }

  for (const item of batch) {
    await supabase.from('farmacias_fisicas').update({ cidade: item.cidade }).eq('id', item.id)
  }
  total += batch.length

  console.log(`\nFinalizado! Total: ${total}`)
}

atualizar()
