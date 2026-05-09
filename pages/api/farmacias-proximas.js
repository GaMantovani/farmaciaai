export default async function handler(req, res) {
  const { cep } = req.query
  const key = process.env.GOOGLE_PLACES_KEY
  if (!cep || !key) return res.status(400).json({ error: 'CEP e chave obrigatórios' })

  try {
    // Primeiro converte CEP em coordenadas
    const geoRes = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${cep},Brasil&key=${key}`
    )
    const geoData = await geoRes.json()
    if (!geoData.results?.length) return res.json({ farmacias: [] })

    const { lat, lng } = geoData.results[0].geometry.location
    const cidade = geoData.results[0].address_components?.find(c => c.types.includes('administrative_area_level_2'))?.long_name || ''
    const estado = geoData.results[0].address_components?.find(c => c.types.includes('administrative_area_level_1'))?.short_name || ''

    // Busca farmácias próximas
    const placesRes = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=3000&type=pharmacy&language=pt-BR&key=${key}`
    )
    const placesData = await placesRes.json()

    const farmacias = (placesData.results || []).slice(0, 8).map(p => ({
      nome: p.name,
      endereco: p.vicinity,
      aberto: p.opening_hours?.open_now,
      avaliacao: p.rating,
      lat: p.geometry.location.lat,
      lng: p.geometry.location.lng,
      place_id: p.place_id,
    }))

    res.setHeader('Cache-Control', 's-maxage=3600')
    return res.json({ farmacias, cidade, estado, lat, lng })
  } catch (e) {
    return res.status(500).json({ error: e.message })
  }
}
