// pages/cidades.js
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function Cidades({ porEstado, total }) {
  const estados = Object.keys(porEstado).sort()

  return (
    <>
      <Head>
        <title>Farmácias por cidade no Brasil — FarmáciaAí</title>
        <meta name="description" content={`Encontre farmácias e compare preços de remédios em ${total.toLocaleString('pt-BR')} farmácias em todo o Brasil.`} />
        <link rel="canonical" href="https://farmaciaai.com.br/cidades" />
        <meta property="og:title" content="Farmácias por cidade no Brasil | FarmáciaAí" />
        <meta property="og:description" content={`Encontre farmácias e compare preços de remédios em ${total.toLocaleString('pt-BR')} farmácias em todo o Brasil.`} />
        <meta property="og:url" content="https://farmaciaai.com.br/cidades" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:DM Sans,sans-serif;color:#111;background:#f7f8fa;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
      `}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height:38 }} /></Link>
          <div style={{ display:'flex',gap:20,alignItems:'center' }}>
            <Link href="/remedios" style={{ fontSize:14,color:'#555',fontWeight:500 }}>Remédios</Link>
            <Link href="/bulas" style={{ fontSize:14,color:'#555',fontWeight:500 }}>Bulas</Link>
            <Link href="/" style={{ background:OG,color:'#fff',padding:'8px 18px',borderRadius:10,fontSize:13,fontWeight:700 }}>Comparar preços →</Link>
          </div>
        </div>
      </nav>

      <div style={{ background:OG,padding:'40px 20px 48px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:10 }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Início</Link>
            <span style={{ margin:'0 6px' }}>›</span>
            <span style={{ color:'#fff' }}>Cidades</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(26px,4vw,42px)',color:'#fff',lineHeight:1.1,marginBottom:10 }}>
            Farmácias por cidade
          </h1>
          <p style={{ fontSize:15,color:'rgba(255,255,255,.75)' }}>
            {total.toLocaleString('pt-BR')} farmácias cadastradas em todo o Brasil
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'40px 20px 72px' }}>
        {estados.map(estado => {
          const cidades = porEstado[estado]
          return (
            <div key={estado} style={{ marginBottom:36 }}>
              <div style={{ display:'flex',alignItems:'center',gap:12,marginBottom:14 }}>
                <h2 style={{ fontSize:13,fontWeight:700,color:'#888',textTransform:'uppercase',letterSpacing:'.08em' }}>{estado}</h2>
                <div style={{ flex:1,height:1,background:'#ebebeb' }} />
                <span style={{ fontSize:12,color:'#bbb' }}>{cidades.length} {cidades.length===1?'cidade':'cidades'}</span>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:8 }}>
                {cidades.map(c => (
                  <Link key={c.slug} href={`/cidade/${c.slug}`}
                    style={{ background:'#fff',border:'1px solid #efefef',borderRadius:12,padding:'13px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border-color .12s,box-shadow .12s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.boxShadow='0 2px 10px rgba(255,69,0,.1)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor='#efefef'; e.currentTarget.style.boxShadow='none' }}>
                    <div>
                      <div style={{ fontSize:14,fontWeight:500,color:'#111' }}>{c.nome}</div>
                      <div style={{ fontSize:11,color:'#bbb',marginTop:2 }}>{c.total.toLocaleString('pt-BR')} farmácias</div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <footer style={{ background:'#111',color:'#555',padding:'24px 20px',textAlign:'center' }}>
        <div style={{ fontSize:12 }}>© {new Date().getFullYear()} FarmáciaAí · Não vendemos medicamentos.</div>
      </footer>
    </>
  )
}

export async function getStaticProps() {
  const supabase = getSupabase()

  const { data, error } = await supabase.rpc('cidades_agrupadas')
  if (error || !data) {
    console.error('cidades_agrupadas error:', error)
    return { props: { porEstado: {}, total: 0 }, revalidate: 3600 }
  }

  // data é o JSON direto: { AC: [{nome, total}, ...], SP: [...], ... }
  const porEstado = {}
  let total = 0
  for (const [estado, cidades] of Object.entries(data)) {
    porEstado[estado] = cidades.map(c => ({
      nome: c.nome,
      slug: `${norm(c.nome)}-${estado.toLowerCase()}`,
      total: Number(c.total),
    }))
    total += cidades.reduce((s, c) => s + Number(c.total), 0)
  }

  return {
    props: { porEstado, total },
    revalidate: 86400,
  }
}
