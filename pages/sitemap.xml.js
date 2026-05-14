// pages/sitemap.xml.js
import { getSupabase } from '../lib/supabase'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function generateSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(({ url, lastmod, changefreq, priority }) => `  <url>
    <loc>${url}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq || 'weekly'}</changefreq>
    <priority>${priority || '0.5'}</priority>
  </url>`).join('\n')}
</urlset>`
}

export async function getServerSideProps({ res }) {
  const supabase = getSupabase()
  const base = 'https://farmaciaai.com.br'
  const today = new Date().toISOString().split('T')[0]
  const urls = []

  // Páginas estáticas
  urls.push({ url: `${base}/`, changefreq: 'daily', priority: '1.0', lastmod: today })
  urls.push({ url: `${base}/cidades`, changefreq: 'weekly', priority: '0.8', lastmod: today })
  urls.push({ url: `${base}/remedios`, changefreq: 'weekly', priority: '0.8', lastmod: today })
  urls.push({ url: `${base}/bulas`, changefreq: 'weekly', priority: '0.8', lastmod: today })
  urls.push({ url: `${base}/produtos`, changefreq: 'weekly', priority: '0.7', lastmod: today })

  // Cidades
  const { data: cidades } = await supabase
    .from('farmacias_fisicas')
    .select('cidade, estado')
    .not('cidade', 'is', null)
    .order('cidade')
  
  const cidadesUnicas = [...new Map(cidades?.map(c => [`${c.cidade}-${c.estado}`, c]) || []).values()]
  cidadesUnicas.forEach(c => {
    urls.push({
      url: `${base}/cidade/${norm(c.cidade)}-${c.estado.toLowerCase()}`,
      changefreq: 'weekly',
      priority: '0.7',
      lastmod: today
    })
  })

  // Remédios
  const { data: remedios } = await supabase
    .from('medicamentos')
    .select('slug')
    .not('slug', 'is', null)

  remedios?.forEach(r => {
    urls.push({
      url: `${base}/remedio/${r.slug}`,
      changefreq: 'weekly',
      priority: '0.6',
      lastmod: today
    })
  })

  // Bulas
  const { data: bulas } = await supabase
    .from('bulas')
    .select('slug')
    .not('slug', 'is', null)

  bulas?.forEach(b => {
    urls.push({
      url: `${base}/bula/${b.slug}`,
      changefreq: 'monthly',
      priority: '0.6',
      lastmod: today
    })
  })

  const sitemap = generateSitemap(urls)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
  res.write(sitemap)
  res.end()

  return { props: {} }
}

export default function Sitemap() {}
