export default async function handler(req, res) {
  const token = process.env.APIFY_TOKEN
  if (!token) return res.json({ erro: 'Token não encontrado' })
  
  // Testa APIs JSON diretas das farmácias
  const urls = [
    'https://www.drogal.com.br/api/catalog_system/pub/products/search/dipirona?_from=0&_to=5',
    'https://www.drogal.com.br/api/io/_v/api/intelligent-search/product_search?query=dipirona&count=5',
    'https://www.ultrafarma.com.br/api/catalog_system/pub/products/search/dipirona?_from=0&_to=5',
  ]
  
  const results = await Promise.all(urls.map(async url => {
    try {
      const r = await fetch(url, { headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' } })
      const text = await r.text()
      return { url, status: r.status, preview: text.substring(0, 200) }
    } catch(e) {
      return { url, erro: e.message }
    }
  }))
  
  return res.json({ results })
}
