// pages/remedio/[slug]/[cidade].js — ex: /remedio/dipirona/sao-paulo-sp
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function slugFarmacia(f) {
  const bairro = f.bairro && norm(f.bairro) !== norm(f.cidade) ? norm(f.bairro) : ''
  return bairro ? `${bairro}-${norm(f.nome)}` : norm(f.nome)
}

export default function RemedioNaCidadePage({ medicamento, precos, farmacias, cidade, estado, cidadeSlug, slug }) {
  if (!medicamento) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <h1>Remédio não encontrado</h1>
      <Link href="/remedios" style={{ color:ACCENT }}>← Ver todos os remédios</Link>
    </div>
  )

  const melhor = precos[0]
  const pior = precos[precos.length - 1]
  const economia = precos.length > 1 ? (pior.preco - melhor.preco).toFixed(2).replace('.', ',') : null
  const descPreco = melhor ? `Menor preço: R$ ${melhor.preco.toFixed(2).replace('.', ',')} na ${melhor.farmacia}. ` : ''

  const schemaProduct = {
    "@context": "https://schema.org",
    "@type": "Drug",
    "name": medicamento.nome,
    ...(medicamento.principio_ativo ? { "activeIngredient": medicamento.principio_ativo } : {}),
    "offers": precos.slice(0, 5).map(p => ({
      "@type": "Offer",
      "price": p.preco.toFixed(2),
      "priceCurrency": "BRL",
      "seller": { "@type": "Organization", "name": p.farmacia },
      "url": p.url,
      "availability": "https://schema.org/InStock"
    }))
  }

  const schemaBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://farmaciaai.com.br" },
      { "@type": "ListItem", "position": 2, "name": "Remédios", "item": "https://farmaciaai.com.br/remedios" },
      { "@type": "ListItem", "position": 3, "name": medicamento.nome, "item": `https://farmaciaai.com.br/remedio/${slug}` },
      { "@type": "ListItem", "position": 4, "name": cidade }
    ]
  }

  return (
    <>
      <Head>
        <title>{medicamento.nome} em {cidade} — Compare preços | FarmáciaAí</title>
        <meta name="description" content={`Compare o preço de ${medicamento.nome} em ${cidade}, ${estado}. ${descPreco}Veja ${farmacias.length} farmácias em ${cidade}.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/remedio/${slug}/${cidadeSlug}`} />
        <meta property="og:title" content={`${medicamento.nome} em ${cidade} — FarmáciaAí`} />
        <meta property="og:description" content={`${descPreco}Compare preços e veja farmácias em ${cidade}.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://farmaciaai.com.br/remedio/${slug}/${cidadeSlug}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700;800&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProduct) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaBreadcrumb) }} />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;color:#111;background:#f7f8fa;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        details summary::-webkit-details-marker{display:none}
        .card-farmacia:hover{border-color:${ACCENT}!important;box-shadow:0 2px 10px rgba(255,69,0,.1)!important}
      `}</style>

      {/* NAV */}
      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:1000,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:38 }} /></Link>
          <Link href={`/?q=${encodeURIComponent(medicamento.nome)}`}
            style={{ background:OG,color:'#fff',padding:'8px 20px',borderRadius:10,fontSize:14,fontWeight:700,boxShadow:'0 4px 12px rgba(255,69,0,.25)' }}>
            Comparar preços →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background:'linear-gradient(135deg,#ff6b1a,#ff4500)',padding:'36px 20px 40px' }}>
        <div style={{ maxWidth:1000,margin:'0 auto' }}>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:12,display:'flex',gap:6,alignItems:'center',flexWrap:'wrap' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Início</Link>
            <span>›</span>
            <Link href="/remedios" style={{ color:'rgba(255,255,255,.7)' }}>Remédios</Link>
            <span>›</span>
            <Link href={`/remedio/${slug}`} style={{ color:'rgba(255,255,255,.7)' }}>{medicamento.nome}</Link>
            <span>›</span>
            <span style={{ color:'#fff' }}>{cidade}</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(20px,4vw,36px)',color:'#fff',lineHeight:1.15,marginBottom:12 }}>
            {medicamento.nome}
            <br />
            <span style={{ fontSize:'55%',fontStyle:'italic',opacity:.75 }}>em {cidade}, {estado}</span>
          </h1>
          <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
            {precos.length > 0 && (
              <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>
                {precos.length} farmácia{precos.length !== 1 ? 's' : ''} online
              </span>
            )}
            {farmacias.length > 0 && (
              <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>
                {farmacias.length} farmácia{farmacias.length !== 1 ? 's' : ''} em {cidade}
              </span>
            )}
            {economia && (
              <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>
                Economize até R$ {economia} online
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1000,margin:'0 auto',padding:'28px 20px 64px' }}>

        {/* MELHOR PREÇO ONLINE */}
        {melhor && (
          <div style={{ background:'#fff',border:`2px solid ${ACCENT}`,borderRadius:20,padding:'20px 24px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16,boxShadow:'0 8px 32px rgba(255,69,0,.1)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:14 }}>
              <span style={{ background:OG,color:'#fff',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:100,letterSpacing:'.05em',whiteSpace:'nowrap' }}>🏆 MENOR PREÇO ONLINE</span>
              <div>
                <div style={{ fontSize:17,fontWeight:700,color:'#111' }}>{melhor.farmacia}</div>
                <div style={{ fontSize:13,color:'#888',marginTop:2 }}>{melhor.medicamento}</div>
              </div>
            </div>
            <div style={{ display:'flex',alignItems:'center',gap:16 }}>
              <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:40,color:ACCENT,lineHeight:1 }}>
                <span style={{ fontSize:18,verticalAlign:'super',fontFamily:"'DM Sans',sans-serif",fontWeight:700 }}>R$</span>
                {melhor.preco.toFixed(2).replace('.',',')}
              </div>
              <a href={melhor.url} target="_blank" rel="noopener noreferrer"
                style={{ background:OG,color:'#fff',padding:'13px 28px',borderRadius:14,fontSize:15,fontWeight:700,whiteSpace:'nowrap',boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
                Comprar agora →
              </a>
            </div>
          </div>
        )}

        {/* COMPARATIVO ONLINE */}
        {precos.length > 0 && (
          <div style={{ background:'#fff',borderRadius:16,border:'1px solid #f0f0f0',overflow:'hidden',marginBottom:32 }}>
            <div style={{ padding:'14px 20px',borderBottom:'1px solid #f5f5f5',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
              <div style={{ fontSize:15,fontWeight:700,color:'#111' }}>Preços online — {precos.length} farmácias</div>
              <div style={{ fontSize:12,color:'#aaa' }}>Menor para maior</div>
            </div>
            {precos.map((p, i) => (
              <div key={i} style={{ display:'flex',alignItems:'center',padding:'12px 20px',gap:14,borderBottom:i<precos.length-1?'1px solid #f9f9f9':'none',background:i===0?'#fffaf8':'#fff' }}>
                <div style={{ width:26,height:26,borderRadius:'50%',background:i===0?OG:'#f0f0f0',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:i===0?'#fff':'#aaa',flexShrink:0 }}>
                  {i+1}
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontSize:14,fontWeight:600,color:'#111',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',display:'flex',alignItems:'center',gap:6 }}>
                    <span style={{ width:8,height:8,borderRadius:'50%',background:p.logo_cor||ACCENT,flexShrink:0,display:'inline-block' }} />
                    {p.farmacia}
                    {i===0 && <span style={{ fontSize:10,fontWeight:700,background:'#fff3ee',color:ACCENT,padding:'2px 7px',borderRadius:100 }}>Melhor preço</span>}
                  </div>
                  <div style={{ fontSize:12,color:'#aaa',marginTop:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{p.medicamento}</div>
                </div>
                {i>0 && (
                  <div style={{ fontSize:11,color:'#dc2626',background:'#fef2f2',padding:'2px 8px',borderRadius:100,whiteSpace:'nowrap',flexShrink:0 }}>
                    +R$ {(p.preco-melhor.preco).toFixed(2).replace('.',',')}
                  </div>
                )}
                <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:20,color:i===0?ACCENT:'#111',whiteSpace:'nowrap',flexShrink:0 }}>
                  R$ {p.preco.toFixed(2).replace('.',',')}
                </div>
                <a href={p.url} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:13,fontWeight:600,color:i===0?'#fff':ACCENT,background:i===0?OG:'transparent',border:i===0?'none':`1.5px solid #ffb89a`,padding:'7px 14px',borderRadius:8,whiteSpace:'nowrap',flexShrink:0 }}>
                  {i===0?'Comprar':'Ver oferta'}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* SEM PREÇOS ONLINE */}
        {precos.length === 0 && (
          <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'24px',marginBottom:32,textAlign:'center' }}>
            <div style={{ fontSize:32,marginBottom:12 }}>💊</div>
            <p style={{ fontSize:15,color:'#555',marginBottom:16 }}>
              Não encontramos preços online para <strong>{medicamento.nome}</strong> no momento.
            </p>
            <Link href={`/?q=${encodeURIComponent(medicamento.nome.split(' ')[0])}`}
              style={{ background:OG,color:'#fff',padding:'10px 22px',borderRadius:10,fontSize:14,fontWeight:700,display:'inline-block' }}>
              Buscar variações →
            </Link>
          </div>
        )}

        {/* FARMÁCIAS NA CIDADE */}
        {farmacias.length > 0 && (
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:'#111',marginBottom:6 }}>
              Farmácias em {cidade} para comprar {medicamento.nome.split(' ')[0]}
            </h2>
            <p style={{ fontSize:14,color:'#888',marginBottom:16 }}>
              Ligue ou vá até uma dessas farmácias em {cidade} e pergunte pelo {medicamento.nome}.
            </p>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:10 }}>
              {farmacias.slice(0, 20).map(f => (
                <Link key={f.id} href={`/farmacia/${norm(f.cidade)}/${slugFarmacia(f)}`}
                  className="card-farmacia"
                  style={{ background:'#fff',border:'1px solid #efefef',borderRadius:14,padding:'14px 16px',display:'flex',gap:12,alignItems:'flex-start',transition:'border-color .12s,box-shadow .12s' }}>
                  <div style={{ width:36,height:36,borderRadius:10,background:'#fff3ee',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>💊</div>
                  <div style={{ flex:1,minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:600,color:'#111',marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{f.nome}</div>
                    {f.logradouro && <div style={{ fontSize:12,color:'#aaa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{f.logradouro}{f.numero?`, ${f.numero}`:''}</div>}
                    {f.bairro && <div style={{ fontSize:11,color:'#bbb',marginTop:2 }}>{f.bairro}</div>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{ flexShrink:0,marginTop:2 }}><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
            {farmacias.length > 20 && (
              <div style={{ textAlign:'center',marginTop:14 }}>
                <Link href={`/cidade/${cidadeSlug}`}
                  style={{ fontSize:14,color:ACCENT,border:`1px solid #ffb89a`,padding:'8px 20px',borderRadius:10,display:'inline-block' }}>
                  Ver todas as {farmacias.length} farmácias em {cidade} →
                </Link>
              </div>
            )}
          </div>
        )}

        {/* FAQ */}
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:'#111',marginBottom:16 }}>
            Perguntas frequentes
          </h2>
          {[
            [
              `Onde comprar ${medicamento.nome} em ${cidade}?`,
              farmacias.length > 0
                ? `Em ${cidade} você pode encontrar ${medicamento.nome} em farmácias como ${farmacias.slice(0,3).map(f=>f.nome).join(', ')}. Além disso, compare preços online nas farmácias listadas acima.`
                : `Use o comparador do FarmáciaAí para encontrar ${medicamento.nome} online ou busque nas farmácias físicas de ${cidade}.`
            ],
            [
              `Qual o menor preço de ${medicamento.nome}?`,
              precos.length > 0
                ? `O menor preço online encontrado é R$ ${melhor.preco.toFixed(2).replace('.',',')} na ${melhor.farmacia}.${economia ? ` Você pode economizar até R$ ${economia} comparando as farmácias.` : ''}`
                : `Busque ${medicamento.nome} no comparador para ver preços em tempo real.`
            ],
            [
              `${medicamento.nome} precisa de receita médica?`,
              `A necessidade de receita depende da apresentação e concentração do produto. Consulte um farmacêutico ou médico antes de comprar.`
            ],
            [
              `Como comprar ${medicamento.nome} online?`,
              precos.length > 0
                ? `Clique em "Comprar" ou "Ver oferta" nas farmácias listadas acima. Você será redirecionado ao site da farmácia para finalizar a compra com segurança.`
                : `Use o botão "Comparar preços" no topo da página para buscar ${medicamento.nome} em farmácias online.`
            ],
          ].map(([q, a], i) => (
            <details key={i} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,marginBottom:8,overflow:'hidden' }}>
              <summary style={{ padding:'14px 18px',fontSize:14,fontWeight:600,color:'#111',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',listStyle:'none' }}>
                {q}<span style={{ color:'#aaa',flexShrink:0,marginLeft:8,fontSize:18 }}>+</span>
              </summary>
              <div style={{ padding:'0 18px 14px',fontSize:14,color:'#555',lineHeight:1.75 }}>{a}</div>
            </details>
          ))}
        </div>

        {/* CTA PREÇOS NACIONAIS */}
        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',border:'1px solid #ffd4be',borderRadius:18,padding:'24px 28px',marginBottom:24,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
          <div>
            <div style={{ fontSize:13,fontWeight:700,color:ACCENT,marginBottom:6 }}>💊 Comparar em todo o Brasil</div>
            <p style={{ fontSize:15,color:'#444' }}>Veja o preço de <strong>{medicamento.nome}</strong> em todas as farmácias online</p>
          </div>
          <Link href={`/remedio/${slug}`}
            style={{ background:OG,color:'#fff',padding:'12px 24px',borderRadius:12,fontSize:14,fontWeight:700,boxShadow:'0 4px 14px rgba(255,69,0,.25)',whiteSpace:'nowrap' }}>
            Ver preços nacionais →
          </Link>
        </div>

        {/* FOOTER NAV */}
        <div style={{ display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap' }}>
          <Link href={`/remedio/${slug}`} style={{ fontSize:13,color:ACCENT,border:`1px solid #ffb89a`,padding:'8px 16px',borderRadius:10 }}>← Preços nacionais</Link>
          <Link href={`/cidade/${cidadeSlug}`} style={{ fontSize:13,color:'#666',border:'1px solid #e0e0e0',padding:'8px 16px',borderRadius:10 }}>Farmácias em {cidade}</Link>
          <Link href="/remedios" style={{ fontSize:13,color:'#666',border:'1px solid #e0e0e0',padding:'8px 16px',borderRadius:10 }}>Todos os remédios</Link>
        </div>
      </div>

      <footer style={{ background:'#111',color:'#555',padding:'24px 20px',textAlign:'center' }}>
        <div style={{ maxWidth:1000,margin:'0 auto',fontSize:12 }}>
          © {new Date().getFullYear()} FarmáciaAí · Preços atualizados periodicamente. Verifique na farmácia antes de comprar.
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const supabase = getSupabase()
  const { slug, cidade: cidadeSlug } = params

  // Parse city from slug: "sao-paulo-sp" → cidade="sao paulo", estado="SP"
  const parts = cidadeSlug.split('-')
  const estado = parts[parts.length - 1].toUpperCase()
  const cidadeNorm = parts.slice(0, -1).join(' ')

  // 1. Verify medicamento exists
  const { data: med } = await supabase
    .from('medicamentos')
    .select('nome, principio_ativo, categoria, classe')
    .eq('slug', slug)
    .maybeSingle()

  if (!med) return { notFound: true }

  // 2. Fetch farmácias na cidade (apply quality filters via SQL function)
  const { data: farmaciasData } = await supabase.rpc('farmacias_por_cidade', {
    p_cidade: cidadeNorm,
    p_estado: estado,
  })

  if (!farmaciasData || farmaciasData.length === 0) return { notFound: true }

  const cidade = farmaciasData[0].cidade
  const farmacias = farmaciasData.slice(0, 24).map(f => ({
    id: f.id,
    nome: f.nome || '',
    bairro: f.bairro || '',
    logradouro: f.logradouro || '',
    numero: f.numero || '',
    cidade: f.cidade || '',
    estado: f.estado || '',
  }))

  // 3. Fetch online prices and filter by slug
  const { data: todosPrecos } = await supabase
    .from('precos')
    .select('medicamento, farmacia, farmacia_id, preco, url, logo_cor')

  const porFarmacia = {}
  for (const p of (todosPrecos || [])) {
    if (norm(p.medicamento) !== slug) continue
    if (!porFarmacia[p.farmacia_id] || p.preco < porFarmacia[p.farmacia_id].preco) {
      porFarmacia[p.farmacia_id] = p
    }
  }
  const precos = Object.values(porFarmacia).sort((a, b) => a.preco - b.preco)

  return {
    props: {
      medicamento: {
        nome: med.nome || '',
        principio_ativo: med.principio_ativo || '',
        categoria: med.categoria || '',
      },
      precos,
      farmacias,
      cidade,
      estado,
      cidadeSlug,
      slug,
    },
    revalidate: 86400,
  }
}
