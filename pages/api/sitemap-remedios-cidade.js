// Sitemap paginado para /remedio/[slug]/[cidade]
// Gera combinações: medicamentos com preços × cidades com farmácias
import { getSupabase } from '../../lib/supabase'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 1
  const perPage = 1000
  const supabase = getSupabase()
  const base = 'https://farmaciaai.com.br'
  const today = new Date().toISOString().split('T')[0]

  // Slugs de medicamentos que têm preços (deduplicados via norm)
  const { data: precosData } = await supabase
    .from('precos')
    .select('medicamento')

  const medSlugs = [...new Set(
    (precosData || []).map(p => norm(p.medicamento)).filter(s => s && s.length > 2)
  )].sort()

  // Slugs de cidades (via função agrupada para eficiência)
  const { data: cidadesData } = await supabase.rpc('cidades_agrupadas')

  const cidadeSlugs = []
  for (const [estado, cidades] of Object.entries(cidadesData || {})) {
    for (const c of cidades) {
      cidadeSlugs.push(`${norm(c.nome)}-${estado.toLowerCase()}`)
    }
  }
  cidadeSlugs.sort()

  const total = medSlugs.length * cidadeSlugs.length
  const from = (page - 1) * perPage
  const to = Math.min(from + perPage, total)

  if (from >= total || medSlugs.length === 0 || cidadeSlugs.length === 0) {
    res.status(404).end()
    return
  }

  const urls = []
  for (let i = from; i < to; i++) {
    const medIdx = Math.floor(i / cidadeSlugs.length)
    const cidadeIdx = i % cidadeSlugs.length
    const medSlug = medSlugs[medIdx]
    const cidadeSlug = cidadeSlugs[cidadeIdx]
    if (medSlug && cidadeSlug) {
      urls.push(`  <url>
    <loc>${base}/remedio/${medSlug}/${cidadeSlug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
    <lastmod>${today}</lastmod>
  </url>`)
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.send(sitemap)
}
