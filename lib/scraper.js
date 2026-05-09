import axios from 'axios'

const cache = new Map()
const CACHE_TTL = 4 * 60 * 60 * 1000

function getCache(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null }
  return entry.data
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

const FARMACIAS_VTEX = [
  { id: 'drogal',      nome: 'Drogal',           cor: '#c8151b', base: 'www.drogal.com.br',             entrega: 'Interior SP e MG' },
  { id: 'drogaraia',   nome: 'Droga Raia',        cor: '#0066cc', base: 'www.drogaraia.com.br',          entrega: 'Todo o Brasil' },
  { id: 'drogasil',    nome: 'Drogasil',          cor: '#009b3a', base: 'www.drogasil.com.br',           entrega: 'Todo o Brasil' },
  { id: 'paguemenos',  nome: 'Pague Menos',       cor: '#f7941d', base: 'www.paguemenos.com.br',         entrega: 'Todo o Brasil' },
  { id: 'panvel',      nome: 'Panvel',            cor: '#00843d', base: 'www.panvel.com',                entrega: 'Sul e Sudeste' },
  { id: 'drogsp',      nome: 'Drogaria SP',       cor: '#cc0000', base: 'www.drogariasaopaulo.com.br',   entrega: 'São Paulo' },
  { id: 'promofarma',  nome: 'PromoFarma',        cor: '#00aeef', base: 'www.promofarma.com.br',         entrega: 'São Paulo' },
  { id: 'catarinense', nome: 'Drog. Catarinense', cor: '#e2001a', base: 'www.drogacatarinense.com.br',   entrega: 'Sul do Brasil' },
  { id: 'nissei',      nome: 'Farmácias Nissei',  cor: '#005baa', base: 'www.nissei.com.br',             entrega: 'Paraná' },
]

async function buscarVTEX(farmacia, query) {
  try {
    const url = `https://${farmacia.base}/api/catalog_system/pub/products/search/${encodeURIComponent(query)}?_from=0&_to=4`
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      timeout: 8000
    })

    if (!Array.isArray(data)) return []

    return data.slice(0, 3).map(produto => {
      const item = produto.items?.[0]
      const seller = item?.sellers?.[0]
      const preco = seller?.commertialOffer?.Price || 0
      if (!preco) return null

      return {
        farmacia: farmacia.nome,
        farmacia_id: farmacia.id,
        nome: produto.productName?.substring(0, 80) || '',
        preco,
        url: `https://${farmacia.base}/${produto.linkText}/p`,
        logo_cor: farmacia.cor,
        entrega: farmacia.entrega,
      }
    }).filter(Boolean)

  } catch (e) {
    return []
  }
}

export async function buscarPrecos(query) {
  const cacheKey = `precos:${query.toLowerCase().trim()}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const resultados = await Promise.allSettled(
    FARMACIAS_VTEX.map(f => buscarVTEX(f, query))
  )

  const todos = resultados
    .filter(r => r.status === 'fulfilled')
    .flatMap(r => r.value)
    .filter(r => r && r.preco > 0)
    .sort((a, b) => a.preco - b.preco)

  const resultado = {
    query,
    total: todos.length,
    atualizado_em: new Date().toISOString(),
    resultados: todos,
  }

  setCache(cacheKey, resultado)
  return resultado
}

export async function buscarCEP(cep) {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) return null
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, { timeout: 5000 })
    if (data.erro) return null
    return { cep: data.cep, logradouro: data.logradouro, bairro: data.bairro, cidade: data.localidade, estado: data.uf }
  } catch (e) {
    return null
  }
}
