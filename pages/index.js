// pages/index.js — FarmáciaAí v4 — Comparador em foco
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CIDADES, REMEDIOS } from '../lib/data'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'

function Nav() {
  return (
    <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f0f0f0',boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
      <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
        <Link href="/" style={{ display:'flex',alignItems:'center',textDecoration:'none' }}>
          <img src="/logo.png" alt="FarmáciaAí" style={{ height:40,width:'auto' }} />
        </Link>
        <div style={{ display:'flex',alignItems:'center',gap:6 }}>
          <Link href="/cidades" style={{ fontSize:14,color:'#555',padding:'6px 14px',borderRadius:8,textDecoration:'none' }}>Cidades</Link>
          <Link href="/remedios" style={{ fontSize:14,color:'#555',padding:'6px 14px',borderRadius:8,textDecoration:'none' }}>Remédios</Link>
        </div>
      </div>
    </nav>
  )
}

function ResultTable({ resultados, remedio }) {
  if (!resultados.length) return (
    <div style={{ textAlign:'center',padding:'60px 20px',color:'#aaa' }}>
      <div style={{ fontSize:48,marginBottom:16 }}>💊</div>
      <p style={{ fontSize:16,color:'#555',marginBottom:8 }}>Nenhum resultado para "{remedio}"</p>
      <p style={{ fontSize:13 }}>Tente o princípio ativo — ex: "dipirona" em vez de "Neosaldina"</p>
    </div>
  )

  const melhor = resultados[0]

  return (
    <div>
      {/* DESTAQUE MENOR PREÇO */}
      <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',border:'2px solid #ff5a00',borderRadius:16,padding:'20px 24px',marginBottom:20,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:16 }}>
        <div style={{ display:'flex',alignItems:'center',gap:16 }}>
          <div style={{ background:OG,color:'#fff',fontSize:11,fontWeight:700,padding:'4px 10px',borderRadius:100,whiteSpace:'nowrap' }}>MENOR PREÇO</div>
          <div>
            <div style={{ fontSize:16,fontWeight:700,color:'#222' }}>{melhor.farmacia}</div>
            <div style={{ fontSize:13,color:'#666',marginTop:2 }}>{melhor.nome}</div>
          </div>
        </div>
        <div style={{ display:'flex',alignItems:'center',gap:20 }}>
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11,color:'#aaa' }}>Preço</div>
            <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:36,color:'#ff4500',lineHeight:1 }}>
              <span style={{ fontSize:16,verticalAlign:'super' }}>R$</span>{melhor.preco.toFixed(2).replace('.',',')}
            </div>
          </div>
          <a href={melhor.url} target="_blank" rel="noopener noreferrer"
            style={{ background:OG,color:'#fff',padding:'12px 24px',borderRadius:12,fontSize:14,fontWeight:700,textDecoration:'none',whiteSpace:'nowrap',boxShadow:'0 4px 14px rgba(255,69,0,.3)' }}>
            Comprar agora →
          </a>
        </div>
      </div>

      {/* TABELA COMPARATIVA */}
      <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,overflow:'hidden',boxShadow:'0 2px 12px rgba(0,0,0,.06)' }}>
        <div style={{ padding:'14px 20px',borderBottom:'1px solid #f5f5f5',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
          <div style={{ fontSize:14,fontWeight:600,color:'#111' }}>Comparativo de preços — {resultados.length} farmácias</div>
          <div style={{ fontSize:12,color:'#aaa' }}>Ordenado pelo menor preço</div>
        </div>
        {resultados.map((r, i) => (
          <div key={i} style={{ display:'grid',gridTemplateColumns:'1fr auto auto',alignItems:'center',padding:'14px 20px',gap:16,borderBottom:'1px solid #f9f9f9',background:i===0?'#fff9f7':'#fff',transition:'background .1s' }}
            onMouseOver={e=>e.currentTarget.style.background='#fffaf9'}
            onMouseOut={e=>e.currentTarget.style.background=i===0?'#fff9f7':'#fff'}>
            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:r.logo_cor,flexShrink:0 }} />
              <div>
                <div style={{ fontSize:14,fontWeight:600,color:'#222' }}>{r.farmacia}</div>
                <div style={{ fontSize:12,color:'#aaa',marginTop:1 }}>{r.nome}</div>
              </div>
            </div>
            <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:i===0?'#ff4500':'#222',whiteSpace:'nowrap' }}>
              R$ {r.preco.toFixed(2).replace('.',',')}
            </div>
            <a href={r.url} target="_blank" rel="noopener noreferrer"
              style={{ fontSize:13,fontWeight:600,color:i===0?'#fff':'#ff4500',background:i===0?OG:'transparent',border:i===0?'none':'1.5px solid #ffb89a',padding:'8px 16px',borderRadius:8,textDecoration:'none',whiteSpace:'nowrap',transition:'all .15s' }}
              onMouseOver={e=>{if(i!==0){e.currentTarget.style.background='#fff3ee'}}}
              onMouseOut={e=>{if(i!==0){e.currentTarget.style.background='transparent'}}}>
              {i===0 ? 'Comprar' : 'Ver oferta'}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

function FarmaciaCard({ f }) {
  return (
    <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,padding:'14px 16px',display:'flex',gap:12,alignItems:'flex-start',transition:'all .15s' }}
      onMouseOver={e=>{e.currentTarget.style.borderColor='#ffb89a';e.currentTarget.style.boxShadow='0 3px 12px rgba(255,90,0,.08)'}}
      onMouseOut={e=>{e.currentTarget.style.borderColor='#f0f0f0';e.currentTarget.style.boxShadow='none'}}>
      <div style={{ width:36,height:36,background:'#fff3ee',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:18 }}>💊</div>
      <div style={{ flex:1,minWidth:0 }}>
        <div style={{ fontSize:13,fontWeight:700,color:'#222',marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{f.nome}</div>
        <div style={{ fontSize:12,color:'#888',lineHeight:1.4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{f.endereco}</div>
        <div style={{ display:'flex',gap:6,marginTop:6,flexWrap:'wrap' }}>
          {f.aberto!==undefined && (
            <span style={{ fontSize:11,fontWeight:600,color:f.aberto?'#16a34a':'#dc2626',background:f.aberto?'#f0fdf4':'#fef2f2',padding:'2px 7px',borderRadius:100 }}>
              {f.aberto?'● Aberta':'● Fechada'}
            </span>
          )}
          {f.avaliacao && <span style={{ fontSize:11,color:'#f59e0b',fontWeight:600 }}>★ {f.avaliacao}</span>}
        </div>
      </div>
      <a href={`https://www.google.com/maps/place/?q=place_id:${f.place_id}`} target="_blank" rel="noopener noreferrer"
        style={{ fontSize:11,color:'#ff4500',fontWeight:600,border:'1px solid #ffb89a',padding:'4px 8px',borderRadius:6,textDecoration:'none',whiteSpace:'nowrap',flexShrink:0 }}>
        Mapa
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
  const [mostrarFarmacias, setMostrarFarmacias] = useState(false)

  function maskCEP(v) {
    const n = v.replace(/\D/g,'').slice(0,8)
    return n.length > 5 ? n.slice(0,5)+'-'+n.slice(5) : n
  }

  async function buscarFarmaciasProximas(cepVal) {
    const limpo = cepVal.replace(/\D/g,'')
    if (limpo.length !== 8) return
    setLoadingFarmacias(true)
    try {
      const res = await fetch('/api/farmacias-proximas?cep=' + limpo)
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
    if (v.length > 1) setSugestoes(REMEDIOS.filter(r => r.nome.toLowerCase().includes(v.toLowerCase()) || r.principio.toLowerCase().includes(v.toLowerCase())).slice(0,5))
    else setSugestoes([])
  }

  async function buscar(remedioOverride) {
    const q = remedioOverride || remedio
    if (!q.trim()) { setErro('Digite o nome do remédio'); return }
    setLoading(true); setErro(null); setResultados(null); setSugestoes([])
    if (cep.replace(/\D/g,'').length === 8 && !farmaciasProximas) buscarFarmaciasProximas(cep)
    try {
      const params = new URLSearchParams({ q: q.trim() })
      if (cep.replace(/\D/g,'').length === 8) params.append('cep', cep)
      const res = await fetch('/api/buscar?' + params)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultados(data.resultados || [])
      setLocalizacao(data.localizacao)
    } catch(e) {
      setErro(e.message || 'Erro ao buscar.')
    } finally { setLoading(false) }
  }

  const temResultados = loading || resultados !== null

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
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        body{font-family:'DM Sans',sans-serif;color:#222;background:#f8f9fb;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}
        input:focus{outline:none}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .f1{animation:fadeUp .4s ease both}
        .f2{animation:fadeUp .4s .08s ease both}
        .f3{animation:fadeUp .4s .16s ease both}
        .skel{background:#e8e8e8;border-radius:8px;animation:pulse 1.4s ease-in-out infinite}
      `}</style>

      <Nav />

      {/* HERO — COMPARADOR EM FOCO */}
      <section style={{ background:'linear-gradient(160deg,#fff8f5 0%,#fff 70%)',borderBottom:'1px solid #ffe8db',padding:'56px 20px 48px' }}>
        <div style={{ maxWidth:680,margin:'0 auto' }}>
          <div className="f1" style={{ display:'inline-flex',alignItems:'center',gap:6,background:'#fff3ee',border:'1px solid #ffd4be',color:'#cc3d00',fontSize:12,fontWeight:600,padding:'4px 12px',borderRadius:100,marginBottom:20 }}>
            <span style={{ width:6,height:6,background:'#ff4500',borderRadius:'50%',display:'inline-block' }} />
            Preços atualizados em tempo real
          </div>

          <h1 className="f2" style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(30px,5vw,52px)',lineHeight:1.1,color:'#111',marginBottom:14 }}>
            Qual remédio você<br />precisa comprar <em style={{ color:'#ff4500',fontStyle:'italic' }}>hoje?</em>
          </h1>
          <p className="f3" style={{ fontSize:17,color:'#666',fontWeight:300,lineHeight:1.6,marginBottom:32,maxWidth:480 }}>
            Compare preços em 9+ farmácias e encontre o menor preço em segundos.
          </p>

          {/* SEARCH — REMÉDIO EM DESTAQUE */}
          <div className="f3" style={{ background:'#fff',borderRadius:20,padding:'24px',boxShadow:'0 8px 32px rgba(0,0,0,.08)',border:'1px solid #f0f0f0' }}>
            {/* Campo principal — remédio */}
            <div style={{ position:'relative',marginBottom:12 }}>
              <svg style={{ position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:'#ff4500',pointerEvents:'none',zIndex:1 }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" value={remedio} onChange={e=>handleRemedioChange(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}
                placeholder="Nome do remédio — ex: Dipirona, Omeprazol..."
                style={{ width:'100%',height:56,border:'2px solid #ffe0cc',borderRadius:14,paddingLeft:46,paddingRight:14,fontSize:16,color:'#222',background:'#fff9f7',transition:'border-color .2s,background .2s',fontFamily:'inherit' }}
                onFocus={e=>{e.target.style.borderColor='#ff5a00';e.target.style.background='#fff'}}
                onBlur={e=>{setTimeout(()=>setSugestoes([]),200);e.target.style.borderColor='#ffe0cc';e.target.style.background='#fff9f7'}} />
              {sugestoes.length > 0 && (
                <div style={{ position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,marginTop:4,boxShadow:'0 8px 24px rgba(0,0,0,.1)',zIndex:50,overflow:'hidden' }}>
                  {sugestoes.map(s => (
                    <div key={s.slug} onMouseDown={()=>{setRemedio(s.nome);setSugestoes([]);setTimeout(()=>buscar(s.nome),100)}}
                      style={{ padding:'10px 16px',fontSize:14,cursor:'pointer',borderBottom:'1px solid #f9f9f9',display:'flex',justifyContent:'space-between',alignItems:'center' }}
                      onMouseOver={e=>e.currentTarget.style.background='#fff8f5'} onMouseOut={e=>e.currentTarget.style.background='#fff'}>
                      <span style={{ fontWeight:500 }}>{s.nome}</span>
                      <span style={{ color:'#aaa',fontSize:12 }}>{s.categoria}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Linha inferior — CEP + botão */}
            <div style={{ display:'flex',gap:10 }}>
              <div style={{ position:'relative',width:180,flexShrink:0 }}>
                <svg style={{ position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#aaa',pointerEvents:'none' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                <input type="text" value={cep} maxLength={9} onChange={e=>handleCEPChange(e.target.value)} onKeyDown={e=>e.key==='Enter'&&buscar()}
                  placeholder="CEP (opcional)"
                  style={{ width:'100%',height:46,border:'1.5px solid #e8e8e8',borderRadius:10,paddingLeft:34,paddingRight:10,fontSize:14,color:'#222',background:'#fafafa',fontFamily:'inherit' }}
                  onFocus={e=>{e.target.style.borderColor='#ff5a00';e.target.style.background='#fff'}}
                  onBlur={e=>{e.target.style.borderColor='#e8e8e8';e.target.style.background='#fafafa'}} />
              </div>
              <button onClick={()=>buscar()} disabled={loading}
                style={{ flex:1,height:46,background:loading?'#ffc4a8':OG,color:'#fff',border:'none',borderRadius:10,fontSize:15,fontWeight:700,cursor:loading?'not-allowed':'pointer',boxShadow:'0 4px 14px rgba(255,69,0,.25)',fontFamily:'inherit',transition:'opacity .15s,transform .1s' }}
                onMouseOver={e=>!loading&&(e.currentTarget.style.transform='translateY(-1px)')}
                onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                {loading ? 'Buscando...' : 'Comparar preços'}
              </button>
            </div>

            {/* Tags */}
            <div style={{ display:'flex',flexWrap:'wrap',gap:6,marginTop:12,alignItems:'center' }}>
              <span style={{ fontSize:12,color:'#aaa' }}>Buscados agora:</span>
              {['Dipirona','Omeprazol','Amoxicilina','Losartana','Ibuprofeno'].map(r => (
                <button key={r} onMouseDown={()=>{setRemedio(r);setTimeout(()=>buscar(r),50)}}
                  style={{ fontSize:12,color:'#ff4500',background:'#fff3ee',border:'1px solid #ffd4be',padding:'3px 10px',borderRadius:100,cursor:'pointer',fontFamily:'inherit' }}
                  onMouseOver={e=>{e.target.style.background='#ffe8db'}} onMouseOut={e=>{e.target.style.background='#fff3ee'}}>
                  {r}
                </button>
              ))}
            </div>
            {erro && <p style={{ marginTop:10,fontSize:13,color:'#e53e3e' }}>{erro}</p>}
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      {temResultados && (
        <section style={{ maxWidth:900,margin:'0 auto',padding:'32px 20px' }}>
          {localizacao && <p style={{ fontSize:13,color:'#aaa',marginBottom:10 }}>📍 {localizacao.cidade}, {localizacao.estado}</p>}
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:10 }}>
            <h2 style={{ fontSize:20,fontWeight:700,color:'#111' }}>
              {loading ? 'Comparando preços...' : `${resultados.length} resultado${resultados.length!==1?'s':''} para "${remedio}"`}
            </h2>
            <button onClick={()=>{setResultados(null);setFarmaciasProximas(null);setMostrarFarmacias(false)}}
              style={{ fontSize:13,color:'#aaa',background:'none',border:'none',cursor:'pointer' }}>← Nova busca</button>
          </div>

          {loading ? (
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {[1,2,3,4].map(i => <div key={i} className="skel" style={{ height:64 }} />)}
            </div>
          ) : (
            <ResultTable resultados={resultados} remedio={remedio} />
          )}

          {/* FARMÁCIAS FÍSICAS — SEÇÃO SECUNDÁRIA */}
          {(loadingFarmacias || (farmaciasProximas && mostrarFarmacias)) && (
            <div style={{ marginTop:40 }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14 }}>
                <div>
                  <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4 }}>Farmácias físicas próximas</div>
                  <h3 style={{ fontSize:16,fontWeight:600,color:'#111' }}>
                    {loadingFarmacias ? 'Buscando...' : `${farmaciasProximas?.farmacias?.length} farmácias em ${farmaciasProximas?.cidade}`}
                  </h3>
                </div>
                <button onClick={()=>setMostrarFarmacias(false)} style={{ fontSize:12,color:'#aaa',background:'none',border:'none',cursor:'pointer' }}>Ocultar</button>
              </div>
              {loadingFarmacias ? (
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:10 }}>
                  {[1,2,3].map(i=><div key={i} className="skel" style={{height:80}}/>)}
                </div>
              ) : (
                <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:10 }}>
                  {farmaciasProximas?.farmacias?.map((f,i)=><FarmaciaCard key={i} f={f}/>)}
                </div>
              )}
            </div>
          )}

          {/* CTA PARA VER FARMÁCIAS FÍSICAS */}
          {!loadingFarmacias && farmaciasProximas && !mostrarFarmacias && (
            <button onClick={()=>setMostrarFarmacias(true)}
              style={{ marginTop:20,width:'100%',padding:'12px',background:'#fff',border:'1.5px dashed #ffb89a',borderRadius:12,fontSize:14,color:'#ff4500',fontWeight:500,cursor:'pointer',fontFamily:'inherit' }}>
              📍 Ver {farmaciasProximas.farmacias.length} farmácias físicas próximas em {farmaciasProximas.cidade}
            </button>
          )}
        </section>
      )}

      {/* HOME — quando não há busca ativa */}
      {!temResultados && (
        <>
          {/* STATS */}
          <section style={{ maxWidth:1100,margin:'0 auto',padding:'40px 20px 0' }}>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:12 }}>
              {[['9+','farmácias'],['11k+','endereços'],['180k+','medicamentos'],['60%','economia máx.']].map(([v,l])=>(
                <div key={l} style={{ background:'#fff',borderRadius:14,padding:'20px',textAlign:'center',border:'1px solid #f0f0f0' }}>
                  <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:32,color:'#ff4500',lineHeight:1 }}>{v}</div>
                  <div style={{ fontSize:12,color:'#aaa',marginTop:4 }}>{l}</div>
                </div>
              ))}
            </div>
          </section>

          {/* COMO FUNCIONA */}
          <section style={{ maxWidth:1100,margin:'0 auto',padding:'48px 20px' }}>
            <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:10 }}>Como funciona</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:32,color:'#111',marginBottom:36 }}>Simples assim</h2>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:24 }}>
              {[
                ['1','Digite o remédio','Busque pelo nome comercial ou princípio ativo. O autocomplete ajuda a encontrar rapidamente.'],
                ['2','Veja os preços','Comparamos automaticamente nas 9 principais farmácias online do Brasil em segundos.'],
                ['3','Escolha e compre','Clique em "Comprar" e vá direto para a farmácia com o menor preço. Sem cadastro.'],
              ].map(([n,t,d])=>(
                <div key={n} style={{ background:'#fff',borderRadius:16,padding:'24px',border:'1px solid #f0f0f0' }}>
                  <div style={{ width:40,height:40,background:OG,borderRadius:10,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'DM Serif Display',serif",fontSize:20,color:'#fff',marginBottom:14 }}>{n}</div>
                  <div style={{ fontSize:15,fontWeight:700,color:'#111',marginBottom:6 }}>{t}</div>
                  <div style={{ fontSize:13,color:'#666',lineHeight:1.65 }}>{d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* REMÉDIOS POPULARES */}
          <section style={{ background:'#fff',borderTop:'1px solid #f0f0f0',borderBottom:'1px solid #f0f0f0',padding:'48px 20px' }}>
            <div style={{ maxWidth:1100,margin:'0 auto' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12 }}>
                <div>
                  <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6 }}>Mais buscados</div>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:28,color:'#111' }}>Remédios populares</h2>
                </div>
                <Link href="/remedios" style={{ fontSize:14,color:'#ff4500',fontWeight:600,border:'1.5px solid #ffb89a',padding:'7px 16px',borderRadius:10 }}>Ver todos →</Link>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:10 }}>
                {REMEDIOS.slice(0,8).map(r=>(
                  <button key={r.slug} onMouseDown={()=>{setRemedio(r.principio);setTimeout(()=>buscar(r.principio),50)}}
                    style={{ background:'#f8f9fb',border:'1px solid #f0f0f0',borderRadius:12,padding:'14px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',cursor:'pointer',textAlign:'left',fontFamily:'inherit',transition:'all .15s' }}
                    onMouseOver={e=>{e.currentTarget.style.borderColor='#ffb89a';e.currentTarget.style.background='#fff9f7'}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor='#f0f0f0';e.currentTarget.style.background='#f8f9fb'}}>
                    <div>
                      <div style={{ fontSize:13,fontWeight:600,color:'#222',marginBottom:2 }}>{r.nome}</div>
                      <div style={{ fontSize:11,color:'#aaa' }}>{r.categoria}</div>
                    </div>
                    <span style={{ fontSize:13,color:'#ff4500',fontWeight:700 }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* CIDADES */}
          <section style={{ padding:'48px 20px' }}>
            <div style={{ maxWidth:1100,margin:'0 auto' }}>
              <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20,flexWrap:'wrap',gap:12 }}>
                <div>
                  <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:6 }}>Cobertura nacional</div>
                  <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:28,color:'#111' }}>Farmácias por cidade</h2>
                </div>
                <Link href="/cidades" style={{ fontSize:14,color:'#ff4500',fontWeight:600,border:'1.5px solid #ffb89a',padding:'7px 16px',borderRadius:10 }}>Ver todas →</Link>
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',gap:10 }}>
                {CIDADES.slice(0,12).map(c=>(
                  <Link key={c.slug} href={`/cidade/${c.slug}`}
                    style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,padding:'13px 16px',display:'flex',justifyContent:'space-between',alignItems:'center',transition:'all .15s' }}
                    onMouseOver={e=>{e.currentTarget.style.borderColor='#ffb89a';e.currentTarget.style.background='#fff9f7'}}
                    onMouseOut={e=>{e.currentTarget.style.borderColor='#f0f0f0';e.currentTarget.style.background='#fff'}}>
                    <div>
                      <div style={{ fontSize:13,fontWeight:600,color:'#222' }}>{c.nome}</div>
                      <div style={{ fontSize:11,color:'#aaa',marginTop:1 }}>{c.estado}</div>
                    </div>
                    <span style={{ fontSize:13,color:'#ff4500' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* FOOTER */}
      <footer style={{ background:'#111',color:'#666',padding:'40px 20px 28px',borderTop:'1px solid #222' }}>
        <div style={{ maxWidth:1100,margin:'0 auto' }}>
          <div style={{ display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:28,marginBottom:32 }}>
            <div>
              <img src="/logo.png" alt="FarmáciaAí" style={{ height:34,marginBottom:10,filter:'brightness(10)' }} />
              <div style={{ fontSize:13,color:'#555',maxWidth:220,lineHeight:1.6 }}>Compare preços de remédios gratuitamente. Atualizado em tempo real.</div>
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:'#fff',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:12 }}>Explorar</div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {[['/', 'Início'],['/cidades','Cidades'],['/remedios','Remédios']].map(([href,label])=>(
                  <Link key={href} href={href} style={{ fontSize:13,color:'#555',transition:'color .15s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#555'}>{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:'#fff',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:12 }}>Farmácias</div>
              <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
                {[['https://www.drogal.com.br','Drogal'],['https://www.paguemenos.com.br','Pague Menos'],['https://www.promofarma.com.br','PromoFarma'],['https://www.drogariasaopaulo.com.br','Drogaria SP']].map(([href,label])=>(
                  <a key={href} href={href} target="_blank" rel="nofollow noopener" style={{ fontSize:13,color:'#555',transition:'color .15s' }} onMouseOver={e=>e.currentTarget.style.color='#fff'} onMouseOut={e=>e.currentTarget.style.color='#555'}>{label}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop:'1px solid #222',paddingTop:20,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:10 }}>
            <div style={{ fontSize:12 }}>© {new Date().getFullYear()} FarmáciaAí</div>
            <div style={{ fontSize:11,color:'#333',maxWidth:500 }}>Preços obtidos automaticamente dos sites das farmácias. FarmáciaAí não vende medicamentos.</div>
          </div>
        </div>
      </footer>
    </>
  )
}
