// pages/api/buscar.js — Busca no Supabase (instantânea)
import { createClient } from '@supabase/supabase-js'

export const config = { maxDuration: 10 }

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { q, cep } = req.query
  if (!q || q.trim().length < 2) return res.status(400).json({ error: 'Parâmetro q obrigatório' })

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )

  try {
    const query = q.trim().toLowerCase()

    // Busca no Supabase — primeiro tenta match exato, depois parcial
    let { data: resultados, error } = await supabase
      .from('precos')
      .select('*')
      .ilike('medicamento', `%${query}%`)
      .eq('disponivel', true)
      .order('preco', { ascending: true })
      .limit(30)

    if (error) throw new Error(error.message)

    // Busca CEP se fornecido
    let localizacao = null
    if (cep && cep.replace(/\D/g,'').length === 8) {
      try {
        const cepRes = await fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g,'')}/json/`)
        const cepData = await cepRes.json()
        if (!cepData.erro) {
          localizacao = { cidade: cepData.localidade, estado: cepData.uf }
        }
      } catch(e) {}
    }

    // Se não achou no banco, faz busca em tempo real como fallback
    if (!resultados || resultados.length === 0) {
      const { buscarPrecos } = await import('../../lib/scraper')
      const precos = await buscarPrecos(query)
      return res.status(200).json({ ...precos, localizacao, fonte: 'realtime' })
    }

    // Remove duplicatas — mantém o menor preço por farmácia
    const porFarmacia = {}
    for (const r of resultados) {
      const key = r.farmacia_id
      if (!porFarmacia[key] || r.preco < porFarmacia[key].preco) {
        porFarmacia[key] = r
      }
    }
    const melhores = Object.values(porFarmacia).sort((a, b) => a.preco - b.preco)

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json({
      query: q.trim(),
      total: melhores.length,
      atualizado_em: melhores[0]?.atualizado_em || new Date().toISOString(),
      resultados: melhores,
      localizacao,
      fonte: 'database'
    })

  } catch (error) {
    console.error('Busca error:', error)
    return res.status(500).json({ error: 'Erro ao buscar preços.' })
  }
}
