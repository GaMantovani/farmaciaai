export default async function handler(req, res) {
  const token = process.env.APIFY_TOKEN
  if (!token) return res.json({ erro: 'Token não encontrado' })
  
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~cheerio-scraper/runs?token=${token}&waitForFinish=60`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: 'https://www.ultrafarma.com.br/busca?q=dipirona' }],
          pageFunction: `async function pageFunction(context) { const { $ } = context; const items = []; $('[class*="product"],[class*="Product"]').each(function(i){ if(i>=3) return false; const nome = $(this).find('[class*="name"],[class*="title"],h2,h3').first().text().trim(); const precoText = $(this).find('[class*="price"],[class*="preco"]').first().text().trim(); const preco = parseFloat(precoText.replace(/[^0-9,]/g,'').replace(',','.')); if(nome && preco>0) items.push({farmacia:'Ultrafarma',nome,preco,url:context.request.url}); }); return items; }`,
          maxRequestsPerCrawl: 1,
          proxyConfiguration: { useApifyProxy: true, apifyProxyGroups: ['RESIDENTIAL'] },
        })
      }
    )
    const data = await response.json()
    
    // Busca os resultados do dataset
    const datasetId = data?.data?.defaultDatasetId
    if (datasetId) {
      const items = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`)
      const itemsData = await items.json()
      return res.json({ status: 'ok', items: itemsData })
    }
    
    return res.json({ status: response.status, data })
  } catch (e) {
    return res.json({ erro: e.message })
  }
}
