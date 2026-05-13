const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
const fs = require('fs')
const readline = require('readline')
const crypto = require('crypto')

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
    const cols = line.split(',')
    if (cols.length < 5) continue

    const estado = cols[0].trim()
    const cidade = cols[1].trim().replace(/-/g, ' ')
    const bairro = cols[2].trim().replace(/-/g, ' ')
    const nome = cols[3].trim().replace(/-/g, ' ')
    const cnpj = cols[4].trim()

    if (!nome || !estado) continue

    const hash = crypto.createHash('md5').update(`${estado}${cidade}${bairro}${nome}`).digest('hex').slice(0, 8)
    const slug = slugify(nome) + '-' + slugify(cidade) + '-' + hash

    batch.push({ cnpj, nome, bairro, cidade, estado, slug, fonte: 'SITEMAP' })

    if (batch.length >= 500) {
      const { error } = await supabase.from('farmacias_fisicas').insert(batch)
      if (error) { erros++; console.error(error.message) }
      else { total += batch.length; console.log(`Importadas: ${total}`) }
      batch = []
    }
  }

  if (batch.length > 0) {
    const { error } = await supabase.from('farmacias_fisicas').insert(batch)
    if (error) { erros++ }
    else { total += batch.length }
  }

  console.log(`\nFinalizado! Total: ${total} | Erros: ${erros}`)
}

importar()
