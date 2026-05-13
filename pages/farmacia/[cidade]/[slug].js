// pages/farmacia/[cidade]/[slug].js
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'
const GMAPS_KEY = 'AIzaSyB09Wt3Bvxa2dhGdcRacILCxnthbX7jctM'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function slugFarmacia(f) {
  const bairro = f.bairro && norm(f.bairro) !== norm(f.cidade) ? norm(f.bairro) : ''
  const nome = norm(f.nome)
  return bairro ? `${bairro}-${nome}` : nome
}

function CTABusca({ cidade }) {
  const [remedio, setRemedio] = useState('')
  return (
    <div style={{ position:'sticky',top:60,zIndex:200,background:'#fff',borderBottom:'2px solid #ffe0cc',padding:'10px 20px',boxShadow:'0 2px 12px rgba(255,90,0,.12)' }}>
      <div style={{ maxWidth:900,margin:'0 auto',display:'flex',alignItems:'center',gap:10,flexWrap:'wrap' }}>
        <div style={{ fontSize:13,fontWeight:600,color:ACCENT,whiteSpace:'nowrap',flexShrink:0 }}>💊 Compare preços em {cidade}:</div>
        <div style={{ flex:1,display:'flex',gap:8,minWidth:200 }}>
          <input type="text" value={remedio} onChange={e => setRemedio(e.target.value)}
            onKeyDown={e => e.key==='Enter' && remedio.trim() && (window.location.href='/?q='+encodeURIComponent(remedio))}
            placeholder="Digite o remédio..."
            style={{ flex:1,height:36,border:'1.5px solid #ffe0cc',borderRadius:8,padding:'0 12px',fontSize:14,fontFamily:'inherit',outline:'none' }}
            onFocus={e => e.target.style.borderColor='#ff5a00'}
            onBlur={e => e.target.style.borderColor='#ffe0cc'} />
          <a href={remedio.trim() ? '/?q='+encodeURIComponent(remedio) : '/'}
            style={{ height:36,padding:'0 16px',background:OG,color:'#fff',borderRadius:8,fontSize:13,fontWeight:700,display:'flex',alignItems:'center',whiteSpace:'nowrap',textDecoration:'none' }}>
            Comparar →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function FarmaciaPage({ farmacia, outrasNaCidade }) {
  if (!farmacia) return (
    <div style={{ textAlign:'center',padding:60 }}>
      <h1>Farmácia não encontrada</h1>
      <Link href="/cidades" style={{ color:ACCENT }}>← Ver cidades</Link>
    </div>
  )

  const cidadeSlug = `${norm(farmacia.cidade)}-${farmacia.estado.toLowerCase()}`
  const endereco = [farmacia.logradouro, farmacia.numero].filter(Boolean).join(', ')
  const enderecoCompleto = [endereco, farmacia.bairro, farmacia.cidade, farmacia.estado].filter(Boolean).join(', ')
  const mapsQuery = farmacia.latitude && farmacia.longitude
    ? `${farmacia.latitude},${farmacia.longitude}`
    : encodeURIComponent(enderecoCompleto)
  const mapsEmbedSrc = farmacia.latitude && farmacia.longitude
    ? `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${farmacia.latitude},${farmacia.longitude}&zoom=16`
    : `https://www.google.com/maps/embed/v1/place?key=${GMAPS_KEY}&q=${encodeURIComponent(enderecoCompleto)}&zoom=16`

  const schema = {
    "@context":"https://schema.org","@type":"Pharmacy","name":farmacia.nome,
    "address":{"@type":"PostalAddress","streetAddress":endereco,"addressLocality":farmacia.cidade,"addressRegion":farmacia.estado,"addressCountry":"BR"},
    ...(farmacia.telefone ? {"telephone":farmacia.telefone} : {}),
    ...(farmacia.latitude && farmacia.longitude ? {"geo":{"@type":"GeoCoordinates","latitude":farmacia.latitude,"longitude":farmacia.longitude}} : {})
  }

  return (
    <>
      <Head>
        <title>{farmacia.nome}{farmacia.bairro ? ` em ${farmacia.bairro}` : ''}, {farmacia.cidade} — FarmáciaAí</title>
        <meta name="description" content={`${farmacia.nome}${farmacia.bairro ? ` no ${farmacia.bairro}` : ''}, ${farmacia.cidade}, ${farmacia.estado}.${endereco ? ` Endereço: ${endereco}.` : ''} Compare preços de remédios.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/farmacia/${norm(farmacia.cidade)}/${slugFarmacia(farmacia)}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"BreadcrumbList",
          "itemListElement":[
            {"@type":"ListItem","position":1,"name":"Início","item":"https://farmaciaai.com.br"},
            {"@type":"ListItem","position":2,"name":farmacia.cidade,"item":`https://farmaciaai.com.br/cidade/${cidadeSlug}`},
            {"@type":"ListItem","position":3,"name":farmacia.nome}
          ]
        })}} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:DM Sans,sans-serif;color:#222;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}details summary::-webkit-details-marker{display:none}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:38,width:'auto' }} /></Link>
          <Link href="/" style={{ fontSize:14,fontWeight:600,color:'#fff',background:OG,padding:'8px 18px',borderRadius:10 }}>Comparar preços</Link>
        </div>
      </nav>

      <CTABusca cidade={farmacia.cidade} />

      <div style={{ background:'#111',padding:'44px 20px 52px' }}>
        <div style={{ maxWidth:900,margin:'0 auto' }}>
          <div style={{ display:'flex',gap:6,fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:18,flexWrap:'wrap' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.5)' }}>Início</Link>
            <span>›</span>
            <Link href={`/cidade/${cidadeSlug}`} style={{ color:'rgba(255,255,255,.5)' }}>{farmacia.cidade}</Link>
            <span>›</span>
            <span>{farmacia.nome}</span>
          </div>
          <div style={{ display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap' }}>
            <div style={{ width:56,height:56,borderRadius:14,background:ACCENT,display:'flex',alignItems:'center',justifyContent:'center',fontSize:26,flexShrink:0 }}>💊</div>
            <div style={{ flex:1 }}>
              <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(22px,4vw,38px)',color:'#fff',lineHeight:1.15,marginBottom:8 }}>
                {farmacia.nome}
                {farmacia.bairro && <><br/><em style={{ color:'rgba(255,255,255,.4)',fontStyle:'italic',fontSize:'60%' }}>em {farmacia.bairro}, {farmacia.cidade}</em></>}
              </h1>
              {endereco && <p style={{ fontSize:14,color:'rgba(255,255,255,.5)',marginBottom:14 }}>{endereco}</p>}
              <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
                <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener noreferrer"
                  style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.1)',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:500 }}>
                  📍 Ver no Google Maps
                </a>
                {farmacia.telefone && (
                  <a href={`tel:${farmacia.telefone}`}
                    style={{ display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.1)',color:'#fff',padding:'8px 16px',borderRadius:8,fontSize:13,fontWeight:500 }}>
                    📞 {farmacia.telefone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'40px 20px 72px' }}>
        <div style={{ marginBottom:40 }}>
          <h2 style={{ fontSize:17,fontWeight:700,color:'#111',marginBottom:14 }}>
            Onde fica {farmacia.nome}{farmacia.bairro ? ` no ${farmacia.bairro}` : ''}?
          </h2>
          <div style={{ borderRadius:16,overflow:'hidden',border:'1px solid #f0f0f0',boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
            <iframe width="100%" height="340" style={{ border:0,display:'block' }} loading="lazy"
              src={mapsEmbedSrc} title={`${farmacia.nome} — ${farmacia.cidade}`} />
          </div>
        </div>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:10,marginBottom:40 }}>
          {[
            ['📍','Endereço', endereco||'—'],
            ['🏙️','Bairro', farmacia.bairro||'—'],
            ['🏢','Cidade', `${farmacia.cidade} — ${farmacia.estado}`],
            ['📞','Telefone', farmacia.telefone||'—'],
            ...(farmacia.cep ? [['📬','CEP', farmacia.cep]] : []),
            ...(farmacia.cnes ? [['🏥','CNES', farmacia.cnes]] : []),
          ].map(([icon,label,value]) => (
            <div key={label} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'14px 16px' }}>
              <div style={{ fontSize:18,marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:10,fontWeight:700,color:'#bbb',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:13,color:'#222',lineHeight:1.5 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',border:'1px solid #ffd4be',borderRadius:20,padding:'26px 28px',marginBottom:40 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:ACCENT,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8 }}>Economize na farmácia</div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:20,color:'#111',marginBottom:6 }}>Compare preços antes de comprar em {farmacia.cidade}</h2>
              <p style={{ fontSize:14,color:'#666' }}>Veja se tem mais barato nas farmácias próximas. Gratuito e em tempo real.</p>
            </div>
            <Link href="/" style={{ background:OG,color:'#fff',padding:'13px 26px',borderRadius:14,fontSize:14,fontWeight:700,whiteSpace:'nowrap',boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
              Comparar preços →
            </Link>
          </div>
        </div>

        {outrasNaCidade.length > 0 && (
          <div style={{ marginBottom:40 }}>
            <h2 style={{ fontSize:17,fontWeight:700,color:'#111',marginBottom:14 }}>Outras farmácias em {farmacia.cidade}</h2>
            <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
              {outrasNaCidade.map(f => (
                <Link key={f.id} href={`/farmacia/${norm(f.cidade)}/${slugFarmacia(f)}`}
                  style={{ fontSize:13,color:ACCENT,background:'#fff3ee',border:'1px solid #ffd4be',padding:'5px 12px',borderRadius:100 }}
                  onMouseOver={e => e.currentTarget.style.background='#ffe8db'}
                  onMouseOut={e => e.currentTarget.style.background='#fff3ee'}>
                  {f.nome}{f.bairro ? ` — ${f.bairro}` : ''}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize:17,fontWeight:700,color:'#111',marginBottom:14 }}>Perguntas frequentes</h2>
          {[
            [`Onde fica a ${farmacia.nome}${farmacia.bairro ? ` no ${farmacia.bairro}` : ''}?`,
             `A ${farmacia.nome} está localizada${endereco ? ` em ${endereco}` : ''}${farmacia.bairro ? `, no bairro ${farmacia.bairro}` : ''}, em ${farmacia.cidade}, ${farmacia.estado}.`],
            [`Qual o horário de funcionamento da ${farmacia.nome}?`,
             `Para verificar o horário atualizado, consulte o Google Maps clicando em "Ver no Google Maps" acima.`],
            [`Como chegar na ${farmacia.nome} em ${farmacia.cidade}?`,
             `Clique em "Ver no Google Maps" para as melhores rotas até a ${farmacia.nome}${farmacia.bairro ? ` no ${farmacia.bairro}` : ''}, ${farmacia.cidade}.`],
            [`Posso comparar preços de remédios na ${farmacia.nome}?`,
             `Sim! Use o FarmáciaAí para comparar preços de qualquer remédio em ${farmacia.cidade}. Gratuito e em tempo real.`],
          ].map(([q,a],i) => (
            <details key={i} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,marginBottom:8,overflow:'hidden' }}>
              <summary style={{ padding:'13px 16px',fontSize:14,fontWeight:500,color:'#222',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',listStyle:'none' }}>
                {q} <span style={{ color:'#aaa',flexShrink:0,marginLeft:8 }}>+</span>
              </summary>
              <div style={{ padding:'0 16px 13px',fontSize:14,color:'#555',lineHeight:1.75 }}>{a}</div>
            </details>
          ))}
        </div>
      </div>

      <footer style={{ background:'#111',color:'#555',padding:'24px 20px',textAlign:'center' }}>
        <div style={{ fontSize:12 }}>© {new Date().getFullYear()} FarmáciaAí · Não vendemos medicamentos.</div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const supabase = getSupabase()

  const { data: farmacias, error } = await supabase.rpc('farmacia_por_cidade_slug', {
    p_cidade_slug: params.cidade,
    p_farmacia_slug: params.slug,
  })

  if (error) console.error('farmacia_por_cidade_slug error:', error)
  if (!farmacias || farmacias.length === 0) return { notFound: true }

  const farmacia = farmacias.find(f =>
    slugFarmacia(f) === params.slug || norm(f.nome) === params.slug
  )
  if (!farmacia) return { notFound: true }

  const outrasNaCidade = farmacias
    .filter(f => f.id !== farmacia.id)
    .slice(0, 12)
    .map(f => ({ id: f.id, nome: f.nome||'', bairro: f.bairro||'', cidade: f.cidade||'' }))

  const safe = {
    id: farmacia.id, nome: farmacia.nome||'', bairro: farmacia.bairro||'',
    logradouro: farmacia.logradouro||'', numero: farmacia.numero||'',
    cep: farmacia.cep||'', telefone: farmacia.telefone||'',
    cidade: farmacia.cidade||'', estado: farmacia.estado||'',
    latitude: farmacia.latitude||null, longitude: farmacia.longitude||null,
    cnes: farmacia.cnes||'',
  }

  return { props: { farmacia: safe, outrasNaCidade }, revalidate: 86400 }
}
