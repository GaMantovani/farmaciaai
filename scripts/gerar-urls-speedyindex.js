// Gera lista de URLs prioritárias para submeter ao SpeedyIndex / OmegaIndexer
// Salva em scripts/urls-speedyindex.txt (uma URL por linha)
//
// SpeedyIndex:  https://speedyindex.com  — cola o .txt ou usa API
// OmegaIndexer: https://omegaindexer.com — cola o .txt
// OneHour:      https://www.1hourindexing.com
//
// Uso:
//   node scripts/gerar-urls-speedyindex.js              # top 5.000 URLs
//   node scripts/gerar-urls-speedyindex.js --limit=50000
//   node scripts/gerar-urls-speedyindex.js --type=meds
//   node scripts/gerar-urls-speedyindex.js --type=produtos
//   node scripts/gerar-urls-speedyindex.js --type=farmacias
//   node scripts/gerar-urls-speedyindex.js --type=cidades

const fs = require('fs')
const path = require('path')
const ws = require('ws')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://lbatmgvrqvjchbodzymy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo'
const BASE = 'https://farmaciaai.com.br'
const OUT = path.join(__dirname, 'urls-speedyindex.txt')

function norm(str) {
  if (!str) return ''
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

async function main() {
  const args = process.argv.slice(2)
  const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1]
  const limitArg = parseInt(args.find(a => a.startsWith('--limit='))?.split('=')[1]) || 5000

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws } })
  const urls = []

  // Páginas estáticas
  urls.push(`${BASE}/`, `${BASE}/remedios`, `${BASE}/produtos`, `${BASE}/cidades`, `${BASE}/bulas`)

  // Remédios (maior prioridade — têm preços)
  if (!typeArg || typeArg === 'meds') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.3)
    const { data: meds } = await supabase
      .from('medicamentos')
      .select('slug')
      .eq('tem_preco', true)
      .order('slug')
      .limit(limit)
    meds?.forEach(m => urls.push(`${BASE}/remedio/${m.slug}`))
    console.log(`  ${meds?.length || 0} remédios`)
  }

  // Produtos
  if (!typeArg || typeArg === 'produtos') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.3)
    const { data: prods } = await supabase
      .from('produtos')
      .select('slug')
      .not('slug', 'is', null)
      .order('slug')
      .limit(limit)
    prods?.forEach(p => urls.push(`${BASE}/produto/${p.slug}`))
    console.log(`  ${prods?.length || 0} produtos`)
  }

  // Farmácias
  if (!typeArg || typeArg === 'farmacias') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.25)
    const { data: farmacias } = await supabase
      .from('farmacias_fisicas')
      .select('cidade, estado, bairro, nome')
      .not('nome', 'is', null)
      .not('cidade', 'is', null)
      .limit(limit)
    farmacias?.forEach(f => {
      const cidadeSlug = `${norm(f.cidade)}-${f.estado?.toLowerCase()}`
      const slug = f.bairro && norm(f.bairro) !== norm(f.cidade)
        ? `${norm(f.bairro)}-${norm(f.nome)}`
        : norm(f.nome)
      urls.push(`${BASE}/farmacia/${cidadeSlug}/${slug}`)
    })
    console.log(`  ${farmacias?.length || 0} farmácias`)
  }

  // Cidades
  if (!typeArg || typeArg === 'cidades') {
    const limit = typeArg ? limitArg : Math.floor(limitArg * 0.15)
    const { data: cidades } = await supabase
      .from('farmacias_fisicas')
      .select('cidade, estado')
      .not('cidade', 'is', null)
      .not('estado', 'is', null)
      .limit(50000)
    const unicas = [...new Map(cidades?.map(c => [`${c.cidade}-${c.estado}`, c]) || []).values()]
    unicas.slice(0, limit).forEach(c => urls.push(`${BASE}/cidade/${norm(c.cidade)}-${c.estado.toLowerCase()}`))
    console.log(`  ${Math.min(unicas.length, limit)} cidades`)
  }

  fs.writeFileSync(OUT, urls.join('\n'), 'utf8')
  console.log(`\n✅ ${urls.length} URLs salvas em: ${OUT}`)
  console.log('\nPróximos passos:')
  console.log('  SpeedyIndex:  https://speedyindex.com — faça upload do arquivo .txt')
  console.log('  OmegaIndexer: https://omegaindexer.com — cole as URLs ou faça upload')
  console.log('  OneHour:      https://www.1hourindexing.com')
}

main().catch(console.error)
