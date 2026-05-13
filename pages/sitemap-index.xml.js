import { getSupabase } from '../lib/supabase'

export async function getServerSideProps({ res }) {
  const base = 'https://farmaciaai.com.br'
  const today = new Date().toISOString().split('T')[0]

  const supabase = getSupabase()
  const { count } = await supabase
    .from('farmacias_fisicas')
    .select('id', { count: 'exact', head: true })
    .not('nome', 'is', null)
    .not('cidade', 'is', null)

  const totalPages = Math.ceil((count || 75000) / 1000)

  const farmaciasSitemaps = Array.from({ length: totalPages }, (_, i) => `  <sitemap>
    <loc>${base}/sitemap-farmacias-${i + 1}.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
${farmaciasSitemaps}
</sitemapindex>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default function SitemapIndex() {}
