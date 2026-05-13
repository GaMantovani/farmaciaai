// pages/bula/[slug].js
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

function getNome(bula) {
  if (bula.nome_limpo) return bula.nome_limpo
  // Pega so o nome comercial (antes do nome da empresa)
  const palavras = bula.nome_medicamento.split(' ')
  const idx = palavras.findIndex(p => p.match(/LTDA|S.A|SA$|FARMAC|LABOR|QUIMICA/i))
  return idx > 0 ? palavras.slice(0, idx).join(' ') : palavras.slice(0,2).join(' ')
}

function formatarTexto(texto) {
  if (!texto) return []
  // Divide por padrao "numero. TITULO" onde numero eh 1-2 digitos seguido de espaco e maiusculas
  const textoLimpo = texto.split("Hist").shift() || texto
  const partes = textoLimpo.split(/(?<=\s)(?=[1-9]\d?\.\s+[A-Z]{2})/)
  const result = []
  for (const parte of partes) {
    const p = parte.trim()
    if (!p || p.length < 20) continue
    // Verifica se comeca com numero de secao
    const match = p.match(/^([1-9]\d?\.\s+[A-Z][^?]+\?)(.+)$/s)
    if (match) {
      result.push({ titulo: match[1].trim(), conteudo: match[2].trim() })
    } else {
      result.push({ titulo: null, conteudo: p })
    }
  }
  return result.filter(s => s.conteudo && s.conteudo.length > 20)
}

