// pages/remedios.js — lista medicamentos com paginação server-side por letra
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { getSupabase } from '../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const LETRAS = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']

export default function Remedios({ medicamentos, total, letraAtual, countLetra }) {
  const router = useRouter()
  const [busca, setBusca] = useState('')

  const filtrados = busca.length >= 2
    ? medicamentos.filter(m => norm(m.nome).includes(norm(busca)))
    : medicamentos

  function irParaLetra(l) {
    setBusca('')
    if (l && l !== letraAtual) router.push(`/remedios?letra=${l}`)
    else router.push('/remedios')
  }

  return (
    <>
      <Head>
        <title>Remédios de A a Z — Compare preços em {total.toLocaleString('pt-BR')} medicamentos | FarmáciaAí</title>
        <meta name="description" content={`Compare preços de ${total.toLocaleString('pt-BR')} medicamentos em farmácias do Brasil.`} />
        <link rel="canonical" href="https://farmaciaai.com.br/remedios" />
        <meta property="og:title" content={`Remédios de A a Z — ${total.toLocaleString('pt-BR')} medicamentos | FarmáciaAí`} />
        <meta property="og:description" content={`Compare preços de ${total.toLocaleString('pt-BR')} medicamentos em farmácias do Brasil.`} />
        <meta property="og:url" content="https://farmaciaai.com.br/remedios" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#111;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}input:focus{outline:none}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height:38 }} /></Link>
          <div style={{ display:'flex',gap:20,alignItems:'center' }}>
            <Link href="/cidades" style={{ fontSize:14,color:'#555',fontWeight:500 }}>Cidades</Link>
            <Link href="/bulas" style={{ fontSize:14,color:'#555',fontWeight:500 }}>Bulas</Link>
            <Link href="/" style={{ background:OG,color:'#fff',padding:'8px 18px',borderRadius:10,fontSize:13,fontWeight:700 }}>Comparar preços →</Link>
          </div>
        </div>
      </nav>

      <div style={{ background:OG,padding:'36px 20px 44px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:10 }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Início</Link>
            <span style={{ margin:'0 6px' }}>›</span>
            <span style={{ color:'#fff' }}>Remédios</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(26px,4vw,42px)',color:'#fff',lineHeight:1.1,marginBottom:12 }}>
            Remédios de A a Z
          </h1>
          <div style={{ display:'flex',gap:8,maxWidth:480 }}>
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="Buscar medicamento..."
              style={{ flex:1,height:42,border:'none',borderRadius:10,padding:'0 16px',fontSize:15,fontFamily:'DM Sans,sans-serif',background:'rgba(255,255,255,.15)',color:'#fff' }}
              onFocus={e => e.target.style.background='rgba(255,255,255,.25)'}
              onBlur={e => e.target.style.background='rgba(255,255,255,.15)'} />
          </div>
          <div style={{ marginTop:10,fontSize:13,color:'rgba(255,255,255,.65)' }}>
            {total.toLocaleString('pt-BR')} medicamentos cadastrados
          </div>
        </div>
      </div>

      <div style={{ background:'#fff',borderBottom:'1px solid #efefef',padding:'10px 20px',position:'sticky',top:60,zIndex:50 }}>
        <div style={{ maxWidth:1100,margin:'0 auto',display:'flex',flexWrap:'wrap',gap:4 }}>
          <button onClick={() => irParaLetra('')}
            style={{ padding:'4px 10px',borderRadius:6,border:'1px solid',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif',
              borderColor:letraAtual===''?ACCENT:'#e0e0e0',
              background:letraAtual===''?'#fff3ee':'#fff',
              color:letraAtual===''?ACCENT:'#777' }}>
            Com preço
          </button>
          {LETRAS.map(l => (
            <button key={l} onClick={() => irParaLetra(l)}
              style={{ padding:'4px 9px',borderRadius:6,border:'1px solid',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'DM Sans,sans-serif',
                borderColor:letraAtual===l?ACCENT:'#e0e0e0',
                background:letraAtual===l?'#fff3ee':'#fff',
                color:letraAtual===l?ACCENT:'#555' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'28px 20px 72px' }}>
        {filtrados.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 0',color:'#aaa' }}>
            <div style={{ fontSize:32,marginBottom:12 }}>💊</div>
            <div style={{ fontSize:16 }}>Nenhum medicamento encontrado{busca.length>=2 ? ` para "${busca}"` : ''}</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:13,color:'#aaa',marginBottom:16 }}>
              {filtrados.length.toLocaleString('pt-BR')} medicamento{filtrados.length!==1?'s':''}
              {letraAtual && ` com a letra ${letraAtual}`}
              {!letraAtual && ' com preço disponível'}
              {busca.length>=2 && ` para "${busca}"`}
              {countLetra > medicamentos.length && !busca && (
                <span> · <span style={{ color:'#bbb' }}>mostrando {medicamentos.length.toLocaleString('pt-BR')} de {countLetra.toLocaleString('pt-BR')}</span></span>
              )}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))',gap:8 }}>
              {filtrados.map(m => (
                <Link key={m.slug} href={m.tem_preco ? `/remedio/${m.slug}` : `/bula/${m.slug}`}
                  style={{ background:'#fff',border:'1px solid #efefef',borderRadius:12,padding:'13px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border-color .12s,box-shadow .12s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.boxShadow='0 2px 10px rgba(255,69,0,.1)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='#efefef'; e.currentTarget.style.boxShadow='none' }}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:500,color:'#111' }}>{m.nome}</div>
                    {m.principio_ativo && <div style={{ fontSize:11,color:'#bbb',marginTop:2 }}>{m.principio_ativo}</div>}
                    <div style={{ display:'flex',gap:6,marginTop:6 }}>
                      {m.tem_preco && <span style={{ fontSize:10,fontWeight:700,color:ACCENT,background:'#fff3ee',padding:'2px 7px',borderRadius:100 }}>preço</span>}
                      {m.tem_bula && <span style={{ fontSize:10,fontWeight:700,color:'#059669',background:'#f0fff8',padding:'2px 7px',borderRadius:100 }}>bula</span>}
                    </div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <footer style={{ background:'#111',color:'#555',padding:'24px 20px',textAlign:'center' }}>
        <div style={{ fontSize:12 }}>© {new Date().getFullYear()} FarmáciaAí · Não vendemos medicamentos.</div>
      </footer>
    </>
  )
}

export async function getServerSideProps({ query, res }) {
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')

  const letra = (query.letra || '').toUpperCase().replace(/[^A-Z]/, '').slice(0, 1)
  const supabase = getSupabase()

  const [{ count: total }, resultado] = await Promise.all([
    supabase.from('medicamentos').select('id', { count: 'exact', head: true }),
    (() => {
      let q = supabase
        .from('medicamentos')
        .select('nome, principio_ativo, slug, tem_preco, tem_bula')
        .order('nome')
      if (letra) q = q.ilike('nome', `${letra}%`)
      else q = q.eq('tem_preco', true)
      return q.limit(500)
    })(),
  ])

  const { count: countLetra } = letra
    ? await supabase.from('medicamentos').select('id', { count: 'exact', head: true }).ilike('nome', `${letra}%`)
    : { count: resultado.data?.length || 0 }

  const medicamentos = (resultado.data || []).map(m => ({
    nome: m.nome || '',
    principio_ativo: m.principio_ativo || '',
    slug: m.slug || norm(m.nome),
    tem_preco: !!m.tem_preco,
    tem_bula: !!m.tem_bula,
  }))

  return {
    props: {
      medicamentos,
      total: total || 0,
      letraAtual: letra,
      countLetra: countLetra || medicamentos.length,
    },
  }
}
