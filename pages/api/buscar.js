import { buscarPrecos, buscarCEP } from '../../lib/scraper'

export const config = {
  maxDuration: 60,
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const { q, cep } = req.query
  if (!q || q.trim().length < 2) {
    return res.status(400).json({ error: 'Parâmetro q obrigatório' })
  }
  try {
    const [precos, dadosCEP] = await Promise.all([
      buscarPrecos(q.trim()),
      cep ? buscarCEP(cep) : Promise.resolve(null),
    ])
    res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate')
    return res.status(200).json({ ...precos, localizacao: dadosCEP })
  } catch (error) {
    console.error('Busca error:', error)
    return res.status(500).json({ error: 'Erro ao buscar preços.' })
  }
}
