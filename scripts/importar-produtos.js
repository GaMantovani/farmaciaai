const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
const fs = require('fs')
const readline = require('readline')

const supabase = createClient(
  'https://lbatmgvrqvjchbodzymy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo',
  { realtime: { transport: ws } }
)

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function importar() {
  const fileStream = fs.createReadStream(process.argv[2])
  const rl = readline.createInterface({ input: fileStream })

  let batch = []
  let total = 0
  let erros = 0

  for await (const line of rl) {
    const idx = line.indexOf(',')
    if (idx === -1) continue

    const ean = line.substring(0, idx).trim()
    const nome = line.substring(idx + 1).trim().replace(/-/g, ' ')
    const slug = slugify(line.substring(idx + 1).trim()) + '-' + ean

    if (!ean || !nome) continue

    batch.push({ ean, nome, slug })

    if (batch.length >= 500) {
      const { error } = await supabase.from('produtos').upsert(batch, { onConflict: 'ean' })
      if (error) { console.error('Erro:', error.message); erros++ }
      else { total += batch.length; console.log(`Importados: ${total}`) }
      batch = []
    }
  }

  if (batch.length > 0) {
    const { error } = await supabase.from('produtos').upsert(batch, { onConflict: 'ean' })
    if (error) { console.error('Erro:', error.message); erros++ }
    else { total += batch.length }
  }

  console.log(`\nFinalizado! Total: ${total} | Erros: ${erros}`)
}

importar()
