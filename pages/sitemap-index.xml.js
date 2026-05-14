import { getSupabase } from '../lib/supabase'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function getServerSideProps({ res }) {
  const base = 'https://farmaciaai.com.br'
  const today = new Date().toISOString().split('T')[0]

  const supabase = getSupabase()

  // Contagens em paralelo
  const [
    { count: countFarmacias },
    { count: countProdutos },
    { data: precosData },
    { data: cidadesData },
  ] = await Promise.all([
    supabase.from('farmacias_fisicas').select('id', { count: 'exact', head: true }).not('nome', 'is', null).not('cidade', 'is', null),
    supabase.from('produtos').select('id', { count: 'exact', head: true }).not('slug', 'is', null).gt('slug', ''),
    supabase.from('precos').select('medicamento'),
    supabase.rpc('cidades_agrupadas'),
  ])

  const totalPagesFarmacias = Math.ceil((countFarmacias || 75000) / 1000)
  const totalPagesProdutos = Math.ceil((countProdutos || 28000) / 1000)

  const totalMeds = new Set(
    (precosData || []).map(p => norm(p.medicamento)).filter(s => s && s.length > 2)
  ).size

  const totalCidades = Object.values(cidadesData || {}).reduce((sum, arr) => sum + arr.length, 0)
  const totalPagesRemediosCidade = Math.ceil((totalMeds * totalCidades) / 1000)

  const farmaciasSitemaps = Array.from({ length: totalPagesFarmacias }, (_, i) => `  <sitemap>
    <loc>${base}/api/sitemap-farmacias?page=${i + 1}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')

  const remediosCidadeSitemaps = Array.from({ length: totalPagesRemediosCidade }, (_, i) => `  <sitemap>
    <loc>${base}/api/sitemap-remedios-cidade?page=${i + 1}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')

  const produtosSitemaps = Array.from({ length: totalPagesProdutos }, (_, i) => `  <sitemap>
    <loc>${base}/api/sitemap-produtos?page=${i + 1}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
${farmaciasSitemaps}
${remediosCidadeSitemaps}
${produtosSitemaps}
</sitemapindex>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default function SitemapIndex() {}
