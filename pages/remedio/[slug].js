// pages/remedio/[slug].js — Página de remédio com preços
import Head from 'next/head'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function MedImg({ src, alt }) {
  if (!src) return <div style={{ width:64, height:64, display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>💊</div>
  return (
    <img src={src} alt={alt} width={64} height={64}
      style={{ objectFit:'contain', borderRadius:8 }}
      onError={e => { e.target.style.display='none' }} />
  )
}

function gerarFAQ(med, precos) {
  if (!precos.length) return []
  const melhor = precos[0]
  const pior = precos[precos.length - 1]
  const economia = (pior.preco - melhor.preco).toFixed(2).replace('.', ',')
  return [
    {
      q: `Qual o menor preço do ${med} hoje?`,
      a: `O menor preço do ${med} hoje é R$ ${melhor.preco.toFixed(2).replace('.',',')} na ${melhor.farmacia}. Compare com as demais ${precos.length} farmácias disponíveis.`
    },
    {
      q: `Onde comprar ${med} mais barato?`,
      a: `A farmácia com o menor preço para ${med} é a ${melhor.farmacia} (R$ ${melhor.preco.toFixed(2).replace('.',',')}). Você pode economizar até R$ ${economia} comprando no lugar certo.`
    },
    {
      q: `Em quantas farmácias posso comprar ${med}?`,
      a: `O FarmáciaAí encontrou ${med} em ${precos.length} farmácias online. Os preços variam de R$ ${melhor.preco.toFixed(2).replace('.',',')} a R$ ${pior.preco.toFixed(2).replace('.',',')}.`
    },
    {
      q: `Qual a diferença de preço do ${med} entre farmácias?`,
      a: `A diferença de preço do ${med} entre a farmácia mais barata e a mais cara é de R$ ${economia}. Vale sempre comparar antes de comprar.`
    },
  ]
}

export default function RemedioPage({ medicamento, precos, slug }) {
  if (!medicamento) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <h1>Remédio não encontrado</h1>
      <Link href="/" style={{ color:ACCENT }}>← Voltar ao início</Link>
    </div>
  )

  const melhor = precos[0]
  const pior = precos[precos.length - 1]
  const economia = precos.length > 1 ? (pior.preco - melhor.preco).toFixed(2).replace('.', ',') : null
  const faq = gerarFAQ(medicamento, precos)
  const imagem = precos.find(p => p.imagem)?.imagem

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Drug",
    "name": medicamento,
    "offers": precos.slice(0,5).map(p => ({
      "@type": "Offer",
      "price": p.preco.toFixed(2),
      "priceCurrency": "BRL",
      "seller": { "@type": "Organization", "name": p.farmacia },
      "url": p.url,
      "availability": "https://schema.org/InStock"
    }))
  }

  const schemaFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }

  return (
    <>
      <Head>
        <title>{medicamento} — Compare preços em {precos.length} farmácias | FarmáciaAí</title>
        <meta name="description" content={`Compare o preço do ${medicamento} em ${precos.length} farmácias. Menor preço: R$ ${melhor?.preco?.toFixed(2).replace('.',',')} na ${melhor?.farmacia}. Economize até R$ ${economia}.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/remedio/${slug}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFAQ) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://farmaciaai.com.br" },
            { "@type": "ListItem", "position": 2, "name": "Remédios", "item": "https://farmaciaai.com.br/remedios" },
            { "@type": "ListItem", "position": 3, "name": medicamento }
          ]
        })}} />
      </Head>
      <style>{`
        :root {
          --primary: #ff4500;
          --card: #fff;
          --border: #f0f0f0;
          --muted: #888;
          --bg: #f7f8fa;
        }
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;color:#111;background:var(--bg);-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        details summary::-webkit-details-marker{display:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fade{animation:fadeUp .3s ease both}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,.96)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', padding:'0 20px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:38 }} /></Link>
          <Link href={`/?q=${encodeURIComponent(medicamento)}`}
            style={{ background:OG, color:'#fff', padding:'8px 20px', borderRadius:10, fontSize:14, fontWeight:700, boxShadow:'0 4px 12px rgba(255,69,0,.25)' }}>
            Comparar preços →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg, #ff6b1a, #ff4500)', padding:'36px 20px 40px' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.6)', marginBottom:12, display:'flex', gap:6, alignItems:'center' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Início</Link>
            <span>›</span>
            <Link href="/remedios" style={{ color:'rgba(255,255,255,.7)' }}>Remédios</Link>
            <span>›</span>
            <span style={{ color:'#fff' }}>{medicamento}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
            <div style={{ width:80, height:80, borderRadius:16, background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden' }}>
              <MedImg src={imagem} alt={medicamento} />
            </div>
            <div>
              <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(22px,4vw,38px)', color:'#fff', lineHeight:1.1, marginBottom:8, textTransform:'capitalize' }}>
                {medicamento}
              </h1>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                <span style={{ background:'rgba(255,255,255,.2)', color:'#fff', fontSize:13, padding:'4px 12px', borderRadius:100 }}>
                  {precos.length} farmácias
                </span>
                {economia && (
                  <span style={{ background:'rgba(255,255,255,.2)', color:'#fff', fontSize:13, padding:'4px 12px', borderRadius:100 }}>
                    Economize até R$ {economia}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1000, margin:'0 auto', padding:'28px 20px 64px' }}>

        {/* MENOR PREÇO */}
        {melhor && (
          <div className="fade" style={{ background:'var(--card)', border:'2px solid var(--primary)', borderRadius:20, padding:'20px 24px', marginBottom:20, display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16, boxShadow:'0 8px 32px rgba(255,69,0,.1)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <span style={{ background:OG, color:'#fff', fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:100, letterSpacing:'.05em', whiteSpace:'nowrap' }}>🏆 MENOR PREÇO</span>
              <div style={{ width:52, height:52, borderRadius:12, background:'#f8f9fb', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', flexShrink:0 }}>
                <MedImg src={melhor.imagem} alt={melhor.medicamento} />
              </div>
              <div>
                <div style={{ fontSize:17, fontWeight:700, color:'#111' }}>{melhor.farmacia}</div>
                <div style={{ fontSize:13, color:'#888', marginTop:2 }}>{melhor.medicamento}</div>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:16 }}>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:40, color:ACCENT, lineHeight:1 }}>
                <span style={{ fontSize:18, verticalAlign:'super', fontFamily:"'DM Sans',sans-serif", fontWeight:700 }}>R$</span>
                {melhor.preco.toFixed(2).replace('.',',')}
              </div>
              <a href={melhor.url} target="_blank" rel="noopener noreferrer"
                style={{ background:OG, color:'#fff', padding:'13px 28px', borderRadius:14, fontSize:15, fontWeight:700, whiteSpace:'nowrap', boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
                Comprar agora →
              </a>
            </div>
          </div>
        )}

        {/* TABELA DE PREÇOS */}
        <div style={{ background:'var(--card)', borderRadius:16, border:'1px solid var(--border)', overflow:'hidden', marginBottom:24 }}>
          <div style={{ padding:'14px 20px', borderBottom:'1px solid #f5f5f5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:15, fontWeight:700, color:'#111' }}>Comparativo de preços — {precos.length} farmácias</div>
            <div style={{ fontSize:12, color:'#aaa' }}>Menor para maior</div>
          </div>
          {precos.map((p, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', padding:'12px 20px', gap:14, borderBottom: i < precos.length-1 ? '1px solid #f9f9f9' : 'none', background: i===0 ? '#fffaf8' : '#fff', transition:'background .12s' }}
              onMouseOver={e => e.currentTarget.style.background='#fffaf8'}
              onMouseOut={e => e.currentTarget.style.background= i===0 ? '#fffaf8' : '#fff'}>
              <div style={{ width:26, height:26, borderRadius:'50%', background: i===0 ? OG : '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color: i===0 ? '#fff' : '#aaa', flexShrink:0 }}>
                {i+1}
              </div>
              <div style={{ width:40, height:40, borderRadius:8, background:'#f8f9fb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden', border:'1px solid #f0f0f0' }}>
                <MedImg src={p.imagem} alt={p.medicamento} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, fontWeight:600, color:'#111', display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:8, height:8, borderRadius:'50%', background: p.logo_cor || ACCENT, flexShrink:0, display:'inline-block' }} />
                  {p.farmacia}
                  {i===0 && <span style={{ fontSize:10, fontWeight:700, background:'#fff3ee', color:ACCENT, padding:'2px 7px', borderRadius:100 }}>Melhor preço</span>}
                </div>
                <div style={{ fontSize:12, color:'#aaa', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{p.medicamento}</div>
              </div>
              {i > 0 && (
                <div style={{ fontSize:11, color:'#dc2626', background:'#fef2f2', padding:'2px 8px', borderRadius:100, whiteSpace:'nowrap', flexShrink:0 }}>
                  +R$ {(p.preco - melhor.preco).toFixed(2).replace('.',',')}
                </div>
              )}
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color: i===0 ? ACCENT : '#111', whiteSpace:'nowrap', flexShrink:0 }}>
                R$ {p.preco.toFixed(2).replace('.',',')}
              </div>
              <a href={p.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize:13, fontWeight:600, color: i===0 ? '#fff' : ACCENT, background: i===0 ? OG : 'transparent', border: i===0 ? 'none' : '1.5px solid #ffb89a', padding:'7px 14px', borderRadius:8, whiteSpace:'nowrap', flexShrink:0, transition:'background .12s' }}
                onMouseOver={e => { if(i!==0) e.currentTarget.style.background='#fff3ee' }}
                onMouseOut={e => { if(i!==0) e.currentTarget.style.background='transparent' }}>
                {i===0 ? 'Comprar' : 'Ver oferta'}
              </a>
            </div>
          ))}
        </div>

        {/* CTA COMPARAR */}
        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)', border:'1px solid #ffd4be', borderRadius:18, padding:'24px 28px', marginBottom:32, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:ACCENT, marginBottom:6 }}>💊 Buscar variações</div>
            <p style={{ fontSize:15, color:'#444' }}>Compare outras apresentações de <strong>{medicamento.split(' ')[0]}</strong> em tempo real</p>
          </div>
          <Link href={`/?q=${encodeURIComponent(medicamento.split(' ')[0])}`}
            style={{ background:OG, color:'#fff', padding:'12px 24px', borderRadius:12, fontSize:14, fontWeight:700, boxShadow:'0 4px 14px rgba(255,69,0,.25)', whiteSpace:'nowrap' }}>
            Ver todas as ofertas →
          </Link>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:24, color:'#111', marginBottom:16 }}>
            Perguntas frequentes sobre {medicamento}
          </h2>
          {faq.map((item, i) => (
            <details key={i} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, marginBottom:8, overflow:'hidden' }}>
              <summary style={{ padding:'14px 18px', fontSize:14, fontWeight:600, color:'#111', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', listStyle:'none' }}>
                {item.q}
                <span style={{ color:'#aaa', flexShrink:0, marginLeft:8, fontSize:18 }}>+</span>
              </summary>
              <div style={{ padding:'0 18px 14px', fontSize:14, color:'#555', lineHeight:1.75 }}>{item.a}</div>
            </details>
          ))}
        </div>

        {/* INFO SEO */}
        <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 24px', marginBottom:24 }}>
          <h2 style={{ fontSize:17, fontWeight:700, color:'#111', marginBottom:12 }}>Sobre {medicamento}</h2>
          <p style={{ fontSize:14, color:'#555', lineHeight:1.8 }}>
            O <strong>{medicamento}</strong> está disponível em {precos.length} farmácias online no FarmáciaAí.
            O menor preço encontrado é <strong>R$ {melhor?.preco?.toFixed(2).replace('.',',')}</strong> na <strong>{melhor?.farmacia}</strong>.
            {economia && ` Você pode economizar até R$ ${economia} comparando os preços antes de comprar.`}
            {' '}Use o comparador do FarmáciaAí para encontrar sempre o melhor preço atualizado.
          </p>
        </div>

        {/* FOOTER NAV */}
        <div style={{ display:'flex', justifyContent:'center', gap:12, flexWrap:'wrap' }}>
          <Link href="/" style={{ fontSize:13, color:ACCENT, border:'1px solid #ffb89a', padding:'8px 16px', borderRadius:10 }}>← Comparar outro remédio</Link>
          <Link href="/remedios" style={{ fontSize:13, color:'#666', border:'1px solid #e0e0e0', padding:'8px 16px', borderRadius:10 }}>Ver todos os remédios</Link>
          <Link href="/bulas" style={{ fontSize:13, color:'#666', border:'1px solid #e0e0e0', padding:'8px 16px', borderRadius:10 }}>Ver bulas</Link>
        </div>
      </div>

      <footer style={{ background:'#111', color:'#555', padding:'24px 20px', textAlign:'center' }}>
        <div style={{ maxWidth:1000, margin:'0 auto', fontSize:12 }}>
          © {new Date().getFullYear()} FarmáciaAí · Preços atualizados periodicamente. Verifique na farmácia antes de comprar.
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )

  // Pega todos os medicamentos únicos
  let allMeds = new Set()
  let from = 0
  while (true) {
    const { data } = await supabase.from('precos').select('medicamento').range(from, from + 999)
    if (!data || data.length === 0) break
    data.forEach(p => allMeds.add(p.medicamento))
    from += 1000
    if (data.length < 1000) break
  }

  const paths = [...allMeds].map(med => ({
    params: { slug: norm(med) }
  }))

  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
  )

  // Busca todos os preços para esse slug
  let allPrecos = []
  let from = 0
  while (true) {
    const { data } = await supabase.from('precos')
      .select('*')
      .range(from, from + 999)
    if (!data || data.length === 0) break
    data.forEach(p => {
      if (norm(p.medicamento) === params.slug) allPrecos.push(p)
    })
    from += 1000
    if (data.length < 1000) break
  }

  if (!allPrecos.length) return { notFound: true }

  // Deduplica por farmácia (menor preço)
  const porFarmacia = {}
  for (const p of allPrecos) {
    if (!porFarmacia[p.farmacia_id] || p.preco < porFarmacia[p.farmacia_id].preco) {
      porFarmacia[p.farmacia_id] = p
    }
  }

  const precos = Object.values(porFarmacia).sort((a, b) => a.preco - b.preco)
  const medicamento = precos[0]?.medicamento || params.slug.replace(/-/g, ' ')

  return {
    props: { medicamento, precos, slug: params.slug },
    revalidate: 86400 // revalida a cada 24h
  }
}
