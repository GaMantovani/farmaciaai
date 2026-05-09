// pages/index.js — FarmáciaAí v3 — com farmácias próximas + preços reais
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CIDADES, REMEDIOS } from '../lib/data'

const OrangeGrad = 'linear-gradient(135deg,#ff6b1a,#ff4500)'

function Nav({ onBuscar }) {
  return (
    <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f0f0f0',boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex',alignItems:'center',textDecoration:'none' }}>
          <img src="/logo.png" alt="FarmáciaAí" style={{ height:40,width:'auto' }} />
        </Link>
        <div style={{ display:'flex',alignItems:'center',gap:6 }}>
          <Link href="/cidades" style={{ fontSize:14,color:'#555',padding:'6px 14px',borderRadius:8,textDecoration:'none' }}>Cidades</Link>
          <Link href="/remedios" style={{ fontSize:14,color:'#555',padding:'6px 14px',borderRadius:8,textDecoration:'none' }}>Remédios</Link>
          <button onClick={onBuscar} style={{ fontSize:14,fontWeight:600,color:'#fff',background:OrangeGrad,border:'none',padding:'9px 20px',borderRadius:10,cursor:'pointer' }}>
            Buscar remédio
          </button>
        </div>
      </div>
    </nav>
  )
}

function PriceCard({ result, index }) {
  const best = index === 0
  return (
    <div style={{ background:'#fff',border:best?'2px solid #ff5a00':'1px solid #eee',borderRadius:16,padding:20,position:'relative',overflow:'hidden',transition:'transform .15s,box-shadow .15s',boxShadow:best?'0 4px 20px rgba(255,90,0,.15)':'0 2px 8px rgba(0,0,0,.05)' }}
      onMouseOver={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=best?'0 8px 28px rgba(255,90,0,.2)':'0 6px 20px rgba(0,0,0,.1)'}}
      onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow=best?'0 4px 20px rgba(255,90,0,.15)':'0 2px 8px rgba(0,0,0,.05)'}}>
      {best && <div style={{ position:'absolute',top:0,right:0,background:OrangeGrad,color:'#fff',fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:'0 14px 0 10px' }}>MENOR PREÇO</div>}
      <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:8 }}>
        <div style={{ width:10,height:10,borderRadius:'50%',background:result.logo_cor,flexShrink:0 }} />
        <span style={{ fontSize:14,fontWeight:700,color:'#222' }}>{result.farmacia}</span>
      </div>
      <p style={{ fontSize:13,color:'#666',marginBottom:14,lineHeight:1.4,minHeight:36 }}>{result.nome}</p>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <div>
          <div style={{ fontSize:11,color:'#aaa',marginBottom:2 }}>Preço</div>
          <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:30,color:best?'#ff4500':'#222',lineHeight:1 }}>
            <span style={{ fontSize:15,verticalAlign:'super' }}>R$</span>{result.preco.toFixed(2).replace('.',',')}
          </div>
        </div>
        <a href={result.url} target="_blank" rel="noopener noreferrer"
          style={{ display:'inline-flex',alignItems:'center',gap:6,background:best?OrangeGrad:'#f5f5f5',color:best?'#fff':'#444',border:'none',borderRadius:10,padding:'10px 18px',fontSize:13,fontWeight:600,cursor:'pointer',textDecoration:'none' }}
          onMouseOver={e=>e.currentTarget.style.opacity='.88'} onMouseOut={e=>e.currentTarget.style.opacity='1'}>
          Ver oferta
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        </a>
      </div>
      <div style={{ marginTop:10,fontSize:11,color:'#aaa' }}>🚚 {result.entrega}</div>
    </div>
  )
}

