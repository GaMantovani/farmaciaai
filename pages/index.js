// pages/index.js — FarmáciaAí v7 — UX refinado
import { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CIDADES, REMEDIOS } from '../lib/data'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

const CATEGORIAS = [
  { id:'gripe', label:'Gripe', emoji:'🤧', query:'amoxicilina' },
  { id:'dor', label:'Dor e Febre', emoji:'🤒', query:'dipirona' },
  { id:'estomago', label:'Estômago', emoji:'🫃', query:'omeprazol' },
  { id:'pressao', label:'Pressão Alta', emoji:'❤️', query:'losartana' },
  { id:'diabetes', label:'Diabetes', emoji:'💉', query:'metformina' },
  { id:'colesterol', label:'Colesterol', emoji:'🩸', query:'atorvastatina' },
  { id:'alergia', label:'Alergia', emoji:'🌿', query:'cetirizina' },
  { id:'antibiotico', label:'Antibiótico', emoji:'💊', query:'azitromicina' },
  { id:'tireoide', label:'Tireoide', emoji:'🦋', query:'levotiroxina' },
  { id:'ansiedade', label:'Ansiedade', emoji:'🧠', query:'clonazepam' },
  { id:'inflamacao', label:'Inflamação', emoji:'🔥', query:'ibuprofeno' },
  { id:'vitaminas', label:'Vitaminas', emoji:'⭐', query:'vitamina c' },
]

function MedImg({ src, alt, size = 48 }) {
  const [err, setErr] = useState(false)
  if (!src || err) return (
    <div style={{ width:size, height:size, display:'flex', alignItems:'center', justifyContent:'center', fontSize:size*0.5 }}>💊</div>
  )
  return <img src={src} alt={alt} width={size} height={size} style={{ objectFit:'contain', borderRadius:6 }} onError={() => setErr(true)} />
}

