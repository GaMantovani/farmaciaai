// lib/scraper.js — Motor de busca de preços via scraping

import axios from 'axios'
import * as cheerio from 'cheerio'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
}

// Cache simples em memória (em produção: Redis)
const cache = new Map()
const CACHE_TTL = 4 * 60 * 60 * 1000 // 4 horas

function getCache(key) {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(key); return null }
  return entry.data
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() })
}

// ── SCRAPERS POR FARMÁCIA ──────────────────────────────────────────────────

async function scrapeUltrafarma(query) {
  try {
    const url = `https://www.ultrafarma.com.br/busca?q=${encodeURIComponent(query)}`
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const $ = cheerio.load(data)
    const results = []
    $('.product-item, .vitrine-produto, [class*="product"]').each((i, el) => {
      if (i >= 5) return
      const nome = $(el).find('[class*="name"], [class*="title"], h2, h3').first().text().trim()
      const precoText = $(el).find('[class*="price"], [class*="preco"]').first().text().trim()
      const preco = parseFloat(precoText.replace(/[^\d,]/g, '').replace(',', '.'))
      const link = $(el).find('a').first().attr('href')
      if (nome && preco > 0) {
        results.push({
          farmacia: 'Ultrafarma',
          farmacia_id: 'ultrafarma',
          nome: nome.substring(0, 80),
          preco,
          url: link?.startsWith('http') ? link : `https://www.ultrafarma.com.br${link}`,
          logo_cor: '#e31e25',
          entrega: 'Todo o Brasil',
        })
      }
    })
    return results
  } catch (e) {
    console.error('Ultrafarma scrape error:', e.message)
    return []
  }
}

async function scrapeDrogasil(query) {
  try {
    const url = `https://www.drogasil.com.br/busca?q=${encodeURIComponent(query)}`
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const $ = cheerio.load(data)
    const results = []
    $('[class*="ProductCard"], [class*="product-card"], .product').each((i, el) => {
      if (i >= 5) return
      const nome = $(el).find('[class*="name"], [class*="title"]').first().text().trim()
      const precoText = $(el).find('[class*="price"], [class*="preco"], [class*="Price"]').first().text().trim()
      const preco = parseFloat(precoText.replace(/[^\d,]/g, '').replace(',', '.'))
      const link = $(el).find('a').first().attr('href')
      if (nome && preco > 0) {
        results.push({
          farmacia: 'Drogasil',
          farmacia_id: 'drogasil',
          nome: nome.substring(0, 80),
          preco,
          url: link?.startsWith('http') ? link : `https://www.drogasil.com.br${link}`,
          logo_cor: '#009b3a',
          entrega: 'Todo o Brasil',
        })
      }
    })
    return results
  } catch (e) {
    console.error('Drogasil scrape error:', e.message)
    return []
  }
}

async function scrapePagueMenos(query) {
  try {
    const url = `https://www.paguemenos.com.br/busca?q=${encodeURIComponent(query)}`
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const $ = cheerio.load(data)
    const results = []
    $('[class*="product"], [class*="Product"]').each((i, el) => {
      if (i >= 5) return
      const nome = $(el).find('[class*="name"], [class*="title"]').first().text().trim()
      const precoText = $(el).find('[class*="price"], [class*="Price"]').first().text().trim()
      const preco = parseFloat(precoText.replace(/[^\d,]/g, '').replace(',', '.'))
      const link = $(el).find('a').first().attr('href')
      if (nome && preco > 0) {
        results.push({
          farmacia: 'Pague Menos',
          farmacia_id: 'paguemenos',
          nome: nome.substring(0, 80),
          preco,
          url: link?.startsWith('http') ? link : `https://www.paguemenos.com.br${link}`,
          logo_cor: '#f7941d',
          entrega: 'Todo o Brasil',
        })
      }
    })
    return results
  } catch (e) {
    console.error('Pague Menos scrape error:', e.message)
    return []
  }
}

