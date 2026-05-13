const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')
const fs = require('fs')
const readline = require('readline')
const path = require('path')

const supabase = createClient(
  'https://lbatmgvrqvjchbodzymy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo',
  { realtime: { transport: ws } }
)

function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

async function carregarMunicipios(arquivo) {
  const municipios = {}
  const fileStream = fs.createReadStream(arquivo)
  const rl = readline.createInterface({ input: fileStream })
  let header = null
  for await (const line of rl) {
    if (!header) { header = true; continue }
    const cols = line.split(';').map(c => c.replace(/^"|"$/g, '').trim())
    municipios[cols[0]] = { cidade: cols[1], estado: cols[2] }
  }
  return municipios
}

async function importar(csvFarmacias, csvMunicipios) {
  console.log('Carregando municípios...')
  const municipios = await carregarMunicipios(csvMunicipios)
  console.log(`${Object.keys(municipios).length} municípios carregados`)

  const fileStream = fs.createReadStream(csvFarmacias)
  const rl = readline.createInterface({ input: fileStream })

  let header = null
  let batch = []
  let total = 0
  let erros = 0

  for await (const line of rl) {
    if (!header) { header = true; continue }
    const cols = line.split(';').map(c => c.replace(/^"|"$/g, '').trim())

    const nome = cols[6] || cols[5] || ''
    const logradouro = cols[7] || ''
    const numero = cols[8] || ''
    const complemento = cols[9] || ''
    const bairro = cols[10] || ''
    const cep = cols[11] || ''
    const telefone = cols[16] || ''
    const cnpj = cols[20] || ''
    const estado = cols[30] || ''
    const municipio_cod = cols[31] || ''
    const lat = parseFloat(cols[39]) || null
    const lng = parseFloat(cols[40]) || null
    const cnes = cols[1] || ''
    const mun = municipios[municipio_cod]
    const cidade = mun ? mun.cidade : ''

    if (!nome || !estado) continue

    const slug = slugify(nome) + '-' + cnes

    batch.push({ cnes, cnpj, nome, logradouro, numero, complemento, bairro, cep, telefone, estado, municipio_cod, cidade, latitude: lat, longitude: lng, slug, fonte: 'CNES' })

    if (batch.length >= 500) {
      const { error } = await supabase.from('farmacias_fisicas').upsert(batch, { onConflict: 'cnes' })
      if (error) { console.error('Erro:', error.message); erros++ }
      else { total += batch.length; console.log(`Importadas: ${total}`) }
      batch = []
    }
  }

  if (batch.length > 0) {
    const { error } = await supabase.from('farmacias_fisicas').upsert(batch, { onConflict: 'cnes' })
    if (error) { console.error('Erro:', error.message); erros++ }
    else { total += batch.length }
  }

  console.log(`\nFinalizado! Total: ${total} | Erros: ${erros}`)
}

importar(process.argv[2], process.argv[3])