function ResultTable({ resultados, remedio, query }) {
  const [mostrarTodos, setMostrarTodos] = useState(false)
  if (!resultados.length) return (
    <div style={{ textAlign:'center', padding:'56px 20px' }}>
      <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
      <p style={{ fontSize:16, fontWeight:600, color:'#222', marginBottom:6 }}>Nenhum resultado para "{query}"</p>
      <p style={{ fontSize:14, color:'#888' }}>Tente o princípio ativo — ex: "dipirona" em vez de "Neosaldina"</p>
    </div>
  )

  const melhor = resultados[0]
  const visiveis = mostrarTodos ? resultados : resultados.slice(0, 8)
  const economia = resultados.length > 1 ? ((resultados[resultados.length-1].preco - melhor.preco) / resultados[resultados.length-1].preco * 100).toFixed(0) : 0

  return (
    <div>
      {/* WINNER CARD */}
      <div style={{ background:'#fff', borderRadius:20, overflow:'hidden', boxShadow:'0 4px 24px rgba(255,69,0,.12)', border:'2px solid #ff5a00', marginBottom:16 }}>
        <div style={{ background:OG, padding:'8px 20px', display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ fontSize:12, fontWeight:700, color:'#fff', letterSpacing:'.06em' }}>🏆 MENOR PREÇO ENCONTRADO</span>
          {economia > 0 && <span style={{ fontSize:11, background:'rgba(255,255,255,.2)', color:'#fff', padding:'2px 8px', borderRadius:100 }}>Economize até {economia}%</span>}
        </div>
        <div style={{ padding:'16px 20px', display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
          <div style={{ width:64, height:64, background:'#f8f9fb', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, border:'1px solid #f0f0f0', overflow:'hidden' }}>
            <MedImg src={melhor.imagem} alt={melhor.medicamento} size={56} />
          </div>
          <div style={{ flex:1, minWidth:120 }}>
            <div style={{ fontSize:18, fontWeight:700, color:'#111', marginBottom:2 }}>{melhor.farmacia}</div>
            <div style={{ fontSize:13, color:'#888' }}>{melhor.medicamento}</div>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <div>
              <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:40, color:ACCENT, lineHeight:1, fontWeight:400 }}>
                <span style={{ fontSize:18, verticalAlign:'super', fontFamily:"'DM Sans',sans-serif", fontWeight:600 }}>R$</span>{melhor.preco.toFixed(2).replace('.',',')}
              </div>
            </div>
            <a href={melhor.url} target="_blank" rel="noopener noreferrer"
              style={{ background:OG, color:'#fff', padding:'14px 28px', borderRadius:14, fontSize:15, fontWeight:700, textDecoration:'none', boxShadow:'0 4px 16px rgba(255,69,0,.3)', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:6 }}>
              Comprar agora →
            </a>
          </div>
        </div>
      </div>

      {/* LISTA COMPARATIVA */}
      <div style={{ background:'#fff', borderRadius:16, overflow:'hidden', border:'1px solid #f0f0f0', boxShadow:'0 2px 12px rgba(0,0,0,.04)' }}>
        <div style={{ padding:'14px 20px', borderBottom:'1px solid #f5f5f5', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ fontSize:14, fontWeight:600, color:'#111' }}>Todas as {resultados.length} ofertas</div>
          <div style={{ fontSize:12, color:'#aaa' }}>do menor para o maior</div>
        </div>
        {visiveis.map((r, i) => (
          <div key={i}
            style={{ display:'flex', alignItems:'center', padding:'12px 20px', gap:14, borderBottom: i < visiveis.length-1 ? '1px solid #f9f9f9' : 'none', background: i===0 ? '#fffaf8' : '#fff', transition:'background .15s', cursor:'pointer' }}
            onMouseOver={e => e.currentTarget.style.background='#fffaf8'}
            onMouseOut={e => e.currentTarget.style.background= i===0 ? '#fffaf8' : '#fff'}>

            {/* RANK */}
            <div style={{ width:24, height:24, borderRadius:100, background: i===0 ? OG : '#f0f0f0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700, color: i===0 ? '#fff' : '#aaa', flexShrink:0 }}>
              {i+1}
            </div>

            {/* IMAGEM */}
            <div style={{ width:44, height:44, borderRadius:10, background:'#f8f9fb', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, overflow:'hidden', border:'1px solid #f0f0f0' }}>
              <MedImg src={r.imagem} alt={r.medicamento} size={40} />
            </div>

            {/* INFO */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:14, fontWeight:600, color:'#111', display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ width:7, height:7, borderRadius:'50%', background: r.logo_cor || ACCENT, flexShrink:0, display:'inline-block' }} />
                {r.farmacia}
              </div>
              <div style={{ fontSize:12, color:'#aaa', marginTop:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{r.medicamento}</div>
            </div>

            {/* DIFERENÇA DE PREÇO */}
            {i > 0 && (
              <div style={{ fontSize:11, color:'#dc2626', background:'#fef2f2', padding:'2px 7px', borderRadius:100, whiteSpace:'nowrap', flexShrink:0 }}>
                +R$ {(r.preco - melhor.preco).toFixed(2).replace('.',',')}
              </div>
            )}

            {/* PREÇO */}
            <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color: i===0 ? ACCENT : '#222', whiteSpace:'nowrap', textAlign:'right', flexShrink:0 }}>
              R$ {r.preco.toFixed(2).replace('.',',')}
            </div>

            {/* CTA */}
            <a href={r.url} target="_blank" rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{ fontSize:13, fontWeight:600, color: i===0 ? '#fff' : ACCENT, background: i===0 ? OG : 'transparent', border: i===0 ? 'none' : `1.5px solid #ffb89a`, padding:'8px 16px', borderRadius:10, textDecoration:'none', whiteSpace:'nowrap', flexShrink:0, transition:'all .15s' }}
              onMouseOver={e => { if(i!==0) e.currentTarget.style.background='#fff3ee' }}
              onMouseOut={e => { if(i!==0) e.currentTarget.style.background='transparent' }}>
              {i===0 ? 'Comprar' : 'Ver oferta'}
            </a>
          </div>
        ))}
        {!mostrarTodos && resultados.length > 8 && (
          <div style={{ padding:'14px 20px', textAlign:'center', borderTop:'1px solid #f5f5f5' }}>
            <button onClick={() => setMostrarTodos(true)}
              style={{ fontSize:13, color:ACCENT, fontWeight:600, background:'none', border:'none', cursor:'pointer', fontFamily:'inherit' }}>
              Ver mais {resultados.length - 8} ofertas ↓
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function FarmaciaCard({ f }) {
  return (
    <div style={{ background:'#fff', border:'1px solid #f0f0f0', borderRadius:12, padding:'14px 16px', display:'flex', gap:12, alignItems:'flex-start', transition:'all .15s' }}
      onMouseOver={e => { e.currentTarget.style.borderColor='#ffb89a'; e.currentTarget.style.boxShadow='0 3px 12px rgba(255,90,0,.08)' }}
      onMouseOut={e => { e.currentTarget.style.borderColor='#f0f0f0'; e.currentTarget.style.boxShadow='none' }}>
      <div style={{ width:36, height:36, background:'#fff3ee', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:18 }}>💊</div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700, color:'#222', marginBottom:2, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.nome}</div>
        <div style={{ fontSize:12, color:'#888', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.endereco}</div>
        <div style={{ display:'flex', gap:6, marginTop:6 }}>
          {f.aberto !== undefined && <span style={{ fontSize:11, fontWeight:600, color: f.aberto ? '#16a34a' : '#dc2626', background: f.aberto ? '#f0fdf4' : '#fef2f2', padding:'2px 7px', borderRadius:100 }}>{f.aberto ? '● Aberta' : '● Fechada'}</span>}
          {f.avaliacao && <span style={{ fontSize:11, color:'#f59e0b', fontWeight:600 }}>★ {f.avaliacao}</span>}
        </div>
      </div>
      <a href={`https://www.google.com/maps/place/?q=place_id:${f.place_id}`} target="_blank" rel="noopener noreferrer"
        style={{ fontSize:11, color:ACCENT, fontWeight:600, border:'1px solid #ffb89a', padding:'4px 8px', borderRadius:6, textDecoration:'none', whiteSpace:'nowrap', flexShrink:0 }}>Mapa</a>
    </div>
  )
}

export default function Home() {
  const [remedio, setRemedio] = useState('')
  const [cep, setCep] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [query, setQuery] = useState('')
  const [localizacao, setLocalizacao] = useState(null)
  const [erro, setErro] = useState(null)
  const [sugestoes, setSugestoes] = useState([])
  const [farmaciasProximas, setFarmaciasProximas] = useState(null)
  const [loadingFarmacias, setLoadingFarmacias] = useState(false)
  const [mostrarFarmacias, setMostrarFarmacias] = useState(false)
  const inputRef = useRef(null)

  function maskCEP(v) {
    const n = v.replace(/\D/g,'').slice(0,8)
    return n.length > 5 ? n.slice(0,5)+'-'+n.slice(5) : n
  }

  async function buscarFarmaciasProximas(cepVal) {
    const limpo = cepVal.replace(/\D/g,'')
    if (limpo.length !== 8) return
    setLoadingFarmacias(true)
    try {
      const res = await fetch('/api/farmacias-proximas?cep='+limpo)
      const data = await res.json()
      if (data.farmacias?.length) { setFarmaciasProximas(data); setMostrarFarmacias(true) }
    } catch(e) {} finally { setLoadingFarmacias(false) }
  }

  function handleCEPChange(v) {
    const masked = maskCEP(v)
    setCep(masked)
    if (masked.replace(/\D/g,'').length === 8) buscarFarmaciasProximas(masked)
  }

  function handleRemedioChange(v) {
    setRemedio(v)
    if (v.length > 1) setSugestoes(REMEDIOS.filter(r => r.nome.toLowerCase().includes(v.toLowerCase()) || r.principio.toLowerCase().includes(v.toLowerCase())).slice(0, 6))
    else setSugestoes([])
  }

  async function buscar(remedioOverride) {
    const q = remedioOverride || remedio
    if (!q.trim()) { setErro('Digite o nome do remédio'); return }
    setLoading(true); setErro(null); setResultados(null); setSugestoes([])
    setRemedio(q); setQuery(q)
    if (cep.replace(/\D/g,'').length === 8 && !farmaciasProximas) buscarFarmaciasProximas(cep)
    try {
      const params = new URLSearchParams({ q: q.trim() })
      if (cep.replace(/\D/g,'').length === 8) params.append('cep', cep)
      const res = await fetch('/api/buscar?'+params)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultados(data.resultados || [])
      setLocalizacao(data.localizacao)
    } catch(e) { setErro(e.message || 'Erro ao buscar.') }
    finally { setLoading(false) }
  }

  const temResultados = loading || resultados !== null

  return (
    <>
      <Head>
        <title>FarmáciaAí — Compare preços de remédios em 150+ farmácias</title>
        <meta name="description" content="Compare preços de remédios em mais de 150 farmácias online. Encontre o menor preço em segundos. Grátis." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;color:#111;background:#f7f8fa;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        input,button{font-family:'DM Sans',sans-serif}
        input:focus{outline:none}
        ::-webkit-scrollbar{display:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
        .fade{animation:fadeUp .35s ease both}
        .skel{background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200% 100%;animation:shimmer 1.4s infinite}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        .row-hover:hover{background:#fffaf8 !important}
      `}</style>

      {/* BARRA CATEGORIAS */}
      <div style={{ background:'#fff', borderBottom:'1px solid #f0f0f0', overflowX:'auto' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', display:'flex', gap:2, height:42, alignItems:'center', whiteSpace:'nowrap' }}>
          {CATEGORIAS.map(c => (
            <button key={c.id} onClick={() => buscar(c.query)}
              style={{ fontSize:12, color:'#666', background:'none', border:'none', padding:'5px 11px', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap', transition:'all .12s', display:'flex', alignItems:'center', gap:5 }}
              onMouseOver={e => { e.currentTarget.style.background='#fff3ee'; e.currentTarget.style.color=ACCENT }}
              onMouseOut={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color='#666' }}>
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* NAV */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(255,255,255,.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid #f0f0f0', boxShadow:'0 1px 0 #f0f0f0' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', height:60, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <Link href="/" onClick={() => { setResultados(null); setFarmaciasProximas(null) }}>
            <img src="/logo.png" alt="FarmáciaAí" style={{ height:38, width:'auto' }} />
          </Link>
          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <Link href="/cidades" style={{ fontSize:14, color:'#555', padding:'6px 12px', borderRadius:8 }}>Cidades</Link>
            <Link href="/remedios" style={{ fontSize:14, color:'#555', padding:'6px 12px', borderRadius:8 }}>Remédios</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background:'linear-gradient(180deg,#fff 0%,#f7f8fa 100%)', padding: temResultados ? '28px 20px 24px' : '60px 20px 52px', transition:'padding .3s ease' }}>
        <div style={{ maxWidth: temResultados ? 900 : 640, margin:'0 auto', transition:'max-width .3s ease' }}>
          {!temResultados && (
            <>
              <div className="fade" style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#fff3ee', border:'1px solid #ffd4be', color:'#cc3d00', fontSize:12, fontWeight:600, padding:'4px 12px', borderRadius:100, marginBottom:18 }}>
                <span style={{ width:6, height:6, background:ACCENT, borderRadius:'50%', display:'inline-block' }} />
                150+ farmácias · Preços atualizados
              </div>
              <h1 className="fade" style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(28px,5.5vw,52px)', lineHeight:1.08, color:'#111', marginBottom:12, animationDelay:'.05s' }}>
                Qual remédio você<br/>precisa comprar <em style={{ color:ACCENT }}>hoje?</em>
              </h1>
              <p className="fade" style={{ fontSize:17, color:'#666', fontWeight:300, lineHeight:1.65, marginBottom:28, animationDelay:'.1s' }}>
                Compare preços em 150+ farmácias e economize até 60%.
              </p>
            </>
          )}

          {/* SEARCH BOX */}
          <div className="fade" style={{ background:'#fff', borderRadius:18, padding:temResultados ? '14px 16px' : '20px', boxShadow: temResultados ? '0 2px 16px rgba(0,0,0,.06)' : '0 8px 40px rgba(0,0,0,.08)', border:'1px solid #f0f0f0', transition:'all .3s ease', animationDelay:'.15s' }}>
            <div style={{ position:'relative', marginBottom:10 }}>
              <svg style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:ACCENT, pointerEvents:'none', zIndex:1 }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input ref={inputRef} type="text" value={remedio} onChange={e => handleRemedioChange(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && buscar()}
                placeholder={temResultados ? `Buscar outro remédio...` : "Nome do remédio — ex: Dipirona, Omeprazol..."}
                style={{ width:'100%', height:52, border:'2px solid', borderColor: remedio ? ACCENT : '#ede8e8', borderRadius:12, paddingLeft:44, paddingRight:14, fontSize:15, color:'#111', background:'#fafafa', transition:'border-color .2s, background .2s' }}
                onFocus={e => { e.target.style.borderColor=ACCENT; e.target.style.background='#fff' }}
                onBlur={e => { setTimeout(()=>setSugestoes([]),180); e.target.style.borderColor=remedio?ACCENT:'#ede8e8'; e.target.style.background='#fafafa' }} />

              {/* AUTOCOMPLETE */}
              {sugestoes.length > 0 && (
                <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'#fff', border:'1px solid #f0f0f0', borderRadius:14, boxShadow:'0 8px 32px rgba(0,0,0,.1)', zIndex:50, overflow:'hidden' }}>
                  {sugestoes.map(s => (
                    <div key={s.slug} onMouseDown={() => { setRemedio(s.nome); setSugestoes([]); setTimeout(() => buscar(s.nome), 80) }}
                      style={{ padding:'11px 16px', fontSize:14, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom:'1px solid #f8f8f8' }}
                      onMouseOver={e => e.currentTarget.style.background='#fff8f5'}
                      onMouseOut={e => e.currentTarget.style.background='#fff'}>
                      <span style={{ fontWeight:500 }}>💊 {s.nome}</span>
                      <span style={{ fontSize:12, color:'#aaa', background:'#f5f5f5', padding:'2px 8px', borderRadius:100 }}>{s.categoria}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display:'flex', gap:10 }}>
              <div style={{ position:'relative', width:170, flexShrink:0 }}>
                <svg style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'#bbb', pointerEvents:'none' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                <input type="text" value={cep} maxLength={9} onChange={e => handleCEPChange(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && buscar()}
                  placeholder="CEP (opcional)"
                  style={{ width:'100%', height:44, border:'1.5px solid #eee', borderRadius:10, paddingLeft:32, paddingRight:10, fontSize:14, color:'#111', background:'#fafafa', transition:'border-color .2s' }}
                  onFocus={e => { e.target.style.borderColor=ACCENT; e.target.style.background='#fff' }}
                  onBlur={e => { e.target.style.borderColor='#eee'; e.target.style.background='#fafafa' }} />
              </div>
              <button onClick={() => buscar()} disabled={loading}
                style={{ flex:1, height:44, background: loading ? '#ffc4a8' : OG, color:'#fff', border:'none', borderRadius:10, fontSize:15, fontWeight:700, cursor: loading ? 'default' : 'pointer', boxShadow: loading ? 'none' : '0 4px 16px rgba(255,69,0,.28)', transition:'all .2s', display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}>
                {loading ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin .8s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                    Buscando...
                  </>
                ) : 'Comparar preços →'}
              </button>
            </div>

            {/* TAGS */}
            {!temResultados && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:12, alignItems:'center' }}>
                <span style={{ fontSize:12, color:'#bbb' }}>Populares:</span>
                {['Dipirona','Omeprazol','Amoxicilina','Losartana','Ibuprofeno'].map(r => (
                  <button key={r} onMouseDown={() => buscar(r)}
                    style={{ fontSize:12, color:ACCENT, background:'#fff3ee', border:'1px solid #ffd4be', padding:'3px 10px', borderRadius:100, cursor:'pointer', transition:'background .12s' }}
                    onMouseOver={e => e.target.style.background='#ffe8db'}
                    onMouseOut={e => e.target.style.background='#fff3ee'}>
                    {r}
                  </button>
                ))}
              </div>
            )}
            {erro && <p style={{ marginTop:10, fontSize:13, color:'#e53e3e', display:'flex', alignItems:'center', gap:6 }}>⚠️ {erro}</p>}
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      {temResultados && (
        <section style={{ maxWidth:900, margin:'0 auto', padding:'0 20px 48px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16, paddingTop:4 }}>
            {loading ? (
              <div style={{ display:'flex', alignItems:'center', gap:8, color:'#888', fontSize:14 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin .8s linear infinite' }}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                Comparando preços...
              </div>
            ) : (
              <div style={{ fontSize:14, color:'#888' }}>
                <span style={{ fontWeight:700, color:'#111' }}>{resultados.length} ofertas</span> para "{query}"
                {localizacao && <span style={{ marginLeft:8 }}>· 📍 {localizacao.cidade}, {localizacao.estado}</span>}
              </div>
            )}
            <button onClick={() => { setResultados(null); setFarmaciasProximas(null); setMostrarFarmacias(false); setRemedio(''); setTimeout(() => inputRef.current?.focus(), 100) }}
              style={{ fontSize:13, color:'#aaa', background:'none', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4 }}>
              ✕ Limpar
            </button>
          </div>

          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {[80,70,65,60].map((w,i) => (
                <div key={i} className="skel" style={{ height:68, borderRadius:14 }} />
              ))}
            </div>
          ) : (
            <ResultTable resultados={resultados} remedio={remedio} query={query} />
          )}

          {/* FARMÁCIAS FÍSICAS */}
          {(loadingFarmacias || (farmaciasProximas && mostrarFarmacias)) && (
            <div style={{ marginTop:36 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:ACCENT, textTransform:'uppercase', letterSpacing:'.08em', marginBottom:4 }}>Farmácias físicas próximas</div>
                  <h3 style={{ fontSize:15, fontWeight:600, color:'#111' }}>
                    {loadingFarmacias ? 'Localizando...' : `${farmaciasProximas?.farmacias?.length} farmácias em ${farmaciasProximas?.cidade}`}
                  </h3>
                </div>
                <button onClick={() => setMostrarFarmacias(false)} style={{ fontSize:12, color:'#bbb', background:'none', border:'none', cursor:'pointer' }}>Ocultar</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10 }}>
                {loadingFarmacias
                  ? [1,2,3].map(i => <div key={i} className="skel" style={{ height:76, borderRadius:12 }} />)
                  : farmaciasProximas?.farmacias?.map((f,i) => <FarmaciaCard key={i} f={f} />)}
              </div>
            </div>
          )}
          {!loadingFarmacias && farmaciasProximas && !mostrarFarmacias && (
            <button onClick={() => setMostrarFarmacias(true)}
              style={{ marginTop:20, width:'100%', padding:'12px', background:'#fff', border:'1.5px dashed #ffb89a', borderRadius:12, fontSize:14, color:ACCENT, fontWeight:500, cursor:'pointer' }}>
              📍 Ver {farmaciasProximas.farmacias.length} farmácias físicas próximas
            </button>
          )}
        </section>
      )}

      {/* HOME — sem busca */}
      {!temResultados && (
        <>
          {/* CATEGORIAS GRID */}
          <section style={{ maxWidth:1200, margin:'0 auto', padding:'36px 20px 0' }}>
            <div style={{ fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:14 }}>Buscar por categoria</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(120px,1fr))', gap:10 }}>
              {CATEGORIAS.map(c => (
                <button key={c.id} onClick={() => buscar(c.query)}
                  style={{ background:'#fff', border:'1.5px solid #f0f0f0', borderRadius:14, padding:'16px 10px 14px', display:'flex', flexDirection:'column', alignItems:'center', gap:8, cursor:'pointer', transition:'all .15s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor='#ffb89a'; e.currentTarget.style.boxShadow='0 4px 16px rgba(255,90,0,.1)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='#f0f0f0'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}>
                  <div style={{ fontSize:30 }}>{c.emoji}</div>
                  <div style={{ fontSize:12, fontWeight:600, color:'#333', textAlign:'center', lineHeight:1.3 }}>{c.label}</div>
                </button>
              ))}
            </div>
          </section>

          {/* STATS */}
          <section style={{ maxWidth:1200, margin:'0 auto', padding:'28px 20px 0' }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10 }}>
              {[['150+','farmácias'],['10k+','preços'],['476','medicamentos'],['60%','economia máx']].map(([v,l]) => (
                <div key={l} style={{ background:'#fff', borderRadius:14, padding:'18px 16px', textAlign:'center', border:'1.5px solid #f0f0f0' }}>
                  <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:ACCENT, lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:12, color:'#aaa', marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* REMÉDIOS POPULARES */}
          <section style={{ background:'#fff', borderTop:'1px solid #f0f0f0', borderBottom:'1px solid #f0f0f0', padding:'36px 20px', marginTop:28 }}>
            <div style={{ maxWidth:1200, margin:'0 auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Mais buscados</div>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:'#111' }}>Remédios populares</h2>
                </div>
                <Link href="/remedios" style={{ fontSize:13, color:ACCENT, fontWeight:600, border:'1.5px solid #ffb89a', padding:'6px 14px', borderRadius:10 }}>Ver todos →</Link>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(195px,1fr))', gap:10 }}>
                {REMEDIOS.slice(0,8).map(r => (
                  <button key={r.slug} onMouseDown={() => buscar(r.principio)}
                    style={{ background:'#f8f9fb', border:'1.5px solid #f0f0f0', borderRadius:12, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', textAlign:'left', transition:'all .15s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor='#ffb89a'; e.currentTarget.style.background='#fff9f7' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor='#f0f0f0'; e.currentTarget.style.background='#f8f9fb' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#222', marginBottom:2 }}>{r.nome}</div>
                      <div style={{ fontSize:11, color:'#aaa' }}>{r.categoria}</div>
                    </div>
                    <span style={{ fontSize:14, color:ACCENT, fontWeight:700 }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CIDADES */}
          <section style={{ padding:'36px 20px 52px' }}>
            <div style={{ maxWidth:1200, margin:'0 auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18, flexWrap:'wrap', gap:10 }}>
                <div>
                  <div style={{ fontSize:11, fontWeight:700, color:ACCENT, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Cobertura nacional</div>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:26, color:'#111' }}>Farmácias por cidade</h2>
                </div>
                <Link href="/cidades" style={{ fontSize:13, color:ACCENT, fontWeight:600, border:'1.5px solid #ffb89a', padding:'6px 14px', borderRadius:10 }}>Ver todas →</Link>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))', gap:10 }}>
                {CIDADES.slice(0,12).map(c => (
                  <Link key={c.slug} href={`/cidade/${c.slug}`}
                    style={{ background:'#fff', border:'1.5px solid #f0f0f0', borderRadius:12, padding:'12px 14px', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all .15s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor='#ffb89a'; e.currentTarget.style.background='#fff9f7' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor='#f0f0f0'; e.currentTarget.style.background='#fff' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:'#222' }}>{c.nome}</div>
                      <div style={{ fontSize:11, color:'#aaa', marginTop:1 }}>{c.estado}</div>
                    </div>
                    <span style={{ color:ACCENT, fontSize:13 }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer style={{ background:'#111', color:'#555', padding:'36px 20px 24px', borderTop:'1px solid #1e1e1e' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:24, marginBottom:24 }}>
            <div>
              <img src="/logo.png" alt="FarmáciaAí" style={{ height:32, marginBottom:10, filter:'brightness(10)' }} />
              <div style={{ fontSize:13, color:'#555', maxWidth:220, lineHeight:1.65 }}>Compare preços de remédios gratuitamente em 150+ farmácias.</div>
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'#888', letterSpacing:'.08em', textTransform:'uppercase', marginBottom:12 }}>Explorar</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {[['/', 'Início'],['/cidades','Cidades'],['/remedios','Remédios'],['/bulas','Bulas']].map(([href,label]) => (
                  <Link key={href} href={href} style={{ fontSize:13, color:'#555', transition:'color .15s' }} onMouseOver={e => e.currentTarget.style.color='#fff'} onMouseOut={e => e.currentTarget.style.color='#555'}>{label}</Link>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop:'1px solid #1e1e1e', paddingTop:18, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10, alignItems:'center' }}>
            <div style={{ fontSize:12, color:'#444' }}>© {new Date().getFullYear()} FarmáciaAí</div>
            <div style={{ fontSize:11, color:'#333' }}>Preços obtidos automaticamente. Não vendemos medicamentos.</div>
          </div>
        </div>
      </footer>
    </>
  )
}
