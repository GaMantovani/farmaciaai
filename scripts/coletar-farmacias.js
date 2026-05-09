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
  { nome: 'Mauá', estado: 'SP', lat: -23.6678, lng: -46.4611 },
  { nome: 'São José dos Campos', estado: 'SP', lat: -23.1794, lng: -45.8869 },
  { nome: 'Osasco', estado: 'SP', lat: -23.5329, lng: -46.7916 },
  { nome: 'São Bernardo do Campo', estado: 'SP', lat: -23.6939, lng: -46.5650 },
  { nome: 'Santo André', estado: 'SP', lat: -23.6639, lng: -46.5383 },
  { nome: 'Diadema', estado: 'SP', lat: -23.6861, lng: -46.6228 },
  { nome: 'Piracicaba', estado: 'SP', lat: -22.7253, lng: -47.6492 },
  { nome: 'Bauru', estado: 'SP', lat: -22.3246, lng: -49.0959 },
  { nome: 'São José do Rio Preto', estado: 'SP', lat: -20.8197, lng: -49.3794 },
  { nome: 'Betim', estado: 'MG', lat: -19.9681, lng: -44.1983 },
  { nome: 'Contagem', estado: 'MG', lat: -19.9317, lng: -44.0536 },
  { nome: 'Juiz de Fora', estado: 'MG', lat: -21.7642, lng: -43.3503 },
  { nome: 'Montes Claros', estado: 'MG', lat: -16.7286, lng: -43.8617 },
  { nome: 'Uberaba', estado: 'MG', lat: -19.7478, lng: -47.9317 },
  { nome: 'Aparecida de Goiânia', estado: 'GO', lat: -16.8231, lng: -49.2461 },
  { nome: 'Anápolis', estado: 'GO', lat: -16.3281, lng: -48.9528 },
  { nome: 'Rio Verde', estado: 'GO', lat: -17.7983, lng: -50.9269 },
  { nome: 'Londrina', estado: 'PR', lat: -23.3045, lng: -51.1696 },
  { nome: 'Maringá', estado: 'PR', lat: -23.4273, lng: -51.9375 },
  { nome: 'Foz do Iguaçu', estado: 'PR', lat: -25.5469, lng: -54.5882 },
  { nome: 'Cascavel', estado: 'PR', lat: -24.9578, lng: -53.4595 },
  { nome: 'Ponta Grossa', estado: 'PR', lat: -25.0944, lng: -50.1660 },
  { nome: 'Caxias do Sul', estado: 'RS', lat: -29.1678, lng: -51.1794 },
  { nome: 'Pelotas', estado: 'RS', lat: -31.7654, lng: -52.3376 },
  { nome: 'Canoas', estado: 'RS', lat: -29.9178, lng: -51.1839 },
  { nome: 'Santa Maria', estado: 'RS', lat: -29.6842, lng: -53.8069 },
  { nome: 'Gravataí', estado: 'RS', lat: -29.9439, lng: -51.0019 },
  { nome: 'Blumenau', estado: 'SC', lat: -26.9195, lng: -49.0661 },
  { nome: 'Itajaí', estado: 'SC', lat: -26.9078, lng: -48.6619 },
  { nome: 'Chapecó', estado: 'SC', lat: -27.1005, lng: -52.6156 },
  { nome: 'Criciúma', estado: 'SC', lat: -28.6775, lng: -49.3703 },
  { nome: 'Caruaru', estado: 'PE', lat: -8.2762, lng: -35.9761 },
  { nome: 'Petrolina', estado: 'PE', lat: -9.3981, lng: -40.5003 },
  { nome: 'Olinda', estado: 'PE', lat: -8.0089, lng: -34.8553 },
  { nome: 'Caucaia', estado: 'CE', lat: -3.7369, lng: -38.6531 },
  { nome: 'Juazeiro do Norte', estado: 'CE', lat: -7.2131, lng: -39.3153 },
  { nome: 'Maracanaú', estado: 'CE', lat: -3.8789, lng: -38.6258 },
  { nome: 'Vitória', estado: 'ES', lat: -20.3155, lng: -40.3128 },
  { nome: 'Serra', estado: 'ES', lat: -20.1286, lng: -40.3078 },
  { nome: 'Vila Velha', estado: 'ES', lat: -20.3297, lng: -40.2922 },
  { nome: 'Cariacica', estado: 'ES', lat: -20.2639, lng: -40.4197 },
  { nome: 'Macapá', estado: 'AP', lat: 0.0356, lng: -51.0705 },
  { nome: 'Porto Seguro', estado: 'BA', lat: -16.4442, lng: -39.0644 },
  { nome: 'Vitória da Conquista', estado: 'BA', lat: -14.8661, lng: -40.8444 },
  { nome: 'Ilhéus', estado: 'BA', lat: -14.7892, lng: -39.0292 },
  { nome: 'Camaçari', estado: 'BA', lat: -12.6994, lng: -38.3244 },
  { nome: 'Lauro de Freitas', estado: 'BA', lat: -12.8983, lng: -38.3253 },
  { nome: 'Imperatriz', estado: 'MA', lat: -5.5256, lng: -47.4917 },
  { nome: 'Palmas', estado: 'TO', lat: -10.1689, lng: -48.3317 },
  { nome: 'Macaé', estado: 'RJ', lat: -22.3706, lng: -41.7869 },
  { nome: 'Niterói', estado: 'RJ', lat: -22.8838, lng: -43.1044 },
  { nome: 'Duque de Caxias', estado: 'RJ', lat: -22.7853, lng: -43.3117 },
  { nome: 'Nova Iguaçu', estado: 'RJ', lat: -22.7592, lng: -43.4511 },
  { nome: 'Belford Roxo', estado: 'RJ', lat: -22.7644, lng: -43.3992 },
  { nome: 'São Gonçalo', estado: 'RJ', lat: -22.8269, lng: -43.0539 },
  { nome: 'Campos dos Goytacazes', estado: 'RJ', lat: -21.7621, lng: -41.3367 },
  { nome: 'Petrópolis', estado: 'RJ', lat: -22.5054, lng: -43.1789 },
  { nome: 'Volta Redonda', estado: 'RJ', lat: -22.5230, lng: -44.1044 },
  { nome: 'Maricá', estado: 'RJ', lat: -22.9189, lng: -42.8186 },
  { nome: 'Angra dos Reis', estado: 'RJ', lat: -23.0067, lng: -44.3181 },
  { nome: 'Cabo Frio', estado: 'RJ', lat: -22.8794, lng: -42.0186 },
  { nome: 'Franca', estado: 'SP', lat: -20.5386, lng: -47.4008 },
  { nome: 'Limeira', estado: 'SP', lat: -22.5636, lng: -47.4019 },
  { nome: 'Taubaté', estado: 'SP', lat: -23.0261, lng: -45.5553 },
  { nome: 'Jundiaí', estado: 'SP', lat: -23.1864, lng: -46.8842 },
  { nome: 'Praia Grande', estado: 'SP', lat: -24.0056, lng: -46.4033 },
  { nome: 'Suzano', estado: 'SP', lat: -23.5422, lng: -46.3111 },
  { nome: 'Carapicuíba', estado: 'SP', lat: -23.5228, lng: -46.8350 },
  { nome: 'Itaquaquecetuba', estado: 'SP', lat: -23.4869, lng: -46.3489 },
  { nome: 'Barueri', estado: 'SP', lat: -23.5022, lng: -46.8756 },
  { nome: 'Santana de Parnaíba', estado: 'SP', lat: -23.4439, lng: -46.9178 },
  { nome: 'Mogi das Cruzes', estado: 'SP', lat: -23.5228, lng: -46.1853 },
  { nome: 'Indaiatuba', estado: 'SP', lat: -23.0850, lng: -47.2172 },
  { nome: 'Americana', estado: 'SP', lat: -22.7386, lng: -47.3322 },
  { nome: 'Rio Claro', estado: 'SP', lat: -22.4156, lng: -47.5603 },
  { nome: 'Araraquara', estado: 'SP', lat: -21.7945, lng: -48.1756 },
  { nome: 'Marília', estado: 'SP', lat: -22.2158, lng: -49.9456 },
  { nome: 'Presidente Prudente', estado: 'SP', lat: -22.1256, lng: -51.3886 },
  { nome: 'São Carlos', estado: 'SP', lat: -22.0156, lng: -47.8911 },
  { nome: 'Araçatuba', estado: 'SP', lat: -21.2089, lng: -50.4322 },
  { nome: 'Botucatu', estado: 'SP', lat: -22.8856, lng: -48.4467 },
  { nome: 'Hortolândia', estado: 'SP', lat: -22.8586, lng: -47.2200 },
  { nome: 'Embu das Artes', estado: 'SP', lat: -23.6489, lng: -46.8517 },
  { nome: 'Taboão da Serra', estado: 'SP', lat: -23.6022, lng: -46.7586 },
  { nome: 'Cotia', estado: 'SP', lat: -23.6039, lng: -46.9197 },
  { nome: 'Jacareí', estado: 'SP', lat: -23.2994, lng: -45.9653 },
  { nome: 'Guarujá', estado: 'SP', lat: -23.9939, lng: -46.2556 },
  { nome: 'Itapevi', estado: 'SP', lat: -23.5486, lng: -46.9350 },
  { nome: 'Francisco Morato', estado: 'SP', lat: -23.2814, lng: -46.7428 },
  { nome: 'Pindamonhangaba', estado: 'SP', lat: -22.9239, lng: -45.4608 },
  { nome: 'Atibaia', estado: 'SP', lat: -23.1172, lng: -46.5514 },
  { nome: 'Itatiba', estado: 'SP', lat: -23.0056, lng: -46.8386 },
  { nome: 'Valinhos', estado: 'SP', lat: -22.9728, lng: -46.9964 },
  { nome: 'Vinhedo', estado: 'SP', lat: -23.0286, lng: -46.9750 },
  { nome: 'Itupeva', estado: 'SP', lat: -23.1539, lng: -47.0561 },
  { nome: 'Leme', estado: 'SP', lat: -22.1856, lng: -47.3897 },
  { nome: 'Araras', estado: 'SP', lat: -22.3556, lng: -47.3836 },
  { nome: 'Ourinhos', estado: 'SP', lat: -22.9789, lng: -49.8700 },
  { nome: 'Bragança Paulista', estado: 'SP', lat: -22.9528, lng: -46.5417 },
  { nome: 'Campo Limpo Paulista', estado: 'SP', lat: -23.2119, lng: -46.7883 },
  { nome: 'Várzea Paulista', estado: 'SP', lat: -23.2119, lng: -46.8278 },
  { nome: 'Ibiúna', estado: 'SP', lat: -23.6572, lng: -47.2228 },
  { nome: 'Poços de Caldas', estado: 'MG', lat: -21.7869, lng: -46.5619 },
  { nome: 'Divinópolis', estado: 'MG', lat: -20.1386, lng: -44.8839 },
  { nome: 'Ipatinga', estado: 'MG', lat: -19.4678, lng: -42.5367 },
  { nome: 'Governador Valadares', estado: 'MG', lat: -18.8511, lng: -41.9494 },
  { nome: 'Coronel Fabriciano', estado: 'MG', lat: -19.5186, lng: -42.6278 },
  { nome: 'Sete Lagoas', estado: 'MG', lat: -19.4653, lng: -44.2467 },
  { nome: 'Barbacena', estado: 'MG', lat: -21.2264, lng: -43.7744 },
  { nome: 'Varginha', estado: 'MG', lat: -21.5514, lng: -45.4297 },
  { nome: 'Patos de Minas', estado: 'MG', lat: -18.5789, lng: -46.5178 },
  { nome: 'Passos', estado: 'MG', lat: -20.7189, lng: -46.6097 },
  { nome: 'Muriaé', estado: 'MG', lat: -21.1311, lng: -42.3667 },
  { nome: 'Ubá', estado: 'MG', lat: -21.1186, lng: -42.9417 },
  { nome: 'Itabira', estado: 'MG', lat: -19.6189, lng: -43.2267 },
  { nome: 'Santa Luzia', estado: 'MG', lat: -19.7711, lng: -43.8517 },
  { nome: 'Ribeirão das Neves', estado: 'MG', lat: -19.7689, lng: -44.0847 },
  { nome: 'Sabará', estado: 'MG', lat: -19.8911, lng: -43.8097 },
  { nome: 'Araguaína', estado: 'TO', lat: -7.1914, lng: -48.2044 },
  { nome: 'Sinop', estado: 'MT', lat: -11.8650, lng: -55.5050 },
  { nome: 'Várzea Grande', estado: 'MT', lat: -15.6464, lng: -56.1322 },
  { nome: 'Rondonópolis', estado: 'MT', lat: -16.4703, lng: -54.6358 },
  { nome: 'Dourados', estado: 'MS', lat: -22.2231, lng: -54.8056 },
  { nome: 'Corumbá', estado: 'MS', lat: -19.0089, lng: -57.6500 },
  { nome: 'Três Lagoas', estado: 'MS', lat: -20.7514, lng: -51.6783 },
  { nome: 'Rio Branco', estado: 'AC', lat: -9.9753, lng: -67.8250 },
  { nome: 'Boa Vista', estado: 'RR', lat: 2.8197, lng: -60.6733 },
  { nome: 'Ji-Paraná', estado: 'RO', lat: -10.8800, lng: -61.9494 },
  { nome: 'Mossoró', estado: 'RN', lat: -5.1878, lng: -37.3444 },
  { nome: 'Parnamirim', estado: 'RN', lat: -5.9147, lng: -35.2633 },
  { nome: 'Caicó', estado: 'RN', lat: -6.4583, lng: -37.0986 },
  { nome: 'Campina Grande', estado: 'PB', lat: -7.2306, lng: -35.8811 },
  { nome: 'Santa Rita', estado: 'PB', lat: -7.1164, lng: -34.9783 },
  { nome: 'Patos', estado: 'PB', lat: -7.0244, lng: -37.2811 },
  { nome: 'Sobral', estado: 'CE', lat: -3.6861, lng: -40.3500 },
  { nome: 'Crato', estado: 'CE', lat: -7.2344, lng: -39.4094 },
  { nome: 'Garanhuns', estado: 'PE', lat: -8.8900, lng: -36.4961 },
  { nome: 'Paulista', estado: 'PE', lat: -7.9414, lng: -34.8733 },
  { nome: 'Arapiraca', estado: 'AL', lat: -9.7525, lng: -36.6619 },
  { nome: 'Palmeira dos Índios', estado: 'AL', lat: -9.4083, lng: -36.6294 },
  { nome: 'Itabuna', estado: 'BA', lat: -14.7858, lng: -39.2803 },
  { nome: 'Juazeiro', estado: 'BA', lat: -9.4264, lng: -40.5025 },
  { nome: 'Teixeira de Freitas', estado: 'BA', lat: -17.5358, lng: -39.7436 },
  { nome: 'Barreiras', estado: 'BA', lat: -12.1522, lng: -44.9903 },
  { nome: 'Jequié', estado: 'BA', lat: -13.8569, lng: -40.0819 },
  { nome: 'Alagoinhas', estado: 'BA', lat: -12.1342, lng: -38.4194 },
  { nome: 'Caxias', estado: 'MA', lat: -4.8622, lng: -43.3553 },
  { nome: 'Timon', estado: 'MA', lat: -5.0961, lng: -42.8353 },
  { nome: 'Codó', estado: 'MA', lat: -4.4533, lng: -43.8853 },
  { nome: 'Santarém', estado: 'PA', lat: -2.4433, lng: -54.7083 },
  { nome: 'Ananindeua', estado: 'PA', lat: -1.3656, lng: -48.3728 },
  { nome: 'Marabá', estado: 'PA', lat: -5.3686, lng: -49.1178 },
  { nome: 'Castanhal', estado: 'PA', lat: -1.2944, lng: -47.9253 },
  { nome: 'Parauapebas', estado: 'PA', lat: -6.0689, lng: -49.9019 },
  { nome: 'Novo Hamburgo', estado: 'RS', lat: -29.6781, lng: -51.1306 },
  { nome: 'São Leopoldo', estado: 'RS', lat: -29.7606, lng: -51.1494 },
  { nome: 'Passo Fundo', estado: 'RS', lat: -28.2633, lng: -52.4069 },
  { nome: 'Cachoeirinha', estado: 'RS', lat: -29.9486, lng: -51.0939 },
  { nome: 'Alvorada', estado: 'RS', lat: -29.9906, lng: -51.0819 },
  { nome: 'Viamão', estado: 'RS', lat: -30.0811, lng: -51.0233 },
  { nome: 'Sapucaia do Sul', estado: 'RS', lat: -29.8253, lng: -51.1494 },
  { nome: 'Erechim', estado: 'RS', lat: -27.6342, lng: -52.2733 },
  { nome: 'Uruguaiana', estado: 'RS', lat: -29.7544, lng: -57.0872 },
  { nome: 'Bagé', estado: 'RS', lat: -31.3281, lng: -54.1006 },
  { nome: 'Palhoça', estado: 'SC', lat: -27.6447, lng: -48.6681 },
  { nome: 'Lages', estado: 'SC', lat: -27.8161, lng: -50.3261 },
  { nome: 'São José', estado: 'SC', lat: -27.5953, lng: -48.6361 },
  { nome: 'Balneário Camboriú', estado: 'SC', lat: -26.9906, lng: -48.6347 },
  { nome: 'Brusque', estado: 'SC', lat: -27.0997, lng: -48.9153 },
  { nome: 'Caçador', estado: 'SC', lat: -26.7742, lng: -50.9961 },
  { nome: 'Colombo', estado: 'PR', lat: -25.2931, lng: -49.2236 },
  { nome: 'Apucarana', estado: 'PR', lat: -23.5511, lng: -51.4611 },
  { nome: 'Guarapuava', estado: 'PR', lat: -25.3878, lng: -51.4619 },
  { nome: 'Toledo', estado: 'PR', lat: -24.7242, lng: -53.7428 },
  { nome: 'Pinhais', estado: 'PR', lat: -25.4428, lng: -49.1944 },
  { nome: 'São José dos Pinhais', estado: 'PR', lat: -25.5361, lng: -49.2072 },
  { nome: 'Araucária', estado: 'PR', lat: -25.5925, lng: -49.4097 },
  { nome: 'Campo Largo', estado: 'PR', lat: -25.4594, lng: -49.5278 },
  { nome: 'Umuarama', estado: 'PR', lat: -23.7661, lng: -53.3261 },
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

