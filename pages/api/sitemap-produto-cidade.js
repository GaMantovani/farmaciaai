// pages/api/sitemap-produto-cidade.js
// Paginated sitemap: 10 products × all cities per page (~50k URLs each)
import { getSupabase } from '../../lib/supabase'

const PRODUTOS_PER_PAGE = 10

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 0
  const supabase = getSupabase()

  const [produtosResult, cidadesResult] = await Promise.all([
    supabase
      .from('produtos')
      .select('slug')
      .not('slug', 'is', null)
      .gt('slug', '')
      .order('slug')
      .range(page * PRODUTOS_PER_PAGE, (page + 1) * PRODUTOS_PER_PAGE - 1),
    supabase.rpc('cidades_agrupadas'),
  ])

  if (!produtosResult.data || produtosResult.data.length === 0) {
    return res.status(404).end()
  }

  const cidades = []
  for (const [estado, lista] of Object.entries(cidadesResult.data || {})) {
    for (const c of lista) {
      cidades.push(`${norm(c.nome)}-${estado.toLowerCase()}`)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const linhas = []
  for (const prod of produtosResult.data) {
    for (const cidade of cidades) {
      linhas.push(`<url><loc>https://farmaciaai.com.br/produto/${prod.slug}/${cidade}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.5</priority></url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${linhas.join('')}</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  res.end(xml)
}