function FarmaciaCard({ f }) {
  return (
    <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'16px 18px',display:'flex',gap:14,alignItems:'flex-start',transition:'border-color .15s,box-shadow .15s' }}
      onMouseOver={e=>{e.currentTarget.style.borderColor='#ff8c5a';e.currentTarget.style.boxShadow='0 4px 14px rgba(255,90,0,.1)'}}
      onMouseOut={e=>{e.currentTarget.style.borderColor='#f0f0f0';e.currentTarget.style.boxShadow='none'}}>
      <div style={{ width:40,height:40,background:'#fff3ee',borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:20 }}>💊</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:14,fontWeight:700,color:'#222',marginBottom:3 }}>{f.nome}</div>
        <div style={{ fontSize:12,color:'#888',marginBottom:6,lineHeight:1.4 }}>{f.endereco}</div>
        <div style={{ display:'flex',gap:8,alignItems:'center',flexWrap:'wrap' }}>
          {f.aberto !== undefined && (
            <span style={{ fontSize:11,fontWeight:600,color:f.aberto?'#16a34a':'#dc2626',background:f.aberto?'#f0fdf4':'#fef2f2',padding:'2px 8px',borderRadius:100 }}>
              {f.aberto ? '● Aberta agora' : '● Fechada'}
            </span>
          )}
          {f.avaliacao && (
            <span style={{ fontSize:11,color:'#f59e0b',fontWeight:600 }}>★ {f.avaliacao}</span>
          )}
        </div>
      </div>
      <a href={`https://www.google.com/maps/place/?q=place_id:${f.place_id}`} target="_blank" rel="noopener noreferrer"
        style={{ fontSize:12,color:'#ff4500',fontWeight:600,whiteSpace:'nowrap',textDecoration:'none',border:'1px solid #ffb89a',padding:'5px 10px',borderRadius:8 }}>
        Ver no mapa
      </a>
    </div>
  )
}