async function main() {
  const outputFile = './lib/farmacias-coletadas.json'
  let farmacias = []
  if (fs.existsSync(outputFile)) {
    farmacias = JSON.parse(fs.readFileSync(outputFile))
    console.log('Continuando de ' + farmacias.length + ' farmácias já coletadas')
  }
  const idsExistentes = new Set(farmacias.map(f => f.place_id))

  for (const cidade of CIDADES) {
    console.log('Buscando em ' + cidade.nome + ', ' + cidade.estado + '...')
    let pageToken = null
    let pagina = 1

    do {
      try {
        if (pageToken) await sleep(2000)
        let url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + cidade.lat + ',' + cidade.lng + '&radius=10000&type=pharmacy&language=pt-BR&key=' + KEY
        if (pageToken) url += '&pagetoken=' + pageToken
        const data = await get(url)
        if (!data.results || data.results.length === 0) break

        const novas = data.results
          .filter(p => !idsExistentes.has(p.place_id))
          .map(p => {
            const vic = p.vicinity || ''
            const partes = vic.split(',')
            let bairro = partes.length > 1 ? partes[partes.length - 2].trim() : cidade.nome
            if (!bairro || bairro.trim().length < 3 || /^\d/.test(bairro.trim())) bairro = cidade.nome
            return {
              place_id: p.place_id,
              nome: p.name,
              endereco: vic,
              bairro: bairro,
              cidade: cidade.nome,
              estado: cidade.estado,
              lat: p.geometry.location.lat,
              lng: p.geometry.location.lng,
              avaliacao: p.rating || null,
              rede: detectarRede(p.name),
            }
          })

        novas.forEach(f => idsExistentes.add(f.place_id))
        farmacias.push(...novas)
        console.log('  Pág ' + pagina + ': ' + novas.length + ' novas (total: ' + farmacias.length + ')')
        fs.writeFileSync(outputFile, JSON.stringify(farmacias, null, 2))
        pageToken = data.next_page_token || null
        pagina++
        await sleep(400)
      } catch(e) {
        console.error('  Erro: ' + e.message)
        break
      }
    } while (pageToken && pagina <= 3)
  }

  console.log('\nFinalizado! ' + farmacias.length + ' farmácias salvas.')
}

main()
