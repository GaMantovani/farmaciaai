// pages/index.js — FarmáciaAí — Design baseado no Lovable
import { useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CIDADES, REMEDIOS } from '../lib/data'

const CATEGORIAS = [
  { id:'gripe', label:'Gripe & Resfriado', queries:['amoxicilina','ibuprofeno','paracetamol','nimesulida','cetirizina','loratadina'] },
  { id:'dor', label:'Dor & Febre', queries:['dipirona','ibuprofeno','paracetamol','nimesulida','tramadol','codeina'] },
  { id:'diabetes', label:'Diabetes', queries:['metformina','glibenclamida','insulina','sitagliptina','glicazida','empagliflozina'] },
  { id:'pressao', label:'Pressão Alta', queries:['losartana','enalapril','captopril','atenolol','amlodipina','hidroclorotiazida'] },
  { id:'antibiotico', label:'Antibióticos', queries:['azitromicina','amoxicilina','ciprofloxacino','cefalexina','doxiciclina','claritromicina'] },
  { id:'vitaminas', label:'Vitaminas', queries:['vitamina c','vitamina d','complexo b','zinco','magnesio','omega 3'] },
  { id:'dermocosmeticos', label:'Dermocosméticos', queries:['isotretinoina','adapaleno','tretinoina','clindamicina','benzoil peroxido','acido retinoico'] },
  { id:'mulher', label:'Saúde da Mulher', queries:['progesterona','estradiol','anticoncepcional','acido folico','fluconazol','metronidazol'] },
  { id:'infantil', label:'Infantil', queries:['paracetamol gotas','ibuprofeno gotas','dipirona gotas','amoxicilina suspensao','dexametasona','prednisolona'] },
  { id:'genericos', label:'Genéricos', queries:['dipirona 500mg','omeprazol 20mg','losartana 50mg','atenolol 25mg','metformina 850mg','atorvastatina 20mg'] },
  { id:'alergia', label:'Alergia', queries:['cetirizina','loratadina','desloratadina','fexofenadina','hidroxizina','dexclorfeniramina'] },
  { id:'estomago', label:'Estômago', queries:['omeprazol','pantoprazol','ranitidina','domperidona','metoclopramida','buscopan'] },
]

function MedImg({ src, alt, className }) {
  const [err, setErr] = useState(false)
  if (!src || err) return (
    <div className={className} style={{ display:'flex', alignItems:'center', justifyContent:'center', fontSize:32 }}>💊</div>
  )
  return <img src={src} alt={alt} onError={() => setErr(true)} className={className} style={{ objectFit:'cover', width:'100%', height:'100%' }} />
}