export default function BulaPage({ bula }) {
  if (!bula) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <h1>Bula nao encontrada</h1>
      <Link href="/bulas" style={{ color:ACCENT }}>Ver todas as bulas</Link>
    </div>
  )

  const nome = getNome(bula)
  const secoes = formatarTexto(bula.html_conteudo)

  return (
    <>
      <Head>
        <title>Bula {nome} {bula.empresa ? `- ${bula.empresa}` : ''} | FarmaciaAi</title>
        <meta name="description" content={`Bula completa do ${nome}${bula.empresa ? ` fabricado por ${bula.empresa}` : ''}. Indicacoes, contraindicacoes e posologia.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/bula/${bula.slug}`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:DM Sans,sans-serif;color:#222;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:900,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmaciaAi" style={{ height:38 }} /></Link>
          <Link href="/" style={{ background:OG,color:'#fff',padding:'8px 18px',borderRadius:10,fontSize:13,fontWeight:700 }}>Comparar precos</Link>
        </div>
      </nav>

      <div style={{ background:OG,padding:'36px 20px 44px' }}>
        <div style={{ maxWidth:900,margin:'0 auto' }}>
          <div style={{ fontSize:13,color:'rgba(255,255,255,.6)',marginBottom:10 }}>
            <Link href="/" style={{ color:'rgba(255,255,255,.7)' }}>Inicio</Link>
            <span style={{ margin:'0 6px' }}>{'>'}</span>
            <Link href="/bulas" style={{ color:'rgba(255,255,255,.7)' }}>Bulas</Link>
            <span style={{ margin:'0 6px' }}>{'>'}</span>
            <span style={{ color:'#fff' }}>{nome}</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(24px,4vw,40px)',color:'#fff',lineHeight:1.1,marginBottom:10 }}>
            {nome}
          </h1>
          <div style={{ display:'flex',gap:10,flexWrap:'wrap' }}>
            {bula.empresa && <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>{bula.empresa}</span>}
            {bula.principio_ativo && <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>{bula.principio_ativo}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 20px 72px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:32 }}>
          {[
            ['Medicamento', nome],
            ...(bula.empresa && bula.nome_medicamento && !bula.nome_medicamento.toUpperCase().includes(bula.empresa.substring(0,8).toUpperCase()) ? [['Fabricante', bula.empresa]] : []),
            ...(bula.principio_ativo ? [['Principio ativo', bula.principio_ativo]] : []),
            ...(bula.numero_registro ? [['Registro ANVISA', bula.numero_registro]] : []),
          ].map(([label,value]) => (
            <div key={label} style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'14px 16px' }}>
              <div style={{ fontSize:10,fontWeight:700,color:'#bbb',textTransform:'uppercase',letterSpacing:'.07em',marginBottom:4 }}>{label}</div>
              <div style={{ fontSize:13,color:'#222',lineHeight:1.5 }}>{value}</div>
            </div>
          ))}
        </div>

        {secoes.length > 0 ? (
          <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'28px 32px',marginBottom:32 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:'#111',marginBottom:24 }}>Bula completa</h2>
            {secoes.map((s, i) => (
              <div key={i} style={{ marginBottom:24 }}>
                {s.titulo && (
                  <h3 style={{ fontSize:15,fontWeight:700,color:ACCENT,marginBottom:8,paddingBottom:6,borderBottom:'2px solid #fff3ee' }}>
                    {s.titulo}
                  </h3>
                )}
                <p style={{ fontSize:14,lineHeight:1.85,color:'#444' }}>{s.conteudo}</p>
              </div>
            ))}
          </div>
        ) : bula.html_conteudo ? (
          <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'28px 32px',marginBottom:32 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:22,color:'#111',marginBottom:20 }}>Bula completa</h2>
            <p style={{ fontSize:14,lineHeight:1.85,color:'#444' }}>{bula.html_conteudo}</p>
          </div>
        ) : (
          <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'28px 32px',marginBottom:32,textAlign:'center' }}>
            <h2 style={{ fontSize:18,fontWeight:600,color:'#111',marginBottom:8 }}>Bula em processamento</h2>
            <p style={{ fontSize:14,color:'#666',marginBottom:20 }}>Consulte a bula oficial no site da ANVISA.</p>
            <a href={`https://consultas.anvisa.gov.br/#/bulario/q/?nomeProduto=${encodeURIComponent(nome)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display:'inline-flex',alignItems:'center',gap:8,background:OG,color:'#fff',padding:'12px 24px',borderRadius:12,fontSize:14,fontWeight:700 }}>
              Ver bula na ANVISA
            </a>
          </div>
        )}

        <div style={{ background:'linear-gradient(135deg,#fff8f5,#fff3ee)',border:'1px solid #ffd4be',borderRadius:20,padding:'26px 28px',marginBottom:32 }}>
          <div style={{ display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:16 }}>
            <div>
              <div style={{ fontSize:11,fontWeight:700,color:ACCENT,textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8 }}>Compare precos</div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif",fontSize:20,color:'#111',marginBottom:6 }}>Encontre {nome} mais barato</h2>
              <p style={{ fontSize:14,color:'#666' }}>Compare precos em farmacias online. Gratuito e em tempo real.</p>
            </div>
            <Link href={`/?q=${encodeURIComponent(nome)}`}
              style={{ background:OG,color:'#fff',padding:'13px 26px',borderRadius:14,fontSize:14,fontWeight:700,whiteSpace:'nowrap',boxShadow:'0 4px 16px rgba(255,69,0,.3)' }}>
              Ver precos
            </Link>
          </div>
        </div>

        <div style={{ display:'flex',justifyContent:'center',gap:12,flexWrap:'wrap' }}>
          <Link href="/bulas" style={{ fontSize:13,color:ACCENT,border:'1px solid #ffb89a',padding:'8px 16px',borderRadius:10 }}>Ver todas as bulas</Link>
          <Link href="/remedios" style={{ fontSize:13,color:'#666',border:'1px solid #e0e0e0',padding:'8px 16px',borderRadius:10 }}>Ver remedios</Link>
        </div>
      </div>

      <footer style={{ background:'#111',color:'#555',padding:'24px 20px',textAlign:'center' }}>
        <div style={{ fontSize:12 }}>FarmaciaAi - Nao vendemos medicamentos.</div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('bulas')
    .select('id, numero_registro, nome_medicamento, empresa, slug, html_conteudo, principio_ativo, situacao, nome_limpo')
    .eq('slug', params.slug)
    .single()

  if (error || !data) return { notFound: true }
  return { props: { bula: data }, revalidate: 86400 }
}
