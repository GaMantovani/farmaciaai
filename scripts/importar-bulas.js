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
    const cols = line.split(',')
    if (cols.length < 2) continue

    const numero_registro = cols[0].trim()
    const nome_completo = cols[1].trim()
    
    // Separar nome do medicamento da empresa
    // Formato: NOME-MEDICAMENTO-EMPRESA
    // A empresa geralmente começa com o último segmento em maiúsculas
    const partes = nome_completo.split('-')
    const nome_medicamento = nome_completo.replace(/-/g, ' ')
    const html_url = `https://farmaciaai.com.br/bula/${nome_completo}/${numero_registro}`
    const slug = slugify(nome_completo) + '-' + numero_registro

    if (!numero_registro || !nome_medicamento) continue

    batch.push({
      numero_registro,
      nome_medicamento,
      slug,
      html_url
    })

    if (batch.length >= 500) {
      const { error } = await supabase.from('bulas').upsert(batch, { onConflict: 'numero_registro' })
      if (error) { console.error('Erro:', error.message); erros++ }
      else { total += batch.length; console.log(`Importadas: ${total}`) }
      batch = []
    }
  }

  if (batch.length > 0) {
    const { error } = await supabase.from('bulas').upsert(batch, { onConflict: 'numero_registro' })
    if (error) { console.error('Erro:', error.message); erros++ }
    else { total += batch.length }
  }

  console.log(`\nFinalizado! Total: ${total} | Erros: ${erros}`)
}

importar()
