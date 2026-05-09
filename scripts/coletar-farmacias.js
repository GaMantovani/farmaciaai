const https = require('https')
const fs = require('fs')

const KEY = 'AIzaSyB09Wt3Bvxa2dhGdcRacILCxnthbX7jctM'

const CIDADES = [
  { nome: 'São Paulo', estado: 'SP', lat: -23.5505, lng: -46.6333 },
  { nome: 'Rio de Janeiro', estado: 'RJ', lat: -22.9068, lng: -43.1729 },
  { nome: 'Belo Horizonte', estado: 'MG', lat: -19.9167, lng: -43.9345 },
  { nome: 'Curitiba', estado: 'PR', lat: -25.4284, lng: -49.2733 },
  { nome: 'Porto Alegre', estado: 'RS', lat: -30.0346, lng: -51.2177 },
  { nome: 'Salvador', estado: 'BA', lat: -12.9714, lng: -38.5014 },
  { nome: 'Fortaleza', estado: 'CE', lat: -3.7172, lng: -38.5433 },
  { nome: 'Brasília', estado: 'DF', lat: -15.7797, lng: -47.9297 },
  { nome: 'Campinas', estado: 'SP', lat: -22.9056, lng: -47.0608 },
  { nome: 'Recife', estado: 'PE', lat: -8.0476, lng: -34.8770 },
]

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve(JSON.parse(data)))
    }).on('error', reject)
  })
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function detectarRede(nome) {
  const n = nome.toLowerCase()
  if (n.includes('drogasil')) return 'drogasil'
  if (n.includes('raia')) return 'drogaraia'
  if (n.includes('pague menos')) return 'paguemenos'
  if (n.includes('ultrafarma')) return 'ultrafarma'
  if (n.includes('panvel')) return 'panvel'
  if (n.includes('nissei')) return 'nissei'
  if (n.includes('drogal')) return 'drogal'
  return 'independente'
}

async function main() {
  const outputFile = './lib/farmacias-coletadas.json'
  let farmacias = []
  if (fs.existsSync(outputFile)) {
    farmacias = JSON.parse(fs.readFileSync(outputFile))
    console.log('Continuando de ' + farmacias.length + ' farmácias já coletadas')
  }
  const idsExistentes = new Set(farmacias.map(f => f.place_id))

  for (const cidade of CIDADES) {
    console.log('Buscando em ' + cidade.nome + '...')
    try {
      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + cidade.lat + ',' + cidade.lng + '&radius=8000&type=pharmacy&language=pt-BR&key=' + KEY
      const data = await get(url)
      if (!data.results) { console.log('  Sem resultados'); continue }
      const novas = data.results
        .filter(p => !idsExistentes.has(p.place_id))
        .map(p => ({
          place_id: p.place_id,
          nome: p.name,
          endereco: p.vicinity,
          bairro: p.vicinity ? p.vicinity.split(',')[1]?.trim() || cidade.nome : cidade.nome,
          cidade: cidade.nome,
          estado: cidade.estado,
          lat: p.geometry.location.lat,
          lng: p.geometry.location.lng,
          avaliacao: p.rating || null,
          rede: detectarRede(p.name),
        }))
      novas.forEach(f => idsExistentes.add(f.place_id))
      farmacias.push(...novas)
      console.log('  ' + novas.length + ' novas (total: ' + farmacias.length + ')')
      fs.writeFileSync(outputFile, JSON.stringify(farmacias, null, 2))
      await sleep(500)
    } catch(e) {
      console.error('  Erro: ' + e.message)
    }
  }
  console.log('Finalizado! ' + farmacias.length + ' farmácias salvas.')
}

main()
