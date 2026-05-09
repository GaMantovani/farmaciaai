export default async function handler(req, res) {
  const token = process.env.APIFY_TOKEN
  if (!token) return res.json({ erro: 'Token não encontrado' })
  
  try {
    const response = await fetch(
      `https://api.apify.com/v2/acts/apify~cheerio-scraper/runs?token=${token}&waitForFinish=30`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startUrls: [{ url: 'https://www.ultrafarma.com.br/busca?q=dipirona' }],
          pageFunction: `async function pageFunction(context) { return { url: context.request.url, title: context.$('title').text() } }`,
          maxRequestsPerCrawl: 1,
        })
      }
    )
    const data = await response.json()
    return res.json({ status: response.status, data })
  } catch (e) {
    return res.json({ erro: e.message })
  }
}
