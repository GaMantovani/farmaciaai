// lib/scraper.js — Motor de busca de preços via Apify REST API

import axios from 'axios'

const APIFY_TOKEN = process.env.APIFY_TOKEN
const APIFY_BASE = 'https://api.apify.com/v2'

// Cache simples em memória (4 horas)
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

// Farmácias com suas URLs de busca
const FARMACIAS = [
  { id: 'ultrafarma',     nome: 'Ultrafarma',            cor: '#e31e25', url: (q) => `https://www.ultrafarma.com.br/busca?q=${encodeURIComponent(q)}`,        entrega: 'Todo o Brasil' },
  { id: 'drogasil',       nome: 'Drogasil',              cor: '#009b3a', url: (q) => `https://www.drogasil.com.br/busca?q=${encodeURIComponent(q)}`,          entrega: 'Todo o Brasil' },
  { id: 'drogaraia',      nome: 'Droga Raia',            cor: '#0066cc', url: (q) => `https://www.drogaraia.com.br/busca?q=${encodeURIComponent(q)}`,         entrega: 'Todo o Brasil' },
  { id: 'paguemenos',     nome: 'Pague Menos',           cor: '#f7941d', url: (q) => `https://www.paguemenos.com.br/busca?q=${encodeURIComponent(q)}`,        entrega: 'Todo o Brasil' },
  { id: 'panvel',         nome: 'Panvel',                cor: '#00843d', url: (q) => `https://www.panvel.com/panvel/busca.do?textoPesquisa=${encodeURIComponent(q)}`, entrega: 'Sul e Sudeste' },
  { id: 'drogsp',         nome: 'Drogaria SP',           cor: '#cc0000', url: (q) => `https://www.drogariasaopaulo.com.br/busca?q=${encodeURIComponent(q)}`,  entrega: 'São Paulo' },
  { id: 'drogal',         nome: 'Drogal',                cor: '#c8151b', url: (q) => `https://www.drogal.com.br/busca?q=${encodeURIComponent(q)}`,            entrega: 'Interior SP e MG' },
  { id: 'promofarma',     nome: 'PromoFarma',            cor: '#00aeef', url: (q) => `https://www.promofarma.com.br/busca?q=${encodeURIComponent(q)}`,        entrega: 'São Paulo' },
  { id: 'netfarma',       nome: 'Netfarma',              cor: '#ff6600', url: (q) => `https://www.netfarma.com.br/busca?q=${encodeURIComponent(q)}`,          entrega: 'Todo o Brasil' },
  { id: 'catarinense',    nome: 'Drogaria Catarinense',  cor: '#e2001a', url: (q) => `https://www.drogacatarinense.com.br/busca?q=${encodeURIComponent(q)}`,  entrega: 'Sul do Brasil' },
  { id: 'nissei',         nome: 'Farmácias Nissei',      cor: '#005baa', url: (q) => `https://www.nissei.com.br/busca?q=${encodeURIComponent(q)}`,            entrega: 'Paraná' },
  { id: 'mevofarma',      nome: 'Mevo Farma',            cor: '#6c3483', url: (q) => `https://www.mevofarma.com.br/busca?q=${encodeURIComponent(q)}`,         entrega: 'Todo o Brasil' },
]

// Configurações de scraping por farmácia (seletores CSS)
const SCRAPERS_CONFIG = FARMACIAS.map(f => ({
  url: f.url('__QUERY__'), // placeholder substituído na hora
  farmacia_id: f.id,
  farmacia_nome: f.nome,
  farmacia_cor: f.cor,
  entrega: f.entrega,
}))