async function scrapeDrogal(query) {
  try {
    const url = `https://www.drogal.com.br/busca?q=${encodeURIComponent(query)}`
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const $ = cheerio.load(data)
    const results = []
    $('[class*="product"], [class*="Product"], .prateleira li').each((i, el) => {
      if (i >= 5) return
      const nome = $(el).find('[class*="name"], [class*="nome"], h2, h3').first().text().trim()
      const precoText = $(el).find('[class*="price"], [class*="preco"]').first().text().trim()
      const preco = parseFloat(precoText.replace(/[^\d,]/g, '').replace(',', '.'))
      const link = $(el).find('a').first().attr('href')
      if (nome && preco > 0) {
        results.push({
          farmacia: 'Drogal',
          farmacia_id: 'drogal',
          nome: nome.substring(0, 80),
          preco,
          url: link?.startsWith('http') ? link : `https://www.drogal.com.br${link}`,
          logo_cor: '#c8151b',
          entrega: 'Interior SP e Sul de MG',
        })
      }
    })
    return results
  } catch (e) {
    console.error('Drogal scrape error:', e.message)
    return []
  }
}

async function scrapePromofarma(query) {
  try {
    const url = `https://www.promofarma.com.br/busca?q=${encodeURIComponent(query)}`
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 8000 })
    const $ = cheerio.load(data)
    const results = []
    $('[class*="product"], [class*="Product"]').each((i, el) => {
      if (i >= 5) return
      const nome = $(el).find('[class*="name"], [class*="title"]').first().text().trim()
      const precoText = $(el).find('[class*="price"], [class*="preco"]').first().text().trim()
      const preco = parseFloat(precoText.replace(/[^\d,]/g, '').replace(',', '.'))
      const link = $(el).find('a').first().attr('href')
      if (nome && preco > 0) {
        results.push({
          farmacia: 'PromoFarma',
          farmacia_id: 'promofarma',
          nome: nome.substring(0, 80),
          preco,
          url: link?.startsWith('http') ? link : `https://www.promofarma.com.br${link}`,
          logo_cor: '#00aeef',
          entrega: 'São Paulo e região',
        })
      }
    })
    return results
  } catch (e) {
    console.error('PromoFarma scrape error:', e.message)
    return []
  }
}

// ── ORQUESTRADOR PRINCIPAL ─────────────────────────────────────────────────

export async function buscarPrecos(query) {
  const cacheKey = `precos:${query.toLowerCase().trim()}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  // Executa todos os scrapers em paralelo
  const [ultrafarma, drogasil, paguemenos, drogal, promofarma] = await Promise.allSettled([
    scrapeUltrafarma(query),
    scrapeDrogasil(query),
    scrapePagueMenos(query),
    scrapeDrogal(query),
    scrapePromofarma(query),
  ])

  const todos = [
    ...(ultrafarma.status === 'fulfilled' ? ultrafarma.value : []),
    ...(drogasil.status === 'fulfilled' ? drogasil.value : []),
    ...(paguemenos.status === 'fulfilled' ? paguemenos.value : []),
    ...(drogal.status === 'fulfilled' ? drogal.value : []),
    ...(promofarma.status === 'fulfilled' ? promofarma.value : []),
  ]

  // Filtra resultados relevantes: nome deve conter parte da query
  const queryWords = query.toLowerCase().split(' ')
  const filtrados = todos.filter(r => {
    const nomeL = r.nome.toLowerCase()
    return queryWords.some(w => w.length > 3 && nomeL.includes(w))
  })

  // Ordena pelo menor preço
  const ordenados = filtrados.sort((a, b) => a.preco - b.preco)

  const resultado = {
    query,
    total: ordenados.length,
    atualizado_em: new Date().toISOString(),
    resultados: ordenados,
  }

  setCache(cacheKey, resultado)
  return resultado
}

// Busca CEP via ViaCEP (gratuito, sem autenticação)
export async function buscarCEP(cep) {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) return null
  try {
    const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`, { timeout: 5000 })
    if (data.erro) return null
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
      lat: null,
      lng: null,
    }
  } catch (e) {
    return null
  }
}