export default function Home() {
  const [cep, setCep] = useState('')
  const [remedio, setRemedio] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [localizacao, setLocalizacao] = useState(null)
  const [erro, setErro] = useState(null)
  const [sugestoes, setSugestoes] = useState([])
  const [farmaciasProximas, setFarmaciasProximas] = useState(null)
  const [loadingFarmacias, setLoadingFarmacias] = useState(false)

  function maskCEP(v) {
    const n = v.replace(/\D/g,'').slice(0,8)
    return n.length > 5 ? n.slice(0,5)+'-'+n.slice(5) : n
  }

  async function buscarFarmaciasProximas(cepVal) {
    const limpo = cepVal.replace(/\D/g,'')
    if (limpo.length !== 8) return
    setLoadingFarmacias(true)
    try {
      const res = await fetch(`/api/farmacias-proximas?cep=${limpo}`)
      const data = await res.json()
      if (data.farmacias?.length) setFarmaciasProximas(data)
    } catch(e) {} finally { setLoadingFarmacias(false) }
  }

  function handleCEPChange(v) {
    const masked = maskCEP(v)
    setCep(masked)
    if (masked.replace(/\D/g,'').length === 8) buscarFarmaciasProximas(masked)
  }

  function handleRemedioChange(v) {
    setRemedio(v)
    if (v.length > 1) {
      setSugestoes(REMEDIOS.filter(r => r.nome.toLowerCase().includes(v.toLowerCase()) || r.principio.toLowerCase().includes(v.toLowerCase())).slice(0,5))
    } else setSugestoes([])
  }

  async function buscar(remedioOverride) {
    const q = remedioOverride || remedio
    if (!q.trim()) { setErro('Digite o nome do remédio'); return }
    setLoading(true); setErro(null); setResultados(null); setSugestoes([])
    if (cep.replace(/\D/g,'').length === 8 && !farmaciasProximas) buscarFarmaciasProximas(cep)
    try {
      const params = new URLSearchParams({ q: q.trim() })
      if (cep.replace(/\D/g,'').length === 8) params.append('cep', cep)
      const res = await fetch(`/api/buscar?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultados(data.resultados || [])
      setLocalizacao(data.localizacao)
    } catch(e) {
      setErro(e.message || 'Erro ao buscar.')
    } finally { setLoading(false) }
  }

  const scrollToBusca = () => document.getElementById('busca')?.scrollIntoView({ behavior:'smooth' })

  return (
    <>
      <Head>
        <title>FarmáciaAí — Compare preços de remédios perto de você</title>
        <meta name="description" content="Compare preços de remédios nas farmácias mais próximas. Digite o CEP e encontre o menor preço na sua região. Grátis e atualizado." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"WebSite","name":"FarmáciaAí","url":"https://farmaciaai.com.br",
          "potentialAction":{"@type":"SearchAction","target":"https://farmaciaai.com.br/?q={search_term_string}","query-input":"required name=search_term_string"}
        })}} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#fff;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}.f1{animation:fadeUp .5s ease both}.f2{animation:fadeUp .5s .1s ease both}.f3{animation:fadeUp .5s .2s ease both}.f4{animation:fadeUp .5s .3s ease both}.skel{background:#f0f0f0;border-radius:12px;animation:pulse 1.4s ease-in-out infinite}input:focus{outline:none}`}</style>

      <Nav onBuscar={scrollToBusca} />

      {/* HERO */}
      <section style={{ background:'linear-gradient(160deg,#fff8f5 0%,#fff 60%)',padding:'70px 20px 60px',borderBottom:'1px solid #f5f5f5' }}>
        <div style={{ maxWidth:760,margin:'0 auto',textAlign:'center' }}>
          <div className="f1" style={{ display:'inline-flex',alignItems:'center',gap:6,background:'#fff3ee',border:'1px solid #ffd4be',color:'#cc3d00',fontSize:13,fontWeight:600,padding:'5px 14px',borderRadius:100,marginBottom:28 }}>
            <span style={{ width:7,height:7,background:'#ff4500',borderRadius:'50%',display:'inline-block' }} />
            Preços atualizados em tempo real
          </div>
          <h1 className="f2" style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(34px,5.5vw,58px)',lineHeight:1.08,color:'#111',marginBottom:18 }}>
            Compare preços de remédios{' '}
            <em style={{ color:'#ff4500',fontStyle:'italic' }}>perto de você</em>
          </h1>
          <p className="f3" style={{ fontSize:18,color:'#666',fontWeight:300,lineHeight:1.65,marginBottom:44,maxWidth:520,margin:'0 auto 44px' }}>
            Digite o CEP e o nome do remédio. Comparamos automaticamente os preços nas principais farmácias do Brasil.
          </p>

          {/* SEARCH BOX */}
          <div id="busca" className="f4" style={{ background:'#fff',border:'1px solid #e8e8e8',borderRadius:24,padding:'28px 28px 24px',maxWidth:620,margin:'0 auto',boxShadow:'0 8px 40px rgba(0,0,0,.08)' }}>
            <div style={{ display:'flex',gap:10,marginBottom:12 }}>
              <div style={{ flex:1,position:'relative' }}>
                <svg style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#bbb',pointerEvents:'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                <input type="text" value={cep} maxLength={9} onChange={e=>handleCEPChange(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()} placeholder="CEP (opcional)"
                  style={{ width:'100%',height:50,border:'1.5px solid #e8e8e8',borderRadius:12,paddingLeft:42,paddingRight:14,fontSize:15,color:'#222',background:'#fafafa',transition:'border-color .2s' }}
                  onFocus={e=>{e.target.style.borderColor='#ff5a00';e.target.style.background='#fff'}} onBlur={e=>{e.target.style.borderColor='#e8e8e8';e.target.style.background='#fafafa'}} />
              </div>
              <button onClick={()=>buscar()} disabled={loading} style={{ height:50,padding:'0 28px',background:loading?'#ffc4a8':OrangeGrad,color:'#fff',border:'none',borderRadius:12,fontSize:15,fontWeight:600,cursor:loading?'not-allowed':'pointer',whiteSpace:'nowrap',boxShadow:'0 4px 14px rgba(255,69,0,.3)' }}>
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <div style={{ position:'relative',marginBottom:14 }}>
              <svg style={{ position:'absolute',left:14,top:16,color:'#bbb',pointerEvents:'none' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" value={remedio} onChange={e=>handleRemedioChange(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()} placeholder="Nome do remédio (ex: Dipirona 500mg)"
                style={{ width:'100%',height:50,border:'1.5px solid #e8e8e8',borderRadius:12,paddingLeft:42,paddingRight:14,fontSize:15,color:'#222',background:'#fafafa',transition:'border-color .2s' }}
                onFocus={e=>{e.target.style.borderColor='#ff5a00';e.target.style.background='#fff'}} onBlur={e=>{setTimeout(()=>setSugestoes([]),200);e.target.style.borderColor='#e8e8e8';e.target.style.background='#fafafa'}} />
              {sugestoes.length > 0 && (
                <div style={{ position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:'1px solid #e8e8e8',borderRadius:12,marginTop:4,boxShadow:'0 8px 24px rgba(0,0,0,.1)',zIndex:50,overflow:'hidden' }}>
                  {sugestoes.map(s => (
                    <div key={s.slug} onMouseDown={()=>{setRemedio(s.nome);setSugestoes([]);setTimeout(()=>buscar(s.nome),100)}}
                      style={{ padding:'10px 16px',fontSize:14,cursor:'pointer',borderBottom:'1px solid #f5f5f5' }}
                      onMouseOver={e=>e.currentTarget.style.background='#fff8f5'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                      <span style={{ fontWeight:500 }}>{s.nome}</span>
                      <span style={{ color:'#aaa',marginLeft:8,fontSize:12 }}>{s.categoria}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ display:'flex',flexWrap:'wrap',gap:6,alignItems:'center' }}>
              <span style={{ fontSize:12,color:'#aaa' }}>Mais buscados:</span>
              {['Dipirona','Omeprazol','Amoxicilina','Losartana','Ibuprofeno','Paracetamol'].map(r => (
                <button key={r} onMouseDown={()=>{setRemedio(r);setTimeout(()=>buscar(r),50)}}
                  style={{ fontSize:12,color:'#555',background:'#f5f5f5',border:'1px solid #e8e8e8',padding:'4px 10px',borderRadius:100,cursor:'pointer' }}
                  onMouseOver={e=>{e.target.style.background='#fff3ee';e.target.style.color='#ff4500';e.target.style.borderColor='#ffb89a'}}
                  onMouseOut={e=>{e.target.style.background='#f5f5f5';e.target.style.color='#555';e.target.style.borderColor='#e8e8e8'}}>{r}</button>
              ))}
            </div>
            {erro && <p style={{ marginTop:12,fontSize:13,color:'#e53e3e',textAlign:'left' }}>{erro}</p>}
          </div>
        </div>
      </section>

      {/* FARMÁCIAS PRÓXIMAS */}
      {(loadingFarmacias || farmaciasProximas) && (
        <section style={{ maxWidth:1100,margin:'0 auto',padding:'40px 20px 0' }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16,flexWrap:'wrap',gap:8 }}>
            <div>
              <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:4 }}>Farmácias próximas</div>
              <h2 style={{ fontSize:20,fontWeight:700,color:'#111' }}>
                {loadingFarmacias ? 'Buscando farmácias...' : `${farmaciasProximas?.farmacias?.length} farmácias perto de você em ${farmaciasProximas?.cidade}`}
              </h2>
            </div>
          </div>
          {loadingFarmacias ? (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12 }}>
              {[1,2,3].map(i => <div key={i} className="skel" style={{ height:90 }} />)}
            </div>
          ) : (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:12 }}>
              {farmaciasProximas?.farmacias?.map((f,i) => <FarmaciaCard key={i} f={f} />)}
            </div>
          )}
        </section>
      )}

      {/* RESULTADOS DE PREÇOS */}
      {(loading || resultados !== null) && (
        <section style={{ maxWidth:1100,margin:'0 auto',padding:'40px 20px' }}>
          {localizacao && <p style={{ fontSize:13,color:'#aaa',marginBottom:10 }}>📍 Resultados para {localizacao.cidade}, {localizacao.estado}</p>}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12 }}>
            <h2 style={{ fontSize:22,fontWeight:700,color:'#111' }}>
              {loading ? 'Buscando preços...' : `${resultados.length} resultado${resultados.length!==1?'s':''} para "${remedio}"`}
            </h2>
            <button onClick={()=>{setResultados(null);setFarmaciasProximas(null)}} style={{ fontSize:13,color:'#aaa',background:'none',border:'none',cursor:'pointer' }}>← Nova busca</button>
          </div>
          {loading ? (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
              {[1,2,3,4].map(i => <div key={i} className="skel" style={{ height:180 }} />)}
            </div>
          ) : resultados.length === 0 ? (
            <div style={{ textAlign:'center',padding:'60px 0',color:'#aaa' }}>
              <div style={{ fontSize:48,marginBottom:16 }}>💊</div>
              <p style={{ fontSize:16,color:'#555',marginBottom:8 }}>Nenhum resultado para "{remedio}"</p>
              <p style={{ fontSize:14 }}>Tente o princípio ativo (ex: "dipirona" em vez de "Neosaldina")</p>
            </div>
          ) : (
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:14 }}>
              {resultados.map((r,i) => <PriceCard key={i} result={r} index={i} />)}
            </div>
          )}
        </section>
      )}

      {/* STATS */}
      {!resultados && !loading && (
        <section style={{ maxWidth:1100,margin:'0 auto',padding:'48px 20px' }}>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:1,border:'1px solid #f0f0f0',borderRadius:20,overflow:'hidden',background:'#f0f0f0' }}>
            {[['9+','farmácias monitoradas'],['180k+','medicamentos'],['até 60%','de economia'],['tempo real','atualização']].map(([v,l]) => (
              <div key={l} style={{ background:'#fff',padding:'32px 24px',textAlign:'center' }}>
                <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:38,color:'#ff4500',lineHeight:1 }}>{v}</div>
                <div style={{ fontSize:13,color:'#aaa',marginTop:6 }}>{l}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      {!resultados && !loading && (
        <section style={{ padding:'64px 20px',background:'#fff8f5',borderTop:'1px solid #ffe8db' }}>
          <div style={{ maxWidth:1000,margin:'0 auto' }}>
            <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:10 }}>Como funciona</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:36,color:'#111',marginBottom:40 }}>Encontre o menor preço em 3 passos</h2>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:32 }}>
              {[['1','Digite o CEP e o remédio','Usamos seu CEP para mostrar farmácias físicas próximas e identificar quais entregam na sua região.'],
                ['2','Comparamos em tempo real','Buscamos automaticamente nos sites das principais farmácias do Brasil simultaneamente.'],
                ['3','Compre na melhor oferta','Clique em "Ver oferta" e vá direto para a farmácia com o menor preço. Sem cadastro.']
              ].map(([n,t,d]) => (
                <div key={n}>
                  <div style={{ width:44,height:44,background:OrangeGrad,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Serif Display',serif",fontSize:22,color:'#fff',marginBottom:16 }}>{n}</div>
                  <div style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:8 }}>{t}</div>
                  <div style={{ fontSize:14,color:'#666',lineHeight:1.7 }}>{d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* REMÉDIOS POPULARES */}
      {!resultados && !loading && (
        <section style={{ padding:'64px 20px' }}>
          <div style={{ maxWidth:1100,margin:'0 auto' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12 }}>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6 }}>Mais buscados</div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:30,color:'#111' }}>Remédios populares</h2>
              </div>
              <Link href="/remedios" style={{ fontSize:14,color:'#ff4500',fontWeight:600,border:'1.5px solid #ffb89a',padding:'8px 18px',borderRadius:10 }}>Ver todos →</Link>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:10 }}>
              {REMEDIOS.slice(0,8).map(r => (
                <Link key={r.slug} href={`/remedio/${r.slug}`}
                  style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'16px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all .15s' }}
                  onMouseOver={e=>{e.currentTarget.style.borderColor='#ff8c5a';e.currentTarget.style.boxShadow='0 4px 14px rgba(255,90,0,.12)'}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='#f0f0f0';e.currentTarget.style.boxShadow='none'}}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:600,color:'#222',marginBottom:2 }}>{r.nome}</div>
                    <div style={{ fontSize:12,color:'#aaa' }}>{r.categoria}</div>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CIDADES */}
      {!resultados && !loading && (
        <section style={{ padding:'64px 20px',background:'#fafafa',borderTop:'1px solid #f0f0f0' }}>
          <div style={{ maxWidth:1100,margin:'0 auto' }}>
            <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24,flexWrap:'wrap',gap:12 }}>
              <div>
                <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6 }}>Cobertura nacional</div>
                <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:30,color:'#111' }}>Preços por cidade</h2>
              </div>
              <Link href="/cidades" style={{ fontSize:14,color:'#ff4500',fontWeight:600,border:'1.5px solid #ffb89a',padding:'8px 18px',borderRadius:10 }}>Ver todas →</Link>
            </div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10 }}>
              {CIDADES.slice(0,12).map(c => (
                <Link key={c.slug} href={`/cidade/${c.slug}`}
                  style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'14px 18px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'border-color .15s' }}
                  onMouseOver={e=>e.currentTarget.style.borderColor='#ff8c5a'} onMouseOut={e=>e.currentTarget.style.borderColor='#f0f0f0'}>
                  <div>
                    <div style={{ fontSize:14,fontWeight:600,color:'#222' }}>{c.nome}</div>
                    <div style={{ fontSize:12,color:'#aaa',marginTop:2 }}>{c.estado}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FOOTER */}
      <footer style={{ background:'#111',color:'#888',padding:'48px 20px 32px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:32,marginBottom:40 }}>
            <div>
              <img src="/logo.png" alt="FarmáciaAí" style={{ height:36,marginBottom:12,filter:'brightness(10)' }} />
              <div style={{ fontSize:13,color:'#666',maxWidth:240,lineHeight:1.6 }}>Compare preços de remédios nas farmácias mais próximas. Grátis e atualizado.</div>
            </div>
            <div>
              <div style={{ fontSize:12,fontWeight:600,color:'#fff',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:14 }}>Explorar</div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {[['/', 'Início'],['/cidades','Cidades'],['/remedios','Remédios']].map(([href,label]) => (
                  <Link key={href} href={href} style={{ fontSize:13,color:'#666',transition:'color .15s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#666'}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:12,fontWeight:600,color:'#fff',letterSpacing:'.06em',textTransform:'uppercase',marginBottom:14 }}>Farmácias</div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {[['https://www.drogal.com.br','Drogal'],['https://www.paguemenos.com.br','Pague Menos'],['https://www.drogariasaopaulo.com.br','Drogaria SP'],['https://www.promofarma.com.br','PromoFarma']].map(([href,label]) => (
                  <a key={href} href={href} target="_blank" rel="nofollow noopener" style={{ fontSize:13,color:'#666',transition:'color .15s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#666'}>{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop:'1px solid #222',paddingTop:24,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:12 }}>
            <div style={{ fontSize:12 }}>© {new Date().getFullYear()} FarmáciaAí — Todos os direitos reservados</div>
            <div style={{ fontSize:11,color:'#444',maxWidth:500 }}>Os preços são obtidos automaticamente dos sites das farmácias e podem variar. FarmáciaAí não vende medicamentos.</div>
          </div>
        </div>
      </footer>
    </>
  )
}
