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
  { nome: 'Manaus', estado: 'AM', lat: -3.1190, lng: -60.0217 },
  { nome: 'Florianópolis', estado: 'SC', lat: -27.5954, lng: -48.5480 },
  { nome: 'Goiânia', estado: 'GO', lat: -16.6864, lng: -49.2643 },
  { nome: 'Belém', estado: 'PA', lat: -1.4558, lng: -48.5044 },
  { nome: 'Natal', estado: 'RN', lat: -5.7945, lng: -35.2110 },
  { nome: 'Teresina', estado: 'PI', lat: -5.0892, lng: -42.8019 },
  { nome: 'Campo Grande', estado: 'MS', lat: -20.4697, lng: -54.6201 },
  { nome: 'João Pessoa', estado: 'PB', lat: -7.1195, lng: -34.8450 },
  { nome: 'Aracaju', estado: 'SE', lat: -10.9472, lng: -37.0731 },
  { nome: 'Maceió', estado: 'AL', lat: -9.6658, lng: -35.7350 },
  { nome: 'Cuiabá', estado: 'MT', lat: -15.5989, lng: -56.0949 },
  { nome: 'Joinville', estado: 'SC', lat: -26.3044, lng: -48.8487 },
  { nome: 'Ribeirão Preto', estado: 'SP', lat: -21.1704, lng: -47.8103 },
  { nome: 'Uberlândia', estado: 'MG', lat: -18.9186, lng: -48.2772 },
  { nome: 'Santos', estado: 'SP', lat: -23.9618, lng: -46.3322 },
  { nome: 'Sorocaba', estado: 'SP', lat: -23.5015, lng: -47.4526 },
  { nome: 'Feira de Santana', estado: 'BA', lat: -12.2664, lng: -38.9663 },
  { nome: 'Guarulhos', estado: 'SP', lat: -23.4538, lng: -46.5333 },
  { nome: 'São Luís', estado: 'MA', lat: -2.5297, lng: -44.3028 },
  { nome: 'Porto Velho', estado: 'RO', lat: -8.7612, lng: -63.9004 },
]

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => { try { resolve(JSON.parse(data)) } catch(e) { reject(e) } })
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
  if (n.includes('promofarma')) return 'promofarma'
  if (n.includes('catarinense')) return 'catarinense'
  return 'independente'
}

async function buscarPagina(cidade, pageToken) {
  let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + cidade.lat + ',' + cidade.lng + '&radius=10000&type=pharmacy&language=pt-BR&key=' + KEY
  if (pageToken) url += '&pagetoken=' + pageToken
  return await get(url)
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
    console.log('\nBuscando em ' + cidade.nome + ', ' + cidade.estado + '...')
    let pageToken = null
    let pagina = 1

    do {
      try {
        if (pageToken) await sleep(2000) // Google exige espera entre páginas
        const data = await buscarPagina(cidade, pageToken)
        
        if (!data.results || data.results.length === 0) break

        const novas = data.results
          .filter(p => !idsExistentes.has(p.place_id))
          .map(p => ({
            place_id: p.place_id,
            nome: p.name,
            endereco: p.vicinity,
            bairro: p.vicinity ? (p.vicinity.split(',')[1]?.trim() || cidade.nome) : cidade.nome,
            cidade: cidade.nome,
            estado: cidade.estado,
            lat: p.geometry.location.lat,
            lng: p.geometry.location.lng,
            avaliacao: p.rating || null,
            rede: detectarRede(p.name),
          }))

        novas.forEach(f => idsExistentes.add(f.place_id))
        farmacias.push(...novas)
        console.log('  Página ' + pagina + ': ' + novas.length + ' novas (total: ' + farmacias.length + ')')
        fs.writeFileSync(outputFile, JSON.stringify(farmacias, null, 2))

        pageToken = data.next_page_token || null
        pagina++
        await sleep(300)
      } catch(e) {
        console.error('  Erro: ' + e.message)
        break
      }
    } while (pageToken && pagina <= 3)
  }

  console.log('\n✅ Finalizado! ' + farmacias.length + ' farmácias salvas.')
  console.log('Próximo passo: git add lib/farmacias-coletadas.json && git commit -m "Farmácias atualizadas" && git push origin main && vercel --prod')
}

main()
