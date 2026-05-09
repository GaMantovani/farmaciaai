// pages/farmacia/[cidade]/[bairro]/[slug].js
// URL: /farmacia/sao-paulo/tatuape/pharmacia-millenium
import Head from 'next/head'
import Link from 'next/link'
import { FARMACIAS_SEED, REDES_INFO } from '../../../../lib/farmacias-seed'
import { REMEDIOS } from '../../../../lib/data'
import farmaciasColetadas from '../../../../lib/farmacias-coletadas.json'

const TODAS = [...FARMACIAS_SEED, ...farmaciasColetadas]
const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'

function normalizar(str) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

function gerarSlug(f) {
  return `${normalizar(f.cidade)}/${normalizar(f.bairro || f.cidade)}/${normalizar(f.nome)}`
}

export default function FarmaciaPage({ farmacia, outrasNaCidade }) {
  if (!farmacia) return <div>Farmácia não encontrada</div>
  const rede = REDES_INFO[farmacia.rede] || {}
  const cidadeSlug = normalizar(farmacia.cidade)
  const estadoSlug = farmacia.estado.toLowerCase()

  const schema = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "name": farmacia.nome,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": farmacia.endereco,
      "addressLocality": farmacia.cidade,
      "addressRegion": farmacia.estado,
      "addressCountry": "BR"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": farmacia.lat, "longitude": farmacia.lng },
    "url": `https://farmaciaai.com.br/farmacia/${gerarSlug(farmacia)}`,
    ...(farmacia.avaliacao ? { "aggregateRating": { "@type": "AggregateRating", "ratingValue": farmacia.avaliacao, "bestRating": "5", "worstRating": "1", "ratingCount": "10" } } : {})
  }

  return (
    <>
      <Head>
        <title>{farmacia.nome} em {farmacia.bairro}, {farmacia.cidade} — Endereço e Preços | FarmáciaAí</title>
        <meta name="description" content={`${farmacia.nome} em ${farmacia.bairro}, ${farmacia.cidade}, ${farmacia.estado}. Endereço: ${farmacia.endereco}. Veja no mapa e compare preços de remédios.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/farmacia/${gerarSlug(farmacia)}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://farmaciaai.com.br" },
            { "@type": "ListItem", "position": 2, "name": farmacia.cidade, "item": `https://farmaciaai.com.br/cidade/${cidadeSlug}-${estadoSlug}` },
            { "@type": "ListItem", "position": 3, "name": farmacia.bairro, "item": `https://farmaciaai.com.br/farmacia/${cidadeSlug}/${normalizar(farmacia.bairro)}` },
            { "@type": "ListItem", "position": 4, "name": farmacia.nome },
          ]
        })}} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#fff;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}details summary::-webkit-details-marker{display:none}`}</style>

      {/* NAV */}
      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f0f0f0',boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:40,width:'auto' }} /></Link>
          <Link href="/" style={{ fontSize:14,fontWeight:600,color:'#fff',background:OG,padding:'9px 20px',borderRadius:10 }}>Comparar preços</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background:'#111',padding:'48px 20px 56px' }}>
        <div style={{ maxWidth:900,margin:'0 auto' }}>
          <div style={{ display:'flex',gap:6,fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:20,flexWrap:'wrap' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.5)' }}>Início</Link>
            <span>›</span>
            <Link href={`/cidade/${cidadeSlug}-${estadoSlug}`} style={{ color:'rgba(255,255,255,.5)' }}>{farmacia.cidade}</Link>
            <span>›</span>
            <Link href={`/farmacia/${cidadeSlug}/${normalizar(farmacia.bairro)}`} style={{ color:'rgba(255,255,255,.5)' }}>{farmacia.bairro}</Link>
            <span>›</span>
            <span>{farmacia.nome}</span>
          </div>
          <div style={{ display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap' }}>
            <div style={{ width:56,height:56,borderRadius:14,background:rede.cor||'#ff4500',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0 }}>💊</div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(24px,4vw,40px)',color:'#fff',lineHeight:1.15,marginBottom:8 }}>
                {farmacia.nome}
                <br/><em style={{ color:'rgba(255,255,255,.4)',fontStyle:'italic',fontSize:'70%' }}>em {farmacia.bairro}, {farmacia.cidade}</em>
              </h1>
              <p style={{ fontSize:15,color:'rgba(255,255,255,.5)',marginBottom:12 }}>{farmacia.endereco}</p>
              {farmacia.avaliacao && (
                <div style={{ display:'inline-flex',alignItems:'center',gap:4,background:'rgba(255,255,255,.1)',padding:'4px 12px',borderRadius:100,fontSize:13,color:'#fbbf24',marginBottom:14 }}>
                  ★ {farmacia.avaliacao} de avaliação
                </div>
              )}
              <div style={{ display:'flex',gap:10,flexWrap:'wrap',marginTop:4 }}>
                <a href={`https://www.google.com/maps/place/?q=place_id:${farmacia.place_id}`} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.1)',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:500 }}>
                  📍 Ver no Google Maps
                </a>
                {rede.site && (
                  <a href={`https://www.${rede.site}`} target="_blank" rel="noopener noreferrer nofollow"
                    style={{ display:'inline-flex',alignItems:'center',gap:6,background:OG,color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:600 }}>
                    🛒 Site oficial
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'40px 20px 72px' }}>

        {/* MAPA */}
        <div style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>
            Onde fica a {farmacia.nome} em {farmacia.bairro}?
          </h2>
          <div style={{ borderRadius:16,overflow:'hidden',border:'1px solid #f0f0f0',boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
            <iframe width="100%" height="360" style={{ border:0,display:'block' }} loading="lazy"
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyB09Wt3Bvxa2dhGdcRacILCxnthbX7jctM&q=place_id:${farmacia.place_id}&zoom=16`}
              title={`${farmacia.nome} - ${farmacia.bairro}, ${farmacia.cidade}`} />
          </div>
        </div>

        {/* INFO */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:12,marginBottom:40 }}>
          {[
            ['📍','Endereço',farmacia.endereco],
            ['🏙️','Bairro',farmacia.bairro],
            ['🏢','Cidade',`${farmacia.cidade} - ${farmacia.estado}`],
            ['⭐','Avaliação',farmacia.avaliacao ? `${farmacia.avaliacao} / 5` : 'Não disponível'],
          ].map(([icon,label,value]) => (
            <div key={label} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'16px 18px' }}>
              <div style={{ fontSize:18,marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:11,fontWeight:600,color:'#aaa',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:13,color:'#222',lineHeight:1.5 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',border:'1px solid #ffd4be',borderRadius:20,padding:'28px 32px',marginBottom:40 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8 }}>Economize na farmácia</div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:'#111',marginBottom:8 }}>
                Compare preços antes de comprar em {farmacia.cidade}
              </h2>
              <p style={{ fontSize:14,color:'#666' }}>Veja se tem mais barato nas farmácias próximas. Gratuito e em tempo real.</p>
            </div>
            <Link href="/" style={{ display:'inline-flex',alignItems:'center',gap:8,background:OG,color:'#fff',padding:'14px 28px',borderRadius:14,fontSize:15,fontWeight:700,whiteSpace:'nowrap',boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
              Comparar preços →
            </Link>
          </div>
        </div>

        {/* REMÉDIOS */}
        <div style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>
            Remédios disponíveis na {farmacia.nome}
          </h2>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10 }}>
            {REMEDIOS.slice(0,8).map(r => (
              <Link key={r.slug} href={`/?q=${encodeURIComponent(r.principio)}`}
                style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,padding:'12px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all .15s' }}
                onMouseOver={e=>{e.currentTarget.style.borderColor='#ff8c5a';e.currentTarget.style.boxShadow='0 3px 10px rgba(255,90,0,.1)'}}
                onMouseOut={e=>{e.currentTarget.style.borderColor='#f0f0f0';e.currentTarget.style.boxShadow='none'}}>
                <div>
                  <div style={{ fontSize:13,fontWeight:600,color:'#222',marginBottom:2 }}>{r.nome}</div>
                  <div style={{ fontSize:11,color:'#aaa' }}>{r.categoria}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>

        {/* OUTRAS NO BAIRRO/CIDADE */}
        {outrasNaCidade.length > 0 && (
          <div style={{ marginBottom:40 }}>
            <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>
              Outras farmácias em {farmacia.bairro}, {farmacia.cidade}
            </h2>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
              {outrasNaCidade.map(f => (
                <Link key={f.place_id} href={`/farmacia/${gerarSlug(f)}`}
                  style={{ fontSize:13,color:'#ff4500',background:'#fff3ee',border:'1px solid #ffd4be',padding:'5px 12px',borderRadius:100 }}
                  onMouseOver={e=>e.currentTarget.style.background='#ffe8db'}
                  onMouseOut={e=>e.currentTarget.style.background='#fff3ee'}>
                  {f.nome}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>Perguntas frequentes</h2>
          {[
            [`Onde fica a ${farmacia.nome} no ${farmacia.bairro}?`,
             `A ${farmacia.nome} está localizada em ${farmacia.endereco}, no bairro ${farmacia.bairro}, em ${farmacia.cidade}, ${farmacia.estado}. Use o mapa acima para ver a localização exata e obter direções.`],
            [`Qual o horário de funcionamento da ${farmacia.nome} em ${farmacia.bairro}?`,
             `Para verificar o horário de funcionamento atualizado, consulte o Google Maps ou entre em contato diretamente com a unidade da ${farmacia.nome} em ${farmacia.bairro}.`],
            [`Como chegar na ${farmacia.nome} em ${farmacia.cidade}?`,
             `Clique em "Ver no Google Maps" acima para obter as melhores rotas de carro, transporte público ou a pé até a ${farmacia.nome} em ${farmacia.bairro}, ${farmacia.cidade}.`],
            [`Posso comparar preços de remédios na ${farmacia.nome}?`,
             `Sim! Use o FarmáciaAí para comparar os preços de qualquer remédio na ${farmacia.nome} e em outras farmácias de ${farmacia.cidade}. A busca é gratuita e mostra os preços em tempo real.`],
          ].map(([q,a],i) => (
            <details key={i} style={{ border:'1px solid #f0f0f0',borderRadius:12,marginBottom:8,overflow:'hidden' }}>
              <summary style={{ padding:'14px 18px',fontSize:14,fontWeight:500,color:'#222',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                {q} <span style={{ color:'#aaa',flexShrink:0,marginLeft:8 }}>+</span>
              </summary>
              <div style={{ padding:'0 18px 14px',fontSize:14,color:'#666',lineHeight:1.7 }}>{a}</div>
            </details>
          ))}
        </div>
      </div>

      <footer style={{ background:'#111',color:'#666',padding:'32px 20px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:16,alignItems:'center' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:32,filter:'brightness(10)' }} /></Link>
          <div style={{ fontSize:12,color:'#444' }}>© {new Date().getFullYear()} FarmáciaAí — Não vendemos medicamentos.</div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  const paths = TODAS.map(f => ({
    params: {
      cidade: normalizar(f.cidade),
      bairro: normalizar(f.bairro && f.bairro.trim() ? f.bairro : f.cidade) || normalizar(f.cidade),
      slug: normalizar(f.nome),
    }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const farmacia = TODAS.find(f =>
    normalizar(f.cidade) === params.cidade &&
    (normalizar(f.bairro && f.bairro.trim() ? f.bairro : f.cidade) || normalizar(f.cidade)) === params.bairro &&
    normalizar(f.nome) === params.slug
  )
  if (!farmacia) return { notFound: true }
  const outrasNaCidade = TODAS
    .filter(f => f.cidade === farmacia.cidade && f.place_id !== farmacia.place_id)
    .slice(0, 10)
  return {
    props: { farmacia, outrasNaCidade },
    revalidate: 86400,
  }
}