async function rodarApifyScraper(query) {
  if (!APIFY_TOKEN) {
    console.error('APIFY_TOKEN não configurado')
    return []
  }

  // Monta as URLs de busca para todas as farmácias
  const startUrls = FARMACIAS.map(f => ({
    url: f.url(query),
    userData: {
      farmacia_id: f.id,
      farmacia_nome: f.nome,
      farmacia_cor: f.cor,
      entrega: f.entrega,
    }
  }))

  // Usa o Actor público "apify/cheerio-scraper" para extrair preços
  const input = {
    startUrls,
    runMode: 'PRODUCTION',
    pageFunction: `async function pageFunction(context) {
      const { $, request } = context;
      const { farmacia_id, farmacia_nome, farmacia_cor, entrega } = request.userData;
      const results = [];
      
      // Seletores genéricos que funcionam na maioria dos e-commerces
      const selectors = [
        '[class*="product"]', '[class*="Product"]',
        '[class*="item"]', '[class*="Item"]',
        '.vitrine li', '.prateleira li',
      ];
      
      for (const sel of selectors) {
        $(sel).each(function(i) {
          if (i >= 5) return false;
          const el = $(this);
          const nome = el.find('[class*="name"],[class*="title"],[class*="nome"],h2,h3').first().text().trim();
          const precoText = el.find('[class*="price"],[class*="preco"],[class*="Price"]').first().text().trim();
          const preco = parseFloat(precoText.replace(/[^0-9,]/g, '').replace(',', '.'));
          const link = el.find('a').first().attr('href');
          
          if (nome && preco > 0 && preco < 5000) {
            results.push({
              farmacia: farmacia_nome,
              farmacia_id,
              nome: nome.substring(0, 80),
              preco,
              url: link ? (link.startsWith('http') ? link : 'https://' + request.loadedUrl.split('/')[2] + link) : request.loadedUrl,
              logo_cor: farmacia_cor,
              entrega,
            });
          }
        });
        if (results.length > 0) break;
      }
      
      return results;
    }`,
    maxRequestsPerCrawl: 12,
    maxConcurrency: 6,
  }

  try {
    // Inicia o run do Actor
    const runRes = await axios.post(
      `${APIFY_BASE}/acts/apify~cheerio-scraper/runs?token=${APIFY_TOKEN}&waitForFinish=120`,
      input,
      { headers: { 'Content-Type': 'application/json' }, timeout: 130000 }
    )

    const runId = runRes.data?.data?.id
    if (!runId) return []

    // Busca os resultados do dataset
    const datasetId = runRes.data?.data?.defaultDatasetId
    if (!datasetId) return []

    const resultsRes = await axios.get(
      `${APIFY_BASE}/datasets/${datasetId}/items?token=${APIFY_TOKEN}&clean=true`,
      { timeout: 15000 }
    )

    const items = resultsRes.data || []
    // Os items vêm como arrays dentro de arrays — achata tudo
    const flat = items.flat().filter(r => r && r.preco > 0)
    return flat

  } catch (e) {
    console.error('Apify error:', e.message)
    return []
  }
}

// ── FUNÇÃO PRINCIPAL ────────────────────────────────────────────────────────

export async function buscarPrecos(query) {
  const cacheKey = `precos:${query.toLowerCase().trim()}`
  const cached = getCache(cacheKey)
  if (cached) return cached

  const todos = await rodarApifyScraper(query)

  // Filtra resultados relevantes
  const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 3)
  const filtrados = todos.filter(r => {
    if (!r.nome) return false
    const nomeL = r.nome.toLowerCase()
    return queryWords.length === 0 || queryWords.some(w => nomeL.includes(w))
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

// Busca CEP via ViaCEP (gratuito)
export async function buscarCEP(cep) {
  const cepLimpo = cep.replace(/\D/g, '')
  if (cepLimpo.length !== 8) return null
  try {
    const { data } = await axios.get(
      `https://viacep.com.br/ws/${cepLimpo}/json/`,
      { timeout: 5000 }
    )
    if (data.erro) return null
    return {
      cep: data.cep,
      logradouro: data.logradouro,
      bairro: data.bairro,
      cidade: data.localidade,
      estado: data.uf,
    }
  } catch (e) {
    return null
  }
}
