import { getSupabase } from '../../lib/supabase'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function slugFarmacia(f) {
  const bairro = f.bairro && norm(f.bairro) !== norm(f.cidade) ? norm(f.bairro) : ''
  return bairro ? `${bairro}-${norm(f.nome)}` : norm(f.nome)
}

export async function getServerSideProps({ params, res }) {
  const page = parseInt(params.page) || 1
  const perPage = 10000
  const from = (page - 1) * perPage
  const supabase = getSupabase()
  const base = 'https://farmaciaai.com.br'
  const today = new Date().toISOString().split('T')[0]

  const { data: farmacias } = await supabase
    .from('farmacias_fisicas')
    .select('nome, bairro, cidade, estado')
    .not('nome', 'is', null)
    .not('cidade', 'is', null)
    .range(from, from + perPage - 1)

  if (!farmacias || farmacias.length === 0) {
    res.statusCode = 404
    res.end()
    return { props: {} }
  }

  const urls = farmacias.map(f => {
    const cidadeSlug = `${norm(f.cidade)}-${f.estado.toLowerCase()}`
    const farmaciaSlug = slugFarmacia(f)
    return `  <url>
    <loc>${base}/farmacia/${cidadeSlug}/${farmaciaSlug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
    <lastmod>${today}</lastmod>
  </url>`
  }).join('\n')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.write(sitemap)
  res.end()
  return { props: {} }
}

export default function SitemapFarmacias() {}
