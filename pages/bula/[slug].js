// pages/bula/[slug].js — Página de bula de medicamento
import Head from 'next/head'
import Link from 'next/link'
import { BULAS, getBula } from '../../lib/bulas'
import { CIDADES } from '../../lib/data'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'

export default function BulaPage({ bula }) {
  if (!bula) return <div>Bula não encontrada</div>

  const schema = {
    "@context": "https://schema.org",
    "@type": "Drug",
    "name": bula.nome,
    "activeIngredient": bula.principio_ativo,
    "drugClass": bula.classe,
    "administrationRoute": bula.formas.join(', '),
    "prescriptionStatus": bula.receita ? "PrescriptionOnly" : "OTC",
    "warning": bula.contraindicacoes,
    "description": bula.indicacoes,
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": bula.faq.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a }
    }))
  }

  return (
    <>
      <Head>
        <title>Bula {bula.nome} — Indicações, Posologia e Contraindicações | FarmáciaAí</title>
        <meta name="description" content={`Bula completa do ${bula.nome}. Indicações: ${bula.indicacoes.substring(0,100)}... Veja posologia, contraindicações e compare preços.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/bula/${bula.slug}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://farmaciaai.com.br" },
            { "@type": "ListItem", "position": 2, "name": "Bulas", "item": "https://farmaciaai.com.br/bulas" },
            { "@type": "ListItem", "position": 3, "name": `Bula ${bula.nome}` },
          ]
        })}} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#f8f9fb;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}details summary::-webkit-details-marker{display:none}`}</style>

      {/* NAV */}
      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f0f0f0',boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:40,width:'auto' }} /></Link>
          <Link href={`/?q=${encodeURIComponent(bula.principio_ativo.split(' ')[0])}`}
            style={{ fontSize:14,fontWeight:600,color:'#fff',background:OG,padding:'9px 20px',borderRadius:10 }}>
            Ver preços →
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ background:'#111',padding:'40px 20px 48px' }}>
        <div style={{ maxWidth:900,margin:'0 auto' }}>
          <div style={{ display:'flex',gap:6,fontSize:13,color:'rgba(255,255,255,.4)',marginBottom:16,flexWrap:'wrap' }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.5)' }}>Início</Link>
            <span>›</span>
            <Link href="/bulas" style={{ color:'rgba(255,255,255,.5)' }}>Bulas</Link>
            <span>›</span>
            <span>Bula {bula.nome}</span>
          </div>
          <div style={{ display:'flex',alignItems:'flex-start',gap:16,flexWrap:'wrap' }}>
            <div style={{ width:56,height:56,borderRadius:14,background:OG,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0 }}>💊</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex',gap:8,marginBottom:10,flexWrap:'wrap' }}>
                <span style={{ fontSize:12,fontWeight:700,background:bula.receita?'#fee2e2':'#dcfce7',color:bula.receita?'#dc2626':'#16a34a',padding:'3px 10px',borderRadius:100 }}>
                  {bula.receita ? '📋 Requer receita' : '✓ Sem receita'}
                </span>
                <span style={{ fontSize:12,fontWeight:600,background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.7)',padding:'3px 10px',borderRadius:100 }}>
                  {bula.tarja}
                </span>
                <span style={{ fontSize:12,background:'rgba(255,255,255,.1)',color:'rgba(255,255,255,.6)',padding:'3px 10px',borderRadius:100 }}>
                  {bula.categoria}
                </span>
              </div>
              <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(24px,4vw,42px)',color:'#fff',lineHeight:1.15,marginBottom:8 }}>
                Bula {bula.nome}
              </h1>
              <p style={{ fontSize:14,color:'rgba(255,255,255,.5)' }}>
                Princípio ativo: <strong style={{ color:'rgba(255,255,255,.7)' }}>{bula.principio_ativo}</strong> · {bula.classe}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA COMPARAR PREÇOS */}
      <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',borderBottom:'2px solid #ffd4be',padding:'16px 20px' }}>
        <div style={{ maxWidth:900,margin:'0 auto',display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12 }}>
          <div style={{ fontSize:14,color:'#666' }}>
            💰 Compare o preço de <strong style={{ color:'#ff4500' }}>{bula.nome}</strong> nas principais farmácias
          </div>
          <Link href={`/?q=${encodeURIComponent(bula.principio_ativo.split(' ')[0])}`}
            style={{ background:OG,color:'#fff',padding:'10px 20px',borderRadius:10,fontSize:14,fontWeight:700,boxShadow:'0 4px 12px rgba(255,69,0,.25)',whiteSpace:'nowrap' }}>
            Comparar preços agora →
          </Link>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 20px 64px' }}>

        {/* SUMÁRIO */}
        <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'20px 24px',marginBottom:24 }}>
          <div style={{ fontSize:13,fontWeight:700,color:'#ff4500',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:12 }}>Informações rápidas</div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))',gap:14 }}>
            {[
              ['💊','Formas', bula.formas.slice(0,2).join(', ')],
              ['🏭','Laboratórios', bula.laboratorios.slice(0,2).join(', ')],
              ['📋','Receita', bula.receita ? 'Necessária' : 'Não necessária'],
              ['🔬','Classe', bula.classe.split(' ')[0]],
            ].map(([icon,label,value])=>(
              <div key={label}>
                <div style={{ fontSize:12,color:'#aaa',marginBottom:4 }}>{icon} {label}</div>
                <div style={{ fontSize:13,fontWeight:600,color:'#222' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* SEÇÕES DA BULA */}
        {[
          { id:'indicacoes', titulo:'Para que serve? (Indicações)', conteudo: bula.indicacoes, icon:'✅' },
          { id:'contraindicacoes', titulo:'Contraindicações', conteudo: bula.contraindicacoes, icon:'⚠️' },
          { id:'composicao', titulo:'Composição', conteudo: bula.composicao, icon:'🔬' },
          { id:'mecanismo', titulo:'Como age no organismo', conteudo: bula.mecanismo_acao, icon:'⚙️' },
          { id:'conservacao', titulo:'Como conservar', conteudo: bula.conservacao, icon:'📦' },
          { id:'gravidez', titulo:'Gravidez e amamentação', conteudo: bula.gravidez, icon:'🤰' },
          { id:'superdosagem', titulo:'Superdosagem', conteudo: bula.superdosagem, icon:'🚨' },
        ].map(s=>(
          <div key={s.id} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'20px 24px',marginBottom:14 }}>
            <h2 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:12,display:'flex',alignItems:'center',gap:8 }}>
              <span>{s.icon}</span> {s.titulo}
            </h2>
            <p style={{ fontSize:14,color:'#444',lineHeight:1.8 }}>{s.conteudo}</p>
          </div>
        ))}

        {/* POSOLOGIA */}
        <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'20px 24px',marginBottom:14 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:16,display:'flex',alignItems:'center',gap:8 }}>
            💉 Posologia (Como usar)
          </h2>
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            {Object.entries(bula.posologia).map(([tipo,texto])=>(
              <div key={tipo} style={{ background:'#f8f9fb',borderRadius:10,padding:'14px 16px' }}>
                <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',textTransform:'uppercase',letterSpacing:'.06em',marginBottom:6 }}>
                  {tipo === 'adultos' ? '👤 Adultos' : tipo === 'criancas' ? '👶 Crianças' : '👴 Idosos'}
                </div>
                <p style={{ fontSize:14,color:'#444',lineHeight:1.7 }}>{texto}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop:14,padding:'12px 16px',background:'#fff3ee',borderRadius:10,border:'1px solid #ffd4be' }}>
            <p style={{ fontSize:13,color:'#cc3d00' }}>⚠️ <strong>Atenção:</strong> Sempre siga a orientação do seu médico ou farmacêutico. As doses acima são de referência geral.</p>
          </div>
        </div>

        {/* EFEITOS ADVERSOS */}
        <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'20px 24px',marginBottom:14 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:14,display:'flex',alignItems:'center',gap:8 }}>
            ⚠️ Efeitos adversos (Reações)
          </h2>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
            {bula.efeitos_adversos.map((e,i)=>(
              <span key={i} style={{ fontSize:13,background:'#fff3ee',border:'1px solid #ffd4be',color:'#cc3d00',padding:'5px 12px',borderRadius:100 }}>{e}</span>
            ))}
          </div>
        </div>

        {/* INTERAÇÕES */}
        <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'20px 24px',marginBottom:14 }}>
          <h2 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:14,display:'flex',alignItems:'center',gap:8 }}>
            🔄 Interações medicamentosas
          </h2>
          <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
            {bula.interacoes.map((inter,i)=>(
              <div key={i} style={{ display:'flex',gap:10,alignItems:'flex-start',padding:'10px 14px',background:'#f8f9fb',borderRadius:10 }}>
                <span style={{ color:'#f59e0b',flexShrink:0 }}>⚡</span>
                <span style={{ fontSize:14,color:'#444' }}>{inter}</span>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom:32 }}>
          <h2 style={{ fontSize:18,fontWeight:700,color:'#111',marginBottom:16 }}>Perguntas frequentes sobre {bula.nome}</h2>
          {bula.faq.map((item,i)=>(
            <details key={i} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:12,marginBottom:8,overflow:'hidden' }}>
              <summary style={{ padding:'14px 18px',fontSize:14,fontWeight:600,color:'#222',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center' }}>
                {item.q} <span style={{ color:'#aaa',flexShrink:0,marginLeft:8 }}>+</span>
              </summary>
              <div style={{ padding:'0 18px 14px',fontSize:14,color:'#666',lineHeight:1.7 }}>{item.a}</div>
            </details>
          ))}
        </div>

        {/* CTA FINAL */}
        <div style={{ background:OG,borderRadius:20,padding:'28px 32px',textAlign:'center' }}>
          <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:24,color:'#fff',marginBottom:10 }}>
            Quanto custa {bula.nome} na sua cidade?
          </h2>
          <p style={{ fontSize:14,color:'rgba(255,255,255,.8)',marginBottom:20 }}>
            Compare os preços nas principais farmácias do Brasil gratuitamente
          </p>
          <Link href={`/?q=${encodeURIComponent(bula.principio_ativo.split(' ')[0])}`}
            style={{ display:'inline-block',background:'#fff',color:'#ff4500',padding:'14px 32px',borderRadius:12,fontSize:15,fontWeight:700 }}>
            Ver preços agora →
          </Link>
        </div>

        {/* OUTRAS BULAS */}
        <div style={{ marginTop:32 }}>
          <h3 style={{ fontSize:16,fontWeight:700,color:'#111',marginBottom:14 }}>Outras bulas</h3>
          <div style={{ display:'flex',flexWrap:'wrap',gap:8 }}>
            {BULAS.filter(b=>b.slug!==bula.slug).map(b=>(
              <Link key={b.slug} href={`/bula/${b.slug}`}
                style={{ fontSize:13,color:'#ff4500',background:'#fff3ee',border:'1px solid #ffd4be',padding:'5px 12px',borderRadius:100 }}
                onMouseOver={e=>e.currentTarget.style.background='#ffe8db'}
                onMouseOut={e=>e.currentTarget.style.background='#fff3ee'}>
                {b.nome}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <footer style={{ background:'#111',color:'#666',padding:'28px 20px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:30,filter:'brightness(10)' }} /></Link>
          <div style={{ fontSize:11,color:'#444',maxWidth:500 }}>As informações desta bula são de caráter informativo. Consulte sempre um médico ou farmacêutico antes de usar qualquer medicamento.</div>
        </div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: BULAS.map(b => ({ params: { slug: b.slug } })),
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  const bula = getBula(params.slug)
  if (!bula) return { notFound: true }
  return { props: { bula } }
}
