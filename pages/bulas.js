// pages/bulas.js — busca bulas do Supabase
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
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

export default function BulasPage({ bulas, total }) {
  const [busca, setBusca] = useState('')

  const filtradas = busca.length < 2
    ? bulas
    : bulas.filter(b => norm(b.nome_medicamento).includes(norm(busca)) || norm(b.nome_limpo||'').includes(norm(busca)))

  return (
    <>
      <Head>
        <title>Bulas de remédios — {total.toLocaleString('pt-BR')} medicamentos | FarmáciaAí</title>
        <meta name="description" content={`Consulte bulas de ${total.toLocaleString('pt-BR')} medicamentos. Indicações, contraindicações, posologia e compare preços nas farmácias.`} />
        <link rel="canonical" href="https://farmaciaai.com.br/bulas" />
        <meta property="og:title" content={`Bulas de remédios — ${total.toLocaleString('pt-BR')} medicamentos | FarmáciaAí`} />
        <meta property="og:description" content={`Consulte bulas de ${total.toLocaleString('pt-BR')} medicamentos. Indicações, contraindicações, posologia e compare preços nas farmácias.`} />
        <meta property="og:url" content="https://farmaciaai.com.br/bulas" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:DM Sans,sans-serif;color:#111;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}input:focus{outline:none}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:38 }} /></Link>
          <div style={{ display:'flex',gap:20,alignItems:'center' }}>
            <Link href="/remedios" style={{ fontSize:14,color:'#555',fontWeight:500 }}>Remédios</Link>
            <Link href="/cidades" style={{ fontSize:14,color:'#555',fontWeight:500 }}>Cidades</Link>
            <Link href="/" style={{ background:OG,color:'#fff',padding:'8px 18px',borderRadius:10,fontSize:13,fontWeight:700 }}>Comparar preços →</Link>
          </div>
        </div>
      </nav>

      <div style={{ background:OG,padding:'36px 20px 44px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:10 }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Início</Link>
            <span style={{ margin:'0 6px' }}>›</span>
            <span style={{ color:'#fff' }}>Bulas</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(26px,4vw,42px)',color:'#fff',lineHeight:1.1,marginBottom:12 }}>
            Bulas de remédios
          </h1>
          <div style={{ display:'flex',gap:8,maxWidth:480 }}>
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)}
              placeholder="Buscar bula..."
              style={{ flex:1,height:42,border:'none',borderRadius:10,padding:'0 16px',fontSize:15,fontFamily:'DM Sans,sans-serif',background:'rgba(255,255,255,.15)',color:'#fff' }}
              onFocus={e => e.target.style.background='rgba(255,255,255,.25)'}
              onBlur={e => e.target.style.background='rgba(255,255,255,.15)'} />
          </div>
          <div style={{ marginTop:10,fontSize:13,color:'rgba(255,255,255,.65)' }}>
            {total.toLocaleString('pt-BR')} bulas cadastradas
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'28px 20px 72px' }}>
        {filtradas.length === 0 ? (
          <div style={{ textAlign:'center',padding:'60px 0',color:'#aaa' }}>
            <div style={{ fontSize:32,marginBottom:12 }}>📄</div>
            <div style={{ fontSize:16 }}>Nenhuma bula encontrada para "{busca}"</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:13,color:'#aaa',marginBottom:16 }}>
              {filtradas.length.toLocaleString('pt-BR')} bula{filtradas.length!==1?'s':''}
              {busca.length>=2 && ` para "${busca}"`}
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:8 }}>
              {filtradas.map(b => (
                <Link key={b.id} href={`/bula/${b.slug}`}
                  style={{ background:'#fff',border:'1px solid #efefef',borderRadius:12,padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border-color .12s,box-shadow .12s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.boxShadow='0 2px 10px rgba(255,69,0,.1)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='#efefef'; e.currentTarget.style.boxShadow='none' }}>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontSize:14,fontWeight:500,color:'#111',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>
                      {b.nome_limpo || b.nome_medicamento}
                    </div>
                    {b.empresa && <div style={{ fontSize:11,color:'#bbb',marginTop:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{b.empresa}</div>}
                    {b.html_conteudo && <span style={{ fontSize:10,fontWeight:700,color:'#059669',background:'#f0fff8',padding:'2px 7px',borderRadius:100,marginTop:4,display:'inline-block' }}>bula disponível</span>}
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{ flexShrink:0,marginLeft:8 }}><path d="M9 18l6-6-6-6"/></svg>
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

export async function getStaticProps() {
  const supabase = getSupabase()
  let all = []
  let from = 0
  while (true) {
    const { data, error } = await supabase
      .from('bulas')
      .select('id, nome_medicamento, nome_limpo, empresa, slug, html_conteudo')
      .order('nome_medicamento')
      .range(from, from + 999)
    if (error || !data || data.length === 0) break
    all = all.concat(data)
    if (data.length < 1000) break
    from += 1000
  }
  const bulas = all.map(b => ({
    id: b.id,
    nome_medicamento: b.nome_medicamento||'',
    nome_limpo: b.nome_limpo||'',
    empresa: b.empresa||'',
    slug: b.slug||'',
    html_conteudo: !!b.html_conteudo,
  }))
  return { props: { bulas, total: bulas.length }, revalidate: 86400 }
}