function ResultCard({ offer, rank }) {
  const discount = offer.preco_anterior ? Math.round((1 - offer.preco / offer.preco_anterior) * 100) : 0
  const isBest = rank === 0

  return (
    <article style={{
      position:'relative', display:'flex', alignItems:'center', gap:10,
      borderRadius:16, border: isBest ? '1.5px solid var(--primary)' : '1px solid var(--border)',
      background:'var(--card)', padding:'16px 20px',
      transition:'all .2s', cursor:'pointer',
      boxShadow: isBest ? 'var(--shadow-elevated)' : 'none'
    }}
      onMouseOver={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='var(--shadow-elevated)' }}
      onMouseOut={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow= isBest ? 'var(--shadow-elevated)' : 'none' }}>

      {/* RANK */}
      <div style={{
        width:32, height:32, borderRadius:'50%', flexShrink:0,
        background: isBest ? 'var(--primary)' : 'var(--secondary)',
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:15, fontWeight:700,
        color: isBest ? 'var(--primary-foreground)' : 'var(--foreground)'
      }}>
        {rank + 1}
      </div>

      {/* IMAGEM */}
      <div style={{ width:60, height:60, borderRadius:10, overflow:'hidden', background:'var(--secondary)', flexShrink:0 }}>
        <MedImg src={offer.imagem} alt={offer.medicamento} className="" />
      </div>

      {/* INFO */}
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
          <span style={{ width:10, height:10, borderRadius:'50%', background: offer.logo_cor || 'var(--primary)', flexShrink:0, display:'inline-block' }} />
          <span style={{ fontSize:12, fontWeight:600, color:'var(--foreground)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{offer.farmacia}</span>
          {isBest && (
            <span style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'.05em', background:'oklch(0.95 0.06 140)', color:'oklch(0.45 0.16 145)', padding:'2px 8px', borderRadius:100, whiteSpace:'nowrap' }}>
              Melhor preço
            </span>
          )}
        </div>
        <h3 style={{ fontSize:14, fontWeight:700, color:'var(--foreground)', marginBottom:2, lineHeight:1.3 }}>{offer.medicamento}</h3>
        <div style={{ display:'flex', alignItems:'center', gap:12, fontSize:12, color:'var(--muted-foreground)' }}>
          <span>⭐ {(4.5 + Math.random() * 0.4).toFixed(1)}</span>
          <span>🚚 Entrega online</span>
        </div>
      </div>

      {/* PREÇO */}
      <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
        {offer.preco_anterior && (
          <span style={{ fontSize:12, color:'var(--muted-foreground)', textDecoration:'line-through' }}>
            R$ {offer.preco_anterior.toFixed(2).replace('.',',')}
          </span>
        )}
        <div style={{ display:'flex', alignItems:'baseline', gap:3 }}>
          <span style={{ fontSize:13, fontWeight:500, color:'var(--muted-foreground)' }}>R$</span>
          <span style={{ fontSize:26, fontWeight:800, lineHeight:1, color:'var(--primary)' }}>{offer.preco.toFixed(2).replace('.',',')}</span>
        </div>
        {discount > 0 && (
          <span style={{ fontSize:11, fontWeight:700, background:'var(--accent)', color:'var(--accent-foreground)', padding:'2px 6px', borderRadius:6 }}>-{discount}%</span>
        )}
        <a href={offer.url} target="_blank" rel="noopener noreferrer"
          style={{ marginTop:4, display:'inline-flex', alignItems:'center', gap:6, background:'var(--primary)', color:'var(--primary-foreground)', padding:'8px 18px', borderRadius:12, fontSize:13, fontWeight:700, textDecoration:'none', boxShadow:'var(--shadow-card)', transition:'filter .15s' }}
          onMouseOver={e => e.currentTarget.style.filter='brightness(1.1)'}
          onMouseOut={e => e.currentTarget.style.filter='brightness(1)'}
          onClick={e => e.stopPropagation()}>
          ✓ Comprar
        </a>
      </div>
    </article>
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
  const [mostrarFarmacias, setMostrarFarmacias] = useState(false)
  const [mostrarTodos, setMostrarTodos] = useState(false)
  const [cepSalvo, setCepSalvo] = useState(null)
  const [catAtiva, setCatAtiva] = useState(null)
  const [catPage, setCatPage] = useState(0)
  const [bulaInfo, setBulaInfo] = useState(null)
  const [bulaExpanded, setBulaExpanded] = useState(false)
  const [ordem, setOrdem] = useState('preco')
  const inputRef = useRef(null)

  function maskCEP(v) {
    const n = v.replace(/\D/g,'').slice(0,8)
    return n.length > 5 ? n.slice(0,5)+'-'+n.slice(5) : n
  }

  async function salvarCep() {
    const limpo = cep.replace(/\D/g,'')
    if (limpo.length !== 8) return
    try {
      const res = await fetch('https://viacep.com.br/ws/'+limpo+'/json/')
      const data = await res.json()
      if (!data.erro) {
        setCepSalvo({ cep: cep, cidade: data.localidade, estado: data.uf })
        buscarFarmaciasProximas(cep)
      }
    } catch(e) {}
  }

  async function buscarFarmaciasProximas(cepVal) {
    const limpo = cepVal.replace(/\D/g,'')
    if (limpo.length !== 8) return
    try {
      const res = await fetch('/api/farmacias-proximas?cep='+limpo)
      const data = await res.json()
      if (data.farmacias?.length) { setFarmaciasProximas(data); setMostrarFarmacias(true) }
    } catch(e) {}
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
    setRemedio(q); setQuery(q); setMostrarTodos(false)
    if (cep.replace(/\D/g,'').length === 8 && !farmaciasProximas) buscarFarmaciasProximas(cep)
    try {
      const params = new URLSearchParams({ q: q.trim() })
      if (cep.replace(/\D/g,'').length === 8) params.append('cep', cep)
      const res = await fetch('/api/buscar?'+params)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultados(data.resultados || [])
      setBulaInfo(null)
      setBulaExpanded(false)
      try {
        const nomeQuery = encodeURIComponent(q.trim().split(' ')[0].toUpperCase())
        const bulaRes = await fetch(`https://lbatmgvrqvjchbodzymy.supabase.co/rest/v1/bulas?select=id,nome_limpo,slug,html_conteudo,empresa&nome_limpo=ilike.${nomeQuery}%25&html_conteudo=not.is.null&limit=1`, {
          headers: { 'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo' }
        })
        const bulaData = await bulaRes.json()
        if (bulaData && bulaData[0]) setBulaInfo(bulaData[0])
      } catch(err) {}
      setLocalizacao(data.localizacao)
    } catch(e) { setErro(e.message || 'Erro ao buscar.') }
    finally { setLoading(false) }
  }

  const temResultados = loading || resultados !== null
  const resultadosOrdenados = resultados ? [...resultados].sort((a,b) => ordem === 'preco' ? a.preco - b.preco : (b.vendidos||0) - (a.vendidos||0)) : []
  const visiveis = resultadosOrdenados ? (mostrarTodos ? resultadosOrdenados : resultadosOrdenados.slice(0, 6)) : []
  const melhor = resultados?.[0]
  const economia = resultados?.length > 1 ? (resultados[resultados.length-1].preco - resultados[0].preco).toFixed(2).replace('.',',') : null

  return (
    <>
      <Head>
        <title>FarmáciaAí · Compare preços de remédios e economize</title>
        <meta name="description" content="Compare preços de remédios em mais de 150 farmácias e economize até 70%. Os melhores descontos da sua região." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://farmaciaai.com.br" />
        <meta property="og:title" content="FarmáciaAí · Compare preços de remédios e economize" />
        <meta property="og:description" content="Compare preços de remédios em mais de 150 farmácias e economize até 70%. Os melhores descontos da sua região." />
        <meta property="og:url" content="https://farmaciaai.com.br" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'FarmáciaAí',
          'url': 'https://farmaciaai.com.br',
          'description': 'Compare preços de remédios em mais de 150 farmácias online do Brasil.',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': { '@type': 'EntryPoint', 'urlTemplate': 'https://farmaciaai.com.br/?q={search_term_string}' },
            'query-input': 'required name=search_term_string',
          },
        }) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,600;0,9..40,700;0,9..40,800&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --radius: 0.75rem;
            --background: oklch(1 0 0);
            --foreground: oklch(0.18 0.02 40);
            --card: oklch(1 0 0);
            --primary: oklch(0.65 0.245 36);
            --primary-foreground: oklch(1 0 0);
            --secondary: oklch(0.97 0.01 60);
            --secondary-foreground: oklch(0.2 0.02 40);
            --muted-foreground: oklch(0.5 0.02 50);
            --accent: oklch(0.96 0.04 60);
            --accent-foreground: oklch(0.3 0.18 36);
            --border: oklch(0.929 0.013 255.508);
            --gradient-hero: linear-gradient(135deg, oklch(0.65 0.245 36), oklch(0.72 0.21 45));
            --gradient-soft: linear-gradient(180deg, oklch(0.985 0.015 60), oklch(1 0 0));
            --shadow-card: 0 2px 12px -2px oklch(0.65 0.245 36 / 0.08);
            --shadow-elevated: 0 12px 40px -12px oklch(0.65 0.245 36 / 0.25);
          }
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'DM Sans',sans-serif;color:var(--foreground);background:oklch(0.985 0.005 60);-webkit-font-smoothing:antialiased}
          a{text-decoration:none;color:inherit}
          input,button{font-family:'DM Sans',sans-serif}
          input:focus{outline:none}
          ::-webkit-scrollbar{height:3px;background:transparent}
          ::-webkit-scrollbar-thumb{background:oklch(0.85 0.01 60);border-radius:99px}
          @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
          @keyframes spin{to{transform:rotate(360deg)}}
          @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
          .fade{animation:fadeUp .3s ease both}
          .skel{background:linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%);background-size:200%;animation:shimmer 1.4s infinite;border-radius:14px}
        `}</style>
      </Head>

      {/* TOP BAR */}
      <div style={{ background:'var(--primary)', color:'var(--primary-foreground)', fontSize:12, padding:'6px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <span>📍 {cepSalvo ? `${cepSalvo.cidade}, ${cepSalvo.estado}` : localizacao ? `${localizacao.cidade}, ${localizacao.estado}` : 'Digite seu CEP para ver ofertas locais'}</span>
        <span style={{ display:"none" }}>Compare em +150 farmácias · Economize até 70%</span>
      </div>

      {/* NAV */}
      <header style={{ position:'sticky', top:0, zIndex:50, background:'rgba(255,255,255,.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', height:60, display:'flex', alignItems:'center', gap:20 }}>
          <Link href="/" onClick={() => { setResultados(null); setMostrarFarmacias(false) }} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height:38 }} />
          </Link>
          <div style={{ flex:1 }} />
          <Link href="/cidades" style={{ fontSize:14, color:'var(--muted-foreground)', display:'flex', alignItems:'center', gap:4 }}>🏥 Farmácias</Link>
          <Link href="/remedios" style={{ fontSize:14, color:'var(--muted-foreground)', display:'flex', alignItems:'center', gap:4 }}>💊 Remédios</Link>
          <Link href="/bulas" style={{ fontSize:14, color:'var(--muted-foreground)', display:'flex', alignItems:'center', gap:4 }}>📋 Bulas</Link>
        </div>

        {/* CATEGORIAS */}
        <nav style={{ borderTop:'1px solid var(--border)', background:'var(--background)' }}>
          <div style={{ maxWidth:1200, margin:'0 auto', padding:'4px 8px', display:'flex', alignItems:'center', gap:4 }}>
            <button onClick={() => setCatPage(p => Math.max(0, p-1))} disabled={catPage===0}
              style={{ flexShrink:0, width:32, height:32, borderRadius:'50%', border:'none', background:'var(--primary)', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity: catPage===0 ? 0.3 : 1, fontSize:18, fontWeight:'bold' }}>
              ‹
            </button>
            <div style={{ flex:1, display:'flex', gap:4, overflow:'hidden' }}>
              {CATEGORIAS.slice(catPage*4, catPage*4+4).map(cat => (
                <button key={cat.id} onClick={() => setCatAtiva(catAtiva?.id === cat.id ? null : cat)}
                  style={{ flex:1, fontSize:11, color: catAtiva?.id===cat.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)', background: catAtiva?.id===cat.id ? 'var(--primary)' : 'none', border:'1px solid var(--border)', padding:'5px 4px', borderRadius:8, cursor:'pointer', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', transition:'all .12s', fontFamily:'inherit', fontWeight: catAtiva?.id===cat.id ? 600 : 400 }}>
                  {cat.label}
                </button>
              ))}
            </div>
            <button onClick={() => setCatPage(p => Math.min(Math.ceil(CATEGORIAS.length/4)-1, p+1))} disabled={catPage>=Math.ceil(CATEGORIAS.length/4)-1}
              style={{ flexShrink:0, width:32, height:32, borderRadius:'50%', border:'none', background:'var(--primary)', color:'white', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', opacity: catPage>=Math.ceil(CATEGORIAS.length/4)-1 ? 0.3 : 1, fontSize:18, fontWeight:'bold' }}>
              ›
            </button>
          </div>
        </nav>
        {catAtiva && (
          <div style={{ background:'var(--accent)', borderBottom:'1px solid var(--border)', padding:'8px 20px', overflowX:'auto' }}>
            <div style={{ maxWidth:1200, margin:'0 auto', display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
              <span style={{ fontSize:12, color:'var(--muted-foreground)', fontWeight:600, marginRight:4 }}>{catAtiva.label}:</span>
              {catAtiva.queries.map(q => (
                <button key={q} onClick={() => { buscar(q); setCatAtiva(null) }}
                  style={{ fontSize:13, padding:'4px 14px', borderRadius:100, border:'1px solid var(--border)', background:'var(--card)', cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      {!temResultados && (
        <section style={{ position:'relative', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'var(--gradient-hero)' }} />
          <div style={{ position:'absolute', inset:0, opacity:.12, backgroundImage:"url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='44' height='44' viewBox='0 0 44 44'><g fill='%23ffffff'><path d='M20 6h4v6h6v4h-6v6h-4v-6h-6v-4h6z'/><circle cx='6' cy='38' r='1.5'/><circle cx='38' cy='4' r='1.5'/></g></svg>\")", backgroundSize:'44px' }} />
          <div style={{ position:'relative', maxWidth:900, margin:'0 auto', padding:'72px 20px', textAlign:'center', color:'var(--primary-foreground)' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)', padding:'5px 14px', borderRadius:100, fontSize:13, fontWeight:600, marginBottom:20 }}>
              ✦ Compare em +150 farmácias
            </span>
            <h1 className="fade" style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:800, lineHeight:1.05, letterSpacing:'-.02em', marginBottom:14, animationDelay:'.05s' }}>
              Ache seu remédio pelo<br/><span style={{ color:'#fff' }}>menor preço da cidade</span>
            </h1>
            <p className="fade" style={{ fontSize:17, opacity:.9, marginBottom:28, animationDelay:'.1s' }}>
              Busque o medicamento e mostramos as melhores ofertas em segundos.
            </p>

            {/* SEARCH */}
            <div className="fade" style={{ maxWidth:680, margin:'0 auto', animationDelay:'.15s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, background:'var(--card)', borderRadius:20, padding:8, boxShadow:'var(--shadow-elevated)', position:'relative' }}>
                <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, padding:'0 12px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                  <input ref={inputRef} type="text" value={remedio} onChange={e => handleRemedioChange(e.target.value)} onKeyDown={e => e.key==='Enter' && buscar()}
                    placeholder="Buscar por remédio, princípio ativo ou marca..."
                    style={{ height:48, width:'100%', background:'transparent', fontSize:15, color:'var(--foreground)', border:'none' }} />
                </div>
                <button onClick={() => buscar()} disabled={loading}
                  style={{ height:48, padding:'0 24px', background:'var(--primary)', color:'var(--primary-foreground)', border:'none', borderRadius:14, fontSize:15, fontWeight:700, cursor:'pointer', transition:'filter .15s', whiteSpace:'nowrap' }}
                  onMouseOver={e => e.currentTarget.style.filter='brightness(1.1)'}
                  onMouseOut={e => e.currentTarget.style.filter='brightness(1)'}>
                  {loading ? 'Buscando...' : 'Comparar →'}
                </button>

                {sugestoes.length > 0 && (
                  <div style={{ position:'absolute', top:'calc(100% + 8px)', left:0, right:0, background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, boxShadow:'var(--shadow-elevated)', zIndex:50, overflow:'hidden' }}>
                    {sugestoes.map(s => (
                      <div key={s.slug} onMouseDown={() => { setRemedio(s.nome); setSugestoes([]); setTimeout(() => buscar(s.nome), 80) }}
                        style={{ padding:'12px 18px', fontSize:14, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center', color:'var(--foreground)' }}
                        onMouseOver={e => e.currentTarget.style.background='var(--secondary)'}
                        onMouseOut={e => e.currentTarget.style.background='transparent'}>
                        <span style={{ fontWeight:600 }}>💊 {s.nome}</span>
                        <span style={{ fontSize:12, color:'var(--muted-foreground)', background:'var(--secondary)', padding:'2px 8px', borderRadius:100 }}>{s.categoria}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display:'flex', flexWrap:'wrap', justifyContent:'center', gap:8, marginTop:16, fontSize:13, color:'rgba(255,255,255,.8)' }}>
                <span>Populares:</span>
                {['Dipirona','Paracetamol','Ibuprofeno','Omeprazol','Losartana'].map(r => (
                  <button key={r} onMouseDown={() => buscar(r)}
                    style={{ background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)', border:'none', color:'#fff', padding:'3px 12px', borderRadius:100, cursor:'pointer', fontSize:13, fontFamily:'inherit', transition:'background .12s' }}
                    onMouseOver={e => e.target.style.background='rgba(255,255,255,.28)'}
                    onMouseOut={e => e.target.style.background='rgba(255,255,255,.18)'}>
                    {r}
                  </button>
                ))}
              </div>
              {erro && <p style={{ marginTop:12, fontSize:13, color:'#ffd4be' }}>⚠️ {erro}</p>}

              {/* CEP BLOCK */}
              <div style={{ marginTop:16, display:'flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.15)', backdropFilter:'blur(8px)', borderRadius:16, padding:8, maxWidth:500, margin:'16px auto 0' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.9)" strokeWidth="2" style={{ flexShrink:0, marginLeft:6 }}><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg>
                {cepSalvo ? (
                  <span style={{ flex:1, fontSize:13, color:'#fff', textAlign:'left' }}>
                    Entregando em <strong>{cepSalvo.cidade}/{cepSalvo.estado}</strong> · CEP {cepSalvo.cep}
                  </span>
                ) : (
                  <input type="text" value={cep} maxLength={9}
                    onChange={e => handleCEPChange(e.target.value)}
                    placeholder="Informe seu CEP para ver ofertas próximas"
                    style={{ flex:1, height:36, background:'transparent', border:'none', fontSize:13, color:'#fff', outline:'none', '::placeholder': { color:'rgba(255,255,255,.7)' } }} />
                )}
                {cepSalvo ? (
                  <button onClick={() => { setCepSalvo(null); setCep('') }}
                    style={{ fontSize:12, fontWeight:700, background:'rgba(255,255,255,.2)', color:'#fff', border:'none', padding:'6px 12px', borderRadius:10, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap' }}>
                    Alterar
                  </button>
                ) : (
                  <button onClick={() => salvarCep()}
                    style={{ fontSize:13, fontWeight:700, background:'var(--card)', color:'var(--primary)', border:'none', padding:'7px 16px', borderRadius:10, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
                    ✓ Usar CEP
                  </button>
                )}
              </div>
              <p style={{ marginTop:8, fontSize:11, color:'rgba(255,255,255,.7)' }}>
                <a href="https://buscacepinter.correios.com.br/app/endereco/index.php" target="_blank" rel="noreferrer" style={{ color:'rgba(255,255,255,.8)', textDecoration:'underline' }}>Não sei meu CEP</a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* SEARCH BAR COMPACTA (quando tem resultados) */}
      {temResultados && (
        <div style={{ background:'var(--card)', borderBottom:'1px solid var(--border)', padding:'12px 20px' }}>
          <div style={{ maxWidth:900, margin:'0 auto', display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ flex:1, display:'flex', alignItems:'center', gap:10, background:'var(--secondary)', borderRadius:12, padding:'0 14px', height:44, position:'relative' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--muted-foreground)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input type="text" value={remedio} onChange={e => handleRemedioChange(e.target.value)} onKeyDown={e => e.key==='Enter' && buscar()}
                placeholder="Buscar outro remédio..."
                style={{ flex:1, background:'transparent', border:'none', fontSize:14, color:'var(--foreground)' }} />
              {sugestoes.length > 0 && (
                <div style={{ position:'absolute', top:'calc(100% + 6px)', left:0, right:0, background:'var(--card)', border:'1px solid var(--border)', borderRadius:12, boxShadow:'var(--shadow-elevated)', zIndex:50, overflow:'hidden' }}>
                  {sugestoes.map(s => (
                    <div key={s.slug} onMouseDown={() => { setRemedio(s.nome); setSugestoes([]); setTimeout(() => buscar(s.nome), 80) }}
                      style={{ padding:'10px 14px', fontSize:13, cursor:'pointer', display:'flex', justifyContent:'space-between', color:'var(--foreground)' }}
                      onMouseOver={e => e.currentTarget.style.background='var(--secondary)'}
                      onMouseOut={e => e.currentTarget.style.background='transparent'}>
                      💊 {s.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => buscar()} disabled={loading}
              style={{ height:44, padding:'0 20px', background:'var(--primary)', color:'var(--primary-foreground)', border:'none', borderRadius:12, fontSize:14, fontWeight:700, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit' }}>
              {loading ? '...' : 'Buscar →'}
            </button>
            <button onClick={() => { setResultados(null); setFarmaciasProximas(null); setMostrarFarmacias(false); setRemedio(''); setQuery(''); setErro(null); setTimeout(() => inputRef.current?.focus(), 100) }}
              style={{ height:44, padding:'0 14px', background:'var(--secondary)', color:'var(--muted-foreground)', border:'none', borderRadius:12, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>
              ✕
            </button>
          </div>
        </div>
      )}

      <main style={{ maxWidth: temResultados ? 900 : 1200, margin:'0 auto', padding:'0 20px 60px', transition:'max-width .3s' }}>

        {/* TRUST */}
        {!temResultados && (
          <section style={{ borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)', background:'var(--gradient-soft)', padding:'32px 0', margin:'0 -20px' }}>
            <div style={{ maxWidth:1200, margin:'0 auto', padding:'0 20px', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:20 }}>
              {[
                { icon:'🛒', title:'Compre Online', desc:'Nas farmácias da sua região e receba em minutos.' },
                { icon:'📍', title:'Farmácias Próximas', desc:'Encontre todas as informações das farmácias perto de você.' },
                { icon:'🔍', title:'Compare Preços', desc:'Saiba se está pagando mais caro pelo preço médio.' },
                { icon:'🕐', title:'24h Online', desc:'Encontre remédios a qualquer hora do dia.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} style={{ display:'flex', alignItems:'flex-start', gap:12 }}>
                  <div style={{ width:40, height:40, borderRadius:10, background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:700, color:'var(--foreground)', marginBottom:3 }}>{title}</div>
                    <div style={{ fontSize:12, color:'var(--muted-foreground)', lineHeight:1.5 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESULTADOS */}
        {temResultados && (
          <div style={{ paddingTop:24 }}>
            {loading ? (
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[1,2,3,4].map(i => <div key={i} className="skel" style={{ height:100 }} />)}
              </div>
            ) : resultados?.length === 0 ? (
              <div style={{ textAlign:'center', padding:'60px 20px' }}>
                <div style={{ fontSize:48, marginBottom:12 }}>🔍</div>
                <p style={{ fontSize:16, fontWeight:700, marginBottom:6 }}>Nenhum resultado para "{query}"</p>
                <p style={{ fontSize:14, color:'var(--muted-foreground)' }}>Tente o princípio ativo — ex: "dipirona" em vez de "Neosaldina"</p>
              </div>
            ) : (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20, flexWrap:'wrap', gap:10 }}>
                  <div>
                    <p style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--primary)', marginBottom:4 }}>Resultado da busca</p>
                    <h2 style={{ fontSize:24, fontWeight:800, letterSpacing:'-.01em', color:'var(--foreground)', marginBottom:4 }}>{query}</h2>
                    <p style={{ fontSize:14, color:'var(--muted-foreground)' }}>
                      <strong style={{ color:'var(--foreground)' }}>{resultados.length} farmácias</strong>
                      {economia && <> · Economize até <strong style={{ color:'var(--primary)' }}>R$ {economia}</strong></>}
                      {localizacao && <> · 📍 {localizacao.cidade}</>}
                    </p>
                  </div>
                  <div style={{ display:'flex', gap:8 }}>
                    {[['preco','Menor preço'],['vendidos','Mais vendido']].map(([val,label]) => (
                      <button key={val} onClick={() => setOrdem(val)} style={{ padding:'7px 16px', borderRadius:100, fontSize:13, fontWeight:600, cursor:'pointer', border:'none', fontFamily:'inherit', background: ordem===val ? 'var(--foreground)' : 'var(--secondary)', color: ordem===val ? 'var(--background)' : 'var(--foreground)', transition:'all .15s' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {bulaInfo && (
                  <div style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:16, padding:'16px 20px', marginBottom:16 }}>
                    <div style={{ fontSize:11, fontWeight:700, textTransform:'uppercase', letterSpacing:'.07em', color:'var(--primary)', marginBottom:6 }}>💊 Sobre o medicamento</div>
                    <p style={{ fontSize:14, color:'var(--muted-foreground)', lineHeight:1.6 }}>
                      {bulaInfo.html_conteudo
                        ? bulaInfo.html_conteudo.slice(0, bulaExpanded ? 800 : 200) + '...'
                        : 'Informações sobre este medicamento em breve.'}
                    </p>
                    <div style={{ display:'flex', gap:8, marginTop:10, flexWrap:'wrap' }}>
                      {bulaInfo.html_conteudo && (
                        <button onClick={() => setBulaExpanded(prev => !prev)}
                          style={{ fontSize:12, color:'var(--primary)', background:'none', border:'1px solid var(--primary)', padding:'4px 12px', borderRadius:100, cursor:'pointer', fontFamily:'inherit' }}>
                          {bulaExpanded ? 'Ver menos ↑' : 'Ver mais ↓'}
                        </button>
                      )}
                      <a href={'/bula/' + bulaInfo.slug}
                        style={{ fontSize:12, color:'var(--primary-foreground)', background:'var(--primary)', padding:'4px 12px', borderRadius:100, textDecoration:'none' }}>
                        Bula completa →
                      </a>
                    </div>
                  </div>
                )}
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {visiveis.map((r, i) => <ResultCard key={i} offer={r} rank={i} />)}
                </div>

                {!mostrarTodos && resultados.length > 6 && (
                  <div style={{ textAlign:'center', marginTop:20 }}>
                    <button onClick={() => setMostrarTodos(true)}
                      style={{ padding:'12px 28px', background:'var(--secondary)', color:'var(--foreground)', border:'1px solid var(--border)', borderRadius:12, fontSize:14, fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                      Ver mais {resultados.length - 6} farmácias ↓
                    </button>
                  </div>
                )}

                {/* FARMÁCIAS FÍSICAS */}
                {farmaciasProximas && mostrarFarmacias && (
                  <div style={{ marginTop:40 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                      <div>
                        <p style={{ fontSize:11, fontWeight:700, color:'var(--primary)', textTransform:'uppercase', letterSpacing:'.07em', marginBottom:4 }}>Farmácias físicas próximas</p>
                        <h3 style={{ fontSize:16, fontWeight:700, color:'var(--foreground)' }}>{farmaciasProximas.farmacias.length} farmácias em {farmaciasProximas.cidade}</h3>
                      </div>
                      <button onClick={() => setMostrarFarmacias(false)} style={{ fontSize:13, color:'var(--muted-foreground)', background:'none', border:'none', cursor:'pointer' }}>Ocultar</button>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:10 }}>
                      {farmaciasProximas.farmacias.map((f, i) => (
                        <div key={i} style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 16px', display:'flex', gap:12 }}>
                          <div style={{ width:36, height:36, background:'var(--accent)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>💊</div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ fontSize:13, fontWeight:700, color:'var(--foreground)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.nome}</div>
                            <div style={{ fontSize:12, color:'var(--muted-foreground)', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.endereco}</div>
                            {f.avaliacao && <div style={{ fontSize:11, color:'oklch(0.78 0.16 85)', marginTop:4 }}>⭐ {f.avaliacao}</div>}
                          </div>
                          <a href={`https://www.google.com/maps/place/?q=place_id:${f.place_id}`} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize:11, color:'var(--primary)', border:'1px solid', borderColor:'var(--primary)', padding:'4px 8px', borderRadius:8, whiteSpace:'nowrap', alignSelf:'flex-start' }}>
                            Mapa
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {farmaciasProximas && !mostrarFarmacias && (
                  <button onClick={() => setMostrarFarmacias(true)}
                    style={{ marginTop:20, width:'100%', padding:'12px', background:'var(--card)', border:'1.5px dashed oklch(0.75 0.12 60)', borderRadius:14, fontSize:14, color:'var(--primary)', fontWeight:600, cursor:'pointer', fontFamily:'inherit' }}>
                    📍 Ver {farmaciasProximas.farmacias.length} farmácias físicas próximas
                  </button>
                )}
              </>
            )}
          </div>
        )}

        {/* HOME SECTIONS */}
        {!temResultados && (
          <>
            <div style={{ paddingTop:40 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--primary)', marginBottom:14 }}>Remédios populares</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(185px,1fr))', gap:10 }}>
                {REMEDIOS.slice(0,8).map(r => (
                  <button key={r.slug} onClick={() => buscar(r.principio)}
                    style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'14px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', textAlign:'left', fontFamily:'inherit', transition:'all .15s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.boxShadow='var(--shadow-card)'; e.currentTarget.style.transform='translateY(-1px)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--foreground)', marginBottom:2 }}>{r.nome}</div>
                      <div style={{ fontSize:11, color:'var(--muted-foreground)' }}>{r.categoria}</div>
                    </div>
                    <span style={{ color:'var(--primary)', fontSize:16 }}>→</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginTop:40 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em', color:'var(--primary)', marginBottom:14 }}>Farmácias por cidade</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(165px,1fr))', gap:10 }}>
                {CIDADES.slice(0,12).map(c => (
                  <Link key={c.slug} href={`/cidade/${c.slug}`}
                    style={{ background:'var(--card)', border:'1px solid var(--border)', borderRadius:14, padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center', transition:'all .15s' }}
                    onMouseOver={e => { e.currentTarget.style.borderColor='var(--primary)'; e.currentTarget.style.boxShadow='var(--shadow-card)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none' }}>
                    <div>
                      <div style={{ fontSize:13, fontWeight:700, color:'var(--foreground)' }}>{c.nome}</div>
                      <div style={{ fontSize:11, color:'var(--muted-foreground)', marginTop:1 }}>{c.estado}</div>
                    </div>
                    <span style={{ color:'var(--primary)' }}>→</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      {/* FOOTER */}
      <footer style={{ borderTop:'1px solid var(--border)', background:'var(--secondary)', padding:'24px 20px', textAlign:'center' }}>
        <div style={{ maxWidth:1200, margin:'0 auto', fontSize:12, color:'var(--muted-foreground)' }}>
          © {new Date().getFullYear()} FarmáciaAí · Comparador de preços de medicamentos. Os preços podem variar conforme a farmácia.
        </div>
      </footer>
    </>
  )
}
