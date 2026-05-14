// pages/remedio/[slug]/[cidade].js — Remédio por cidade
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseCidadeSlug(cidadeSlug) {
  const parts = cidadeSlug.split('-')
  const estado = parts[parts.length - 1].toUpperCase()
  const cidade = parts.slice(0, -1).join(' ').replace(/\b\w/g, c => c.toUpperCase())
  return { cidade, estado }
}

export default function RemedioEmCidade({ medicamento, precos, farmacias, slug, cidadeSlug, cidade, estado }) {
  if (!medicamento) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <h1>Página não encontrada</h1>
      <Link href="/remedios" style={{ color:ACCENT }}>Ver todos os remédios</Link>
    </div>
  )

  const cidadeNome = `${cidade}, ${estado}`
  const title = `${medicamento} em ${cidade} — Compare preços | FarmáciaAí`
  const description = `Compare preços de ${medicamento} em farmácias de ${cidadeNome}. Encontre a melhor oferta e economize na sua cidade.`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://farmaciaai.com.br/remedio/${slug}/${cidadeSlug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://farmaciaai.com.br/remedio/${slug}/${cidadeSlug}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://farmaciaai.com.br' },
            { '@type': 'ListItem', position: 2, name: 'Remédios', item: 'https://farmaciaai.com.br/remedios' },
            { '@type': 'ListItem', position: 3, name: medicamento, item: `https://farmaciaai.com.br/remedio/${slug}` },
            { '@type': 'ListItem', position: 4, name: cidade, item: `https://farmaciaai.com.br/remedio/${slug}/${cidadeSlug}` },
          ]
        })}} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,.96)', backdropFilter:'blur(16px)', borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:900, margin:'0 auto', padding:'0 20px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height:38 }} /></Link>
          <Link href={`/?q=${encodeURIComponent(medicamento)}`} style={{ background:OG, color:'#fff', padding:'8px 18px', borderRadius:10, fontSize:13, fontWeight:700 }}>Comparar preços</Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background:OG, padding:'36px 20px 44px' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.7)', marginBottom:10 }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Início</Link>
            <span style={{ margin:'0 6px' }}>{'>'}</span>
            <Link href="/remedios" style={{ color:'rgba(255,255,255,.7)' }}>Remédios</Link>
            <span style={{ margin:'0 6px' }}>{'>'}</span>
            <Link href={`/remedio/${slug}`} style={{ color:'rgba(255,255,255,.7)' }}>{medicamento}</Link>
            <span style={{ margin:'0 6px' }}>{'>'}</span>
            <span style={{ color:'#fff' }}>{cidade}</span>
          </div>
          <h1 style={{ fontFamily:'DM Sans', fontSize:'clamp(22px,4vw,38px)', color:'#fff', fontWeight:800, lineHeight:1.1, marginBottom:8 }}>
            {medicamento} em {cidade}
          </h1>
          <p style={{ color:'rgba(255,255,255,.85)', fontSize:15, marginBottom:16 }}>
            {farmacias.length > 0
              ? `${farmacias.length} farmácias com ${medicamento} em ${cidadeNome}`
              : `Encontre ${medicamento} em farmácias de ${cidadeNome}`}
          </p>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            <span style={{ background:'rgba(255,255,255,.2)', color:'#fff', fontSize:13, padding:'4px 12px', borderRadius:100 }}>📍 {cidadeNome}</span>
            <span style={{ background:'rgba(255,255,255,.2)', color:'#fff', fontSize:13, padding:'4px 12px', borderRadius:100 }}>💊 {medicamento}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 20px 72px' }}>

        {/* Preços online */}
        {precos.length > 0 && (
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:4 }}>
              Comparar preço de {medicamento}
            </h2>
            <p style={{ fontSize:13,color:'#aaa',marginBottom:16 }}>Compre online com entrega em {cidade}</p>
            <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,overflow:'hidden' }}>
              {precos.slice(0,8).map((p, i) => (
                <a key={i} href={p.url || '#'} target="_blank" rel="noopener noreferrer sponsored"
                  style={{ display:'flex',alignItems:'center',padding:'14px 20px',gap:14,borderBottom:i<Math.min(precos.length,8)-1?'1px solid #f9f9f9':'none',background:i===0?'#fffaf8':'#fff',textDecoration:'none',color:'inherit' }}>
                  <div style={{ width:32,height:32,borderRadius:8,background:i===0?ACCENT:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,color:i===0?'#fff':'#666',flexShrink:0 }}>
                    {i+1}
                  </div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:600,color:'#111',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.farmacia}</div>
                    {p.medicamento && <div style={{ fontSize:12,color:'#aaa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.medicamento}</div>}
                  </div>
                  <div style={{ textAlign:'right',flexShrink:0 }}>
                    <div style={{ fontSize:16,fontWeight:700,color:i===0?ACCENT:'#111' }}>
                      R$ {p.preco.toFixed(2).replace('.',',')}
                    </div>
                    {i===0 && <div style={{ fontSize:10,fontWeight:700,color:'#22c55e',background:'#f0fff4',padding:'2px 8px',borderRadius:100,marginTop:2 }}>Menor preço</div>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Farmácias na cidade */}
        {farmacias.length > 0 ? (
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#111', marginBottom:16 }}>
              Farmácias com {medicamento} em {cidade}
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {farmacias.map((f, i) => (
                <Link key={i} href={`/farmacia/${norm(f.cidade)}-${f.estado.toLowerCase()}/${norm(f.bairro) !== norm(f.cidade) && f.bairro ? `${norm(f.bairro)}-${norm(f.nome)}` : norm(f.nome)}`}>
                  <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', gap:16, cursor:'pointer', transition:'all .2s' }}>
                    <div style={{ width:40, height:40, borderRadius:'50%', background: i === 0 ? ACCENT : '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:700, color: i === 0 ? '#fff' : '#666', flexShrink:0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontSize:15, fontWeight:700, color:'#111', marginBottom:2 }}>{f.nome}</div>
                      <div style={{ fontSize:13, color:'#888' }}>
                        {f.bairro && `${f.bairro} · `}{f.logradouro || cidadeNome}
                      </div>
                    </div>
                    {i === 0 && (
                      <span style={{ background:'#f0fff4', color:'#22c55e', fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:100, whiteSpace:'nowrap' }}>
                        Mais próxima
                      </span>
                    )}
                    <span style={{ color:ACCENT, fontSize:18 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:16, padding:'32px', textAlign:'center', marginBottom:32 }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔍</div>
            <h2 style={{ fontSize:18, fontWeight:700, color:'#111', marginBottom:8 }}>Buscando farmácias em {cidade}</h2>
            <p style={{ fontSize:14, color:'#666', marginBottom:20 }}>Compare preços online em todo o Brasil.</p>
            <Link href={`/?q=${encodeURIComponent(medicamento)}`} style={{ display:'inline-block', background:OG, color:'#fff', padding:'12px 24px', borderRadius:12, fontSize:14, fontWeight:700 }}>
              Comparar preços online
            </Link>
          </div>
        )}

        {/* CTA comparar preços */}
        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)', border:'1px solid #ffd4be', borderRadius:20, padding:'26px 28px', marginBottom:32 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:ACCENT, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:8 }}>Compare online</div>
              <h2 style={{ fontSize:18, color:'#111', fontWeight:700, marginBottom:6 }}>Menor preço de {medicamento}</h2>
              <p style={{ fontSize:14, color:'#666' }}>Compare em +150 farmácias online. Entrega rápida.</p>
            </div>
            <Link href={`/?q=${encodeURIComponent(medicamento)}`} style={{ background:OG, color:'#fff', padding:'13px 26px', borderRadius:14, fontSize:14, fontWeight:700, whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
              Ver preços →
            </Link>
          </div>
        </div>

        {/* Outras cidades */}
        <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:16, padding:'24px', marginBottom:32 }}>
          <h2 style={{ fontSize:16, fontWeight:700, color:'#111', marginBottom:16 }}>
            {medicamento} em outras cidades
          </h2>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
            {[
              { nome:'São Paulo', slug:'sao-paulo-sp' },
              { nome:'Rio de Janeiro', slug:'rio-de-janeiro-rj' },
              { nome:'Belo Horizonte', slug:'belo-horizonte-mg' },
              { nome:'Curitiba', slug:'curitiba-pr' },
              { nome:'Porto Alegre', slug:'porto-alegre-rs' },
              { nome:'Salvador', slug:'salvador-ba' },
              { nome:'Fortaleza', slug:'fortaleza-ce' },
              { nome:'Recife', slug:'recife-pe' },
              { nome:'Manaus', slug:'manaus-am' },
              { nome:'Goiânia', slug:'goiania-go' },
              { nome:'Campinas', slug:'campinas-sp' },
              { nome:'Natal', slug:'natal-rn' },
            ].filter(c => c.slug !== cidadeSlug).map(c => (
              <Link key={c.slug} href={`/remedio/${slug}/${c.slug}`} style={{ background:'#f7f8fa', border:'1px solid #e8e8e8', borderRadius:8, padding:'6px 14px', fontSize:13, color:'#444' }}>
                {c.nome}
              </Link>
            ))}
          </div>
        </div>

        {/* Link para bula */}
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <Link href={`/remedio/${slug}`} style={{ fontSize:13, color:ACCENT, border:'1px solid #ffb89a', padding:'8px 16px', borderRadius:10 }}>
            ← Ver todos os preços
          </Link>
          <Link href="/remedios" style={{ fontSize:13, color:'#666', border:'1px solid #e0e0e0', padding:'8px 16px', borderRadius:10 }}>
            Ver todos os remédios
          </Link>
        </div>
      </div>

      <footer style={{ background:'#111', color:'#555', padding:'24px 20px', textAlign:'center' }}>
        <div style={{ fontSize:12 }}>FarmáciaAí - Não vendemos medicamentos. Apenas comparamos preços.</div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const { slug, cidade: cidadeSlug } = params
  const supabase = getSupabase()

  // Busca o medicamento
  const { data: med } = await supabase
    .from('medicamentos')
    .select('id, nome, slug')
    .eq('slug', slug)
    .single()

  if (!med) return { notFound: true }

  const { cidade, estado } = parseCidadeSlug(cidadeSlug)

  // Busca preços e farmácias físicas em paralelo
  const nomePrefix = med.nome.split(' ').slice(0, 2).join(' ')
  const [precosResult, farmaciasResult] = await Promise.all([
    supabase
      .from('precos')
      .select('farmacia, preco, url, medicamento, imagem')
      .ilike('medicamento', `${nomePrefix}%`)
      .eq('disponivel', true)
      .order('preco', { ascending: true })
      .limit(100),
    supabase
      .from('farmacias_fisicas')
      .select('nome, bairro, logradouro, cidade, estado')
      .ilike('cidade', cidade)
      .eq('estado', estado)
      .limit(20),
  ])

  // Filtra pelo slug exato e deduplica por farmácia (menor preço)
  const porFarmacia = {}
  for (const p of (precosResult.data || [])) {
    if (norm(p.medicamento) !== slug) continue
    if (!porFarmacia[p.farmacia] || p.preco < porFarmacia[p.farmacia].preco) {
      porFarmacia[p.farmacia] = p
    }
  }
  const precos = Object.values(porFarmacia).sort((a, b) => a.preco - b.preco)

  return {
    props: {
      medicamento: med.nome,
      precos,
      slug: med.slug,
      cidadeSlug,
      cidade,
      estado,
      farmacias: farmaciasResult.data || [],
    },
    revalidate: 86400,
  }
}
