// IndexNow — notifica Bing, Yandex, Seznam sobre URLs novas/atualizadas
// POST /api/indexnow  { urls: ["https://..."] }
// GET  /api/indexnow  submete todas as páginas principais

const INDEXNOW_KEY = 'fc23e52a3657e6f4216194133671b0ad'
const HOST = 'farmaciaai.com.br'

async function submitToIndexNow(urls) {
  const body = JSON.stringify({
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  })

  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body,
  })

  return { status: res.status, ok: res.status === 200 || res.status === 202 }
}

export default async function handler(req, res) {
  // Aceitar apenas chamadas internas ou com header de autorização
  const auth = req.headers['x-indexnow-secret']
  if (auth !== process.env.INDEXNOW_SECRET && process.env.INDEXNOW_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  let urls = []

  if (req.method === 'POST') {
    urls = req.body?.urls || []
  } else {
    // GET: submeter páginas principais
    const base = `https://${HOST}`
    urls = [
      `${base}/`,
      `${base}/remedios`,
      `${base}/cidades`,
      `${base}/bulas`,
    ]
  }

  if (!urls.length) return res.status(400).json({ error: 'No URLs provided' })

  // IndexNow aceita até 10.000 URLs por chamada
  const results = []
  for (let i = 0; i < urls.length; i += 10000) {
    const chunk = urls.slice(i, i + 10000)
    const result = await submitToIndexNow(chunk)
    results.push({ chunk: i / 10000, ...result, count: chunk.length })
  }

  return res.status(200).json({ submitted: urls.length, results })
}
