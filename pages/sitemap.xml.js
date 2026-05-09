// pages/sitemap.xml.js — Sitemap dinâmico gerado automaticamente
import { CIDADES, REMEDIOS } from '../lib/data'

const BASE = 'https://farmaciaai.com.br'

function generateSitemap() {
  const urls = []

  // Páginas estáticas
  urls.push({ loc: BASE, priority: '1.0', changefreq: 'daily' })
  urls.push({ loc: `${BASE}/cidades`, priority: '0.8', changefreq: 'weekly' })
  urls.push({ loc: `${BASE}/remedios`, priority: '0.8', changefreq: 'weekly' })

  // Páginas de cidade
  CIDADES.forEach(c => {
    urls.push({ loc: `${BASE}/cidade/${c.slug}`, priority: '0.7', changefreq: 'weekly' })
  })

  // Páginas SEO programático: remédio × cidade
  REMEDIOS.forEach(r => {
    CIDADES.forEach(c => {
      urls.push({ loc: `${BASE}/remedio/${r.slug}/${c.slug}`, priority: '0.6', changefreq: 'daily' })
    })
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`).join('\n')}
</urlset>`
}

export default function Sitemap() { return null }

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate')
  res.write(generateSitemap())
  res.end()
  return { props: {} }
}
