// pages/cidade/[slug].js
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

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

export default function CidadePage({ cidade, estado, farmacias, bairros }) {
  if (!cidade) return (
    <div style={{ textAlign:'center',padding:60 }}>
      <h1>Cidade não encontrada</h1>
      <Link href="/cidades" style={{ color:ACCENT }}>← Ver todas as cidades</Link>
    </div>
  )

  const cidadeSlug = `${norm(cidade)}-${estado.toLowerCase()}`

  return (
    <>
      <Head>
        <title>Farmácias em {cidade} — {farmacias.length} endereços | FarmáciaAí</title>
        <meta name="description" content={`Encontre ${farmacias.length} farmácias em ${cidade}, ${estado}. Veja endereços e compare preços de remédios.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/cidade/${cidadeSlug}`} />
        <meta property="og:title" content={`Farmácias em ${cidade} — ${farmacias.length} endereços | FarmáciaAí`} />
        <meta property="og:description" content={`Encontre ${farmacias.length} farmácias em ${cidade}, ${estado}. Veja endereços e compare preços de remédios.`} />
        <meta property="og:url" content={`https://farmaciaai.com.br/cidade/${cidadeSlug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"BreadcrumbList",
          "itemListElement":[
            {"@type":"ListItem","position":1,"name":"Início","item":"https://farmaciaai.com.br"},
            {"@type":"ListItem","position":2,"name":"Cidades","item":"https://farmaciaai.com.br/cidades"},
            {"@type":"ListItem","position":3,"name":cidade,"item":`https://farmaciaai.com.br/cidade/${cidadeSlug}`}
          ]
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"ItemList",
          "name":`Farmácias em ${cidade}, ${estado}`,
          "description":`Lista completa de ${farmacias.length} farmácias em ${cidade}, ${estado}.`,
          "numberOfItems": farmacias.length,
          "itemListElement": farmacias.slice(0,10).map((f,i) => ({
            "@type":"ListItem","position":i+1,
            "item":{
              "@type":"Pharmacy","name":f.nome,
              "address":{
                "@type":"PostalAddress",
                "streetAddress":[f.logradouro,f.numero].filter(Boolean).join(', '),
                "addressLocality":f.cidade,"addressRegion":f.estado,"addressCountry":"BR"
              },
              ...(f.telefone ? {"telephone":f.telefone} : {}),
              ...(f.latitude && f.longitude ? {"geo":{"@type":"GeoCoordinates","latitude":f.latitude,"longitude":f.longitude}} : {}),
              "url":`https://farmaciaai.com.br/farmacia/${norm(f.cidade)}/${slugFarmacia(f)}`
            }
          }))
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"FAQPage",
          "mainEntity":[
            {"@type":"Question","name":`Quantas farmácias tem em ${cidade}?`,
             "acceptedAnswer":{"@type":"Answer","text":`${cidade} tem ${farmacias.length} farmácias cadastradas no FarmáciaAí, distribuídas em ${bairros.length} bairros.`}},
            {"@type":"Question","name":`Onde comprar remédio mais barato em ${cidade}?`,
             "acceptedAnswer":{"@type":"Answer","text":`Use o FarmáciaAí para comparar preços de remédios em farmácias que entregam em ${cidade}, ${estado}. A diferença de preço pode chegar a 70% entre farmácias.`}},
            {"@type":"Question","name":`Quais são as principais farmácias de ${cidade}?`,
             "acceptedAnswer":{"@type":"Answer","text":`Em ${cidade} você encontra redes como ${farmacias.slice(0,3).map(f=>f.nome).join(', ')} e outras ${farmacias.length - 3 > 0 ? farmacias.length - 3 : 0} farmácias cadastradas.`}},
          ]
        })}} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:DM Sans,sans-serif;color:#111;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height:38 }} /></Link>
          <Link href="/" style={{ background:OG,color:'#fff',padding:'8px 18px',borderRadius:10,fontSize:13,fontWeight:700 }}>Comparar preços →</Link>
        </div>
      </nav>

      <div style={{ background:OG,padding:'36px 20px 44px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:10 }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Início</Link>
            <span style={{ margin:'0 6px' }}>›</span>
            <Link href="/cidades" style={{ color:'rgba(255,255,255,.7)' }}>Cidades</Link>
            <span style={{ margin:'0 6px' }}>›</span>
            <span style={{ color:'#fff' }}>{cidade}</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(26px,4vw,42px)',color:'#fff',lineHeight:1.1,marginBottom:10 }}>
            Farmácias em {cidade}
          </h1>
          <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
            <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>{estado}</span>
            <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>{farmacias.length} farmácias</span>
            {bairros.length > 0 && <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>{bairros.length} bairros</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'32px 20px 72px' }}>
        {bairros.length > 1 && (
          <div style={{ marginBottom:28 }}>
            <div style={{ fontSize:12,fontWeight:600,color:'#aaa',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:10 }}>Filtrar por bairro</div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
              {bairros.slice(0,30).map(b => (
                <a key={b} href={`#bairro-${norm(b)}`}
                  style={{ fontSize:12,color:ACCENT,background:'#fff3ee',border:'1px solid #ffd4be',padding:'4px 11px',borderRadius:100 }}>
                  {b}
                </a>
              ))}
            </div>
          </div>
        )}

        {bairros.map(bairro => {
          const lista = farmacias.filter(f => (f.bairro || '').trim() === bairro)
          if (!lista.length) return null
          return (
            <div key={bairro} id={`bairro-${norm(bairro)}`} style={{ marginBottom:36 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:12 }}>
                <h2 style={{ fontSize:13,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'.07em' }}>{bairro}</h2>
                <div style={{ flex:1,height:1,background:'#ebebeb' }} />
                <span style={{ fontSize:12,color:'#bbb' }}>{lista.length}</span>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:10 }}>
                {lista.map(f => (
                  <Link key={f.id} href={`/farmacia/${norm(f.cidade)}/${slugFarmacia(f)}`}
                    style={{ background:'#fff',border:'1px solid #efefef',borderRadius:14,padding:'14px 16px',display:'flex',gap:12,alignItems:'flex-start',transition:'border-color .12s,box-shadow .12s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.boxShadow='0 2px 10px rgba(255,69,0,.1)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor='#efefef'; e.currentTarget.style.boxShadow='none' }}>
                    <div style={{ width:36,height:36,borderRadius:10,background:'#fff3ee',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }}>💊</div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ fontSize:14,fontWeight:600,color:'#111',marginBottom:3,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{f.nome}</div>
                      {f.logradouro && <div style={{ fontSize:12,color:'#aaa',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{f.logradouro}{f.numero ? `, ${f.numero}` : ''}</div>}
                      {f.telefone && <div style={{ fontSize:11,color:'#bbb',marginTop:2 }}>{f.telefone}</div>}
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{ flexShrink:0,marginTop:2 }}><path d="M9 18l6-6-6-6"/></svg>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {farmacias.length === 0 && (
          <div style={{ textAlign:'center',padding:'60px 0',color:'#aaa' }}>
            <div style={{ fontSize:32,marginBottom:12 }}>💊</div>
            <div style={{ fontSize:16 }}>Nenhuma farmácia encontrada em {cidade}</div>
          </div>
        )}

        <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'20px 24px',marginBottom:16 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:4 }}>
            Remédios mais buscados em {cidade}
          </h2>
          <p style={{ fontSize:13,color:'#aaa',marginBottom:16 }}>Compare preços online e veja farmácias próximas</p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(170px,1fr))',gap:8 }}>
            {[
              {nome:'Dipirona',slug:'dipirona'},
              {nome:'Amoxicilina',slug:'amoxicilina'},
              {nome:'Ibuprofeno',slug:'ibuprofeno'},
              {nome:'Paracetamol',slug:'paracetamol'},
              {nome:'Azitromicina',slug:'azitromicina'},
              {nome:'Omeprazol',slug:'omeprazol'},
              {nome:'Rivotril',slug:'rivotril'},
              {nome:'Levotiroxina',slug:'levotiroxina'},
              {nome:'Metformina',slug:'metformina-500mg'},
              {nome:'Losartana',slug:'losartana'},
              {nome:'Clonazepam',slug:'clonazepam'},
              {nome:'Sinvastatina',slug:'sinvastatina'},
              {nome:'Atorvastatina',slug:'atorvastatina'},
              {nome:'Fluoxetina',slug:'fluoxetina-20mg'},
              {nome:'Ciprofloxacino',slug:'ciprofloxacino'},
              {nome:'Prednisona',slug:'prednisona'},
              {nome:'Minoxidil',slug:'minoxidil'},
              {nome:'Vitamina D',slug:'vitamina-d-2000ui'},
              {nome:'Sildenafila',slug:'sildenafila-50mg'},
              {nome:'Pantoprazol',slug:'pantoprazol'},
            ].map(m => (
              <Link key={m.slug} href={`/remedio/${m.slug}/${cidadeSlug}`}
                style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 12px',background:'#f7f8fa',borderRadius:10,fontSize:13,color:'#333',border:'1px solid transparent',transition:'all .12s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.background='#fff3ee'; e.currentTarget.style.color=ACCENT }}
                onMouseOut={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='#f7f8fa'; e.currentTarget.style.color='#333' }}>
                {m.nome}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'24px',marginTop:16,marginBottom:16 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:16 }}>Outras cidades</h2>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
            {[
              {nome:'São Paulo',slug:'sao-paulo-sp'},{nome:'Rio de Janeiro',slug:'rio-de-janeiro-rj'},
              {nome:'Belo Horizonte',slug:'belo-horizonte-mg'},{nome:'Curitiba',slug:'curitiba-pr'},
              {nome:'Porto Alegre',slug:'porto-alegre-rs'},{nome:'Salvador',slug:'salvador-ba'},
              {nome:'Fortaleza',slug:'fortaleza-ce'},{nome:'Recife',slug:'recife-pe'},
              {nome:'Manaus',slug:'manaus-am'},{nome:'Goiânia',slug:'goiania-go'},
              {nome:'Campinas',slug:'campinas-sp'},{nome:'Natal',slug:'natal-rn'},
            ].filter(c => c.slug !== cidadeSlug).map(c => (
              <Link key={c.slug} href={`/cidade/${c.slug}`}
                style={{ fontSize:13,color:'#555',background:'#f7f8fa',border:'1px solid #e8e8e8',padding:'5px 12px',borderRadius:8 }}>
                {c.nome}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'24px',marginBottom:16 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:16 }}>Perguntas frequentes</h2>
          {[
            [`Quantas farmácias tem em ${cidade}?`,`${cidade} tem ${farmacias.length} farmácias cadastradas no FarmáciaAí, distribuídas em ${bairros.length} bairros.`],
            [`Onde comprar remédio mais barato em ${cidade}?`,`Use o FarmáciaAí para comparar preços de remédios em farmácias com entrega em ${cidade}, ${estado}. A diferença de preço pode chegar a 70% entre farmácias.`],
            [`Como encontrar uma farmácia de plantão em ${cidade}?`,`Consulte as farmácias listadas acima e ligue diretamente. O FarmáciaAí cadastra ${farmacias.length} farmácias em ${cidade}.`],
          ].map(([q,a],i) => (
            <div key={i} style={{ marginBottom:i<2?16:0,paddingBottom:i<2?16:0,borderBottom:i<2?'1px solid #f5f5f5':'none' }}>
              <div style={{ fontSize:14,fontWeight:600,color:'#111',marginBottom:4 }}>{q}</div>
              <div style={{ fontSize:13,color:'#555',lineHeight:1.7 }}>{a}</div>
            </div>
          ))}
        </div>

        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',border:'1px solid #ffd4be',borderRadius:20,padding:'28px 32px',marginTop:16 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:ACCENT,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8 }}>💊 Compare agora</div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:'#111',marginBottom:6 }}>Encontre o remédio mais barato em {cidade}</h2>
              <p style={{ fontSize:14,color:'#666' }}>Compare preços em farmácias online. Gratuito e em tempo real.</p>
            </div>
            <Link href="/" style={{ background:OG,color:'#fff',padding:'14px 28px',borderRadius:14,fontSize:15,fontWeight:700,whiteSpace:'nowrap',boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
              Comparar preços →
            </Link>
          </div>
        </div>
      </div>

      <footer style={{ background:'#111',color:'#555',padding:'24px 20px',textAlign:'center' }}>
        <div style={{ fontSize:12 }}>© {new Date().getFullYear()} FarmáciaAí · Não vendemos medicamentos.</div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  const supabase = getSupabase()
  const { data } = await supabase.rpc('cidades_agrupadas')
  if (!data) return { paths: [], fallback: 'blocking' }
  const paths = []
  for (const [estado, cidades] of Object.entries(data)) {
    for (const c of cidades) {
      paths.push({ params: { slug: `${norm(c.nome)}-${estado.toLowerCase()}` } })
    }
  }
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const supabase = getSupabase()
  const parts = params.slug.split('-')
  const estado = parts[parts.length - 1].toUpperCase()
  const cidadeNorm = parts.slice(0, -1).join(' ')

  const { data: farmacias, error } = await supabase.rpc('farmacias_por_cidade', {
    p_cidade: cidadeNorm,
    p_estado: estado,
  })

  if (error) console.error('farmacias_por_cidade error:', error)
  if (!farmacias || farmacias.length === 0) return { notFound: true }

  const cidade = farmacias[0].cidade
  const bairros = [...new Set(
    farmacias.map(f => f.bairro?.trim()).filter(b => b && b.length > 2 && !/^[0-9]+$/.test(b))
  )].sort()

  const farmaciasSafe = farmacias.map(f => ({
    id: f.id, nome: f.nome||'', bairro: f.bairro||'',
    logradouro: f.logradouro||'', numero: f.numero||'',
    telefone: f.telefone||'', cidade: f.cidade||'', estado: f.estado||'',
    latitude: f.latitude||null, longitude: f.longitude||null,
  }))

  return { props: { cidade, estado, farmacias: farmaciasSafe, bairros }, revalidate: 86400 }
}
