// pages/farmacia/[placeId].js — Página SEO de cada farmácia
import Head from 'next/head'
import Link from 'next/link'
import { FARMACIAS_SEED, REDES_INFO } from '../../../lib/farmacias-seed'
import { REMEDIOS } from '../../../lib/data'

const OrangeGrad = 'linear-gradient(135deg,#ff6b1a,#ff4500)'

export default function FarmaciaPage({ farmacia, remediosPopulares }) {
  if (!farmacia) return <div>Farmácia não encontrada</div>
  const rede = REDES_INFO[farmacia.rede] || {}
  const slug = `${farmacia.nome} ${farmacia.bairro} ${farmacia.cidade}`

  const schema = {
    "@context": "https://schema.org",
    "@type": "Pharmacy",
    "name": `${farmacia.nome} - ${farmacia.bairro}`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": farmacia.endereco,
      "addressLocality": farmacia.cidade,
      "addressRegion": farmacia.estado,
      "addressCountry": "BR"
    },
    "geo": { "@type": "GeoCoordinates", "latitude": farmacia.lat, "longitude": farmacia.lng },
    "url": `https://farmaciaai.com.br/farmacia/${farmacia.place_id}`,
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://farmaciaai.com.br" },
      { "@type": "ListItem", "position": 2, "name": farmacia.cidade, "item": `https://farmaciaai.com.br/cidade/${farmacia.cidade.toLowerCase().replace(/\s/g,'-')}-${farmacia.estado.toLowerCase()}` },
      { "@type": "ListItem", "position": 3, "name": `${farmacia.nome} - ${farmacia.bairro}` },
    ]
  }

  return (
    <>
      <Head>
        <title>{farmacia.nome} em {farmacia.bairro}, {farmacia.cidade} — Preços e Endereço | FarmáciaAí</title>
        <meta name="description" content={`${farmacia.nome} em ${farmacia.bairro}, ${farmacia.cidade}. Endereço: ${farmacia.endereco}. Compare preços de remédios e veja o mapa.`} />
        <meta property="og:title" content={`${farmacia.nome} - ${farmacia.bairro}, ${farmacia.cidade}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#fff;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      {/* NAV */}
      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f0f0f0',boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/" style={{ display:'flex',alignItems:'center' }}>
            <img src="/logo.png" alt="FarmáciaAí" style={{ height:40,width:'auto' }} />
          </Link>
          <Link href="/" style={{ fontSize:14,fontWeight:600,color:'#fff',background:OrangeGrad,padding:'9px 20px',borderRadius:10 }}>
            Comparar preços
          </Link>
        </div>
      </nav>

      {/* HERO ESCURO */}
      <div style={{ background:'#111',padding:'48px 20px 56px' }}>
        <div style={{ maxWidth:900,margin:'0 auto' }}>
          {/* Breadcrumb */}
          <div style={{ display:'flex',gap:6,fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:20,flexWrap:'wrap' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.5)' }}>Início</Link>
            <span>›</span>
            <Link href={`/cidade/${farmacia.cidade.toLowerCase().replace(/\s/g,'-')}-${farmacia.estado.toLowerCase()}`} style={{ color:'rgba(255,255,255,.5)' }}>{farmacia.cidade}</Link>
            <span>›</span>
            <span>{farmacia.nome} - {farmacia.bairro}</span>
          </div>

          <div style={{ display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap' }}>
            <div style={{ width:56,height:56,borderRadius:14,background:rede.cor||'#ff4500',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0 }}>💊</div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(24px,4vw,40px)',color:'#fff',lineHeight:1.15,marginBottom:8 }}>
                {farmacia.nome}
                <span style={{ color:'rgba(255,255,255,.4)',fontStyle:'italic' }}> em {farmacia.bairro}</span>
              </h1>
              <p style={{ fontSize:15,color:'rgba(255,255,255,.5)',marginBottom:16 }}>{farmacia.endereco}, {farmacia.cidade}, {farmacia.estado}</p>
              <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(slug)}`} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.1)',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:500 }}>
                  📍 Ver no Google Maps
                </a>
                <a href={`https://www.${rede.site}`} target="_blank" rel="noopener noreferrer nofollow"
                  style={{ display:'inline-flex',alignItems:'center',gap:6,background:OrangeGrad,color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:600 }}>
                  🛒 Site oficial
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'40px 20px 72px' }}>

        {/* MAPA */}
        <div style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>
            Localização — {farmacia.nome}, {farmacia.bairro}
          </h2>
          <div style={{ borderRadius:16,overflow:'hidden',border:'1px solid #f0f0f0',boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
            <iframe
              width="100%" height="360" style={{ border:0,display:'block' }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || 'AIzaSyB09Wt3Bvxa2dhGdcRacILCxnthbX7jctM'}&q=${encodeURIComponent(farmacia.endereco + ', ' + farmacia.cidade)}&zoom=16`}
              title={`Mapa ${farmacia.nome} ${farmacia.bairro}`}
            />
          </div>
        </div>

        {/* INFO CARDS */}
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:14,marginBottom:40 }}>
          {[
            ['📍', 'Endereço', farmacia.endereco],
            ['🏙️', 'Bairro', `${farmacia.bairro}, ${farmacia.cidade} - ${farmacia.estado}`],
            ['🏪', 'Rede', rede.nome || farmacia.nome],
            ['🌐', 'Site', rede.site || '—'],
          ].map(([icon, label, value]) => (
            <div key={label} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'18px 20px' }}>
              <div style={{ fontSize:20,marginBottom:8 }}>{icon}</div>
              <div style={{ fontSize:12,fontWeight:600,color:'#aaa',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:14,color:'#222',lineHeight:1.5 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* COMPARAR PREÇOS */}
        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',border:'1px solid #ffd4be',borderRadius:20,padding:'28px 32px',marginBottom:40 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8 }}>Compare antes de comprar</div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:24,color:'#111',marginBottom:8 }}>
                Encontre preços mais baratos em {farmacia.cidade}
              </h2>
              <p style={{ fontSize:14,color:'#666',maxWidth:480 }}>
                Use o FarmáciaAí para comparar os preços de qualquer remédio nas farmácias de {farmacia.cidade} e encontre a melhor oferta.
              </p>
            </div>
            <Link href="/" style={{ display:'inline-flex',alignItems:'center',gap:8,background:OrangeGrad,color:'#fff',padding:'14px 28px',borderRadius:14,fontSize:15,fontWeight:700,whiteSpace:'nowrap',boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
              Comparar preços agora →
            </Link>
          </div>
        </div>

        {/* REMÉDIOS POPULARES NESSA FARMÁCIA */}
        <div style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>
            Remédios disponíveis na {farmacia.nome}
          </h2>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10 }}>
            {remediosPopulares.map(r => (
              <Link key={r.slug} href={`/?q=${encodeURIComponent(r.principio)}`}
                style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all .15s' }}
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

        {/* OUTRAS FARMÁCIAS NA MESMA CIDADE */}
        <div style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>
            Outras farmácias em {farmacia.cidade}
          </h2>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
            {FARMACIAS_SEED.filter(f => f.cidade === farmacia.cidade && f.place_id !== farmacia.place_id).slice(0,10).map(f => (
              <Link key={f.place_id} href={`/farmacia/${f.place_id}`}
                style={{ fontSize:13,color:'#ff4500',background:'#fff3ee',border:'1px solid #ffd4be',padding:'5px 12px',borderRadius:100 }}>
                {f.nome} - {f.bairro}
              </Link>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>Perguntas frequentes</h2>
          {[
            [`Onde fica a ${farmacia.nome} em ${farmacia.bairro}?`, `A ${farmacia.nome} está localizada em ${farmacia.endereco}, no bairro ${farmacia.bairro}, em ${farmacia.cidade}, ${farmacia.estado}.`],
            [`Como comparar preços na ${farmacia.nome}?`, `Use o FarmáciaAí para comparar os preços de qualquer remédio na ${farmacia.nome} e em outras farmácias de ${farmacia.cidade}. A busca é gratuita e mostra os preços em tempo real.`],
            [`A ${farmacia.nome} de ${farmacia.bairro} tem delivery?`, `Para verificar disponibilidade de delivery e horários de funcionamento, acesse o site oficial da ${farmacia.nome} em ${rede.site || 'seu site oficial'} ou ligue diretamente para a unidade.`],
          ].map(([q, a], i) => (
            <details key={i} style={{ border:'1px solid #f0f0f0',borderRadius:12,marginBottom:8,overflow:'hidden' }}>
              <summary style={{ padding:'14px 18px',fontSize:14,fontWeight:500,color:'#222',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',listStyle:'none' }}>
                {q} <span style={{ color:'#aaa',marginLeft:8 }}>+</span>
              </summary>
              <div style={{ padding:'0 18px 14px',fontSize:14,color:'#666',lineHeight:1.7 }}>{a}</div>
            </details>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:'#111',color:'#666',padding:'32px 20px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
          <Link href="/" style={{ fontFamily:"'DM Serif Display',serif",fontSize:20,color:'#ff5a00' }}>FarmáciaAí</Link>
          <div style={{ fontSize:12,color:'#444',maxWidth:500 }}>© {new Date().getFullYear()} FarmáciaAí — Os preços são obtidos automaticamente. FarmáciaAí não vende medicamentos.</div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: FARMACIAS_SEED.map(f => ({ params: { placeId: f.place_id } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const farmacia = FARMACIAS_SEED.find(f => f.place_id === params.placeId)
  if (!farmacia) return { notFound: true }
  return {
    props: {
      farmacia,
      remediosPopulares: REMEDIOS.slice(0, 8),
    },
    revalidate: 86400,
  }
}
