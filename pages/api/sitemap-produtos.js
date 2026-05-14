import { getSupabase } from '../../lib/supabase'

export default async function handler(req, res) {
  const page = parseInt(req.query.page) || 1
  const perPage = 1000
  const from = (page - 1) * perPage
  const supabase = getSupabase()
  const base = 'https://farmaciaai.com.br'
  const today = new Date().toISOString().split('T')[0]

  const { data: produtos } = await supabase
    .from('produtos')
    .select('slug')
    .not('slug', 'is', null)
    .gt('slug', '')
    .order('slug')
    .range(from, from + perPage - 1)

  if (!produtos || produtos.length === 0) {
    res.status(404).end()
    return
  }

  const urls = produtos.map(p => `  <url>
    <loc>${base}/produto/${p.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>${today}</lastmod>
  </url>`).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.send(sitemap)
}
