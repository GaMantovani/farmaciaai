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
          startUrls: [{ url: 'https://www.drogal.com.br/busca?q=dipirona' }],
          pageFunction: `async function pageFunction(context) { const { $ } = context; const items = []; $('[class*="product"],[class*="Product"],li').each(function(i){ if(i>=5) return false; const nome = $(this).find('[class*="name"],[class*="title"],h2,h3').first().text().trim(); const precoText = $(this).find('[class*="price"],[class*="preco"]').first().text().trim(); const preco = parseFloat(precoText.replace(/[^0-9,]/g,'').replace(',','.')); if(nome && preco>0 && preco<2000) items.push({farmacia:'Drogal',nome,preco}); }); return items.length ? items : [{html: $('body').text().substring(0,500)}]; }`,
          maxRequestsPerCrawl: 1,
        })
      }
    )
    const data = await response.json()
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
