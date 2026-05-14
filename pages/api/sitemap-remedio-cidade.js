// pages/api/sitemap-remedio-cidade.js
// Paginated sitemap: 10 meds × all cities per page (~50k URLs each)
import { getSupabase } from '../../lib/supabase'

const MEDS_PER_PAGE = 10

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

  const [medsResult, cidadesResult] = await Promise.all([
    supabase
      .from('medicamentos')
      .select('slug')
      .eq('tem_preco', true)
      .order('slug')
      .range(page * MEDS_PER_PAGE, (page + 1) * MEDS_PER_PAGE - 1),
    supabase.rpc('cidades_agrupadas'),
  ])

  if (!medsResult.data || medsResult.data.length === 0) {
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
  for (const med of medsResult.data) {
    for (const cidade of cidades) {
      linhas.push(`<url><loc>https://farmaciaai.com.br/remedio/${med.slug}/${cidade}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.6</priority></url>`)
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${linhas.join('')}</urlset>`

  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800')
  res.end(xml)
}
