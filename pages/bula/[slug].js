// pages/bula/[slug].js
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

function getNome(bula) {
  if (bula.nome_limpo) return bula.nome_limpo
  const palavras = bula.nome_medicamento.split(/\s+/)
  const idx = palavras.findIndex(p => /LTDA|S\.A\b|^SA$|FARMAC|LABOR|QUIMICA|INDUSTRIA|COMERCIO/i.test(p))
  return idx > 0 ? palavras.slice(0, idx).join(' ') : palavras.slice(0, 3).join(' ')
}

// Limpa o campo empresa removendo palavras que são parte do nome do medicamento
function normStr(s) {
  return (s || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

// Remove palavras do remédio que aparecem no início do campo empresa
function limparEmpresa(empresa, nomeLimpo) {
  if (!empresa) return ''
  if (!nomeLimpo) return empresa
  const refWords = new Set(nomeLimpo.split(/\s+/).filter(w => w.length > 2).map(normStr))
  const palavras = empresa.split(/\s+/)
  let inicio = 0
  while (inicio < palavras.length && refWords.has(normStr(palavras[inicio]))) inicio++
  const resultado = palavras.slice(inicio).join(' ').trim()
  return resultado.length > 5 ? resultado : empresa
}

function formatarTexto(texto) {
  if (!texto) return []

  // Corta o histórico de revisões no final (ruído)
  const semHistorico = texto.split(/\b(Hist[oó]rico de Revis|HISTÓRICO DE REVIS)/i)[0]

  // Divide em: preamble (antes de INFORMAÇÕES) + corpo (seções numeradas)
  const infoMatch = semHistorico.search(/INFORMA[ÇC][ÕO]ES\s+(AO PACIENTE|T[ÉE]CNICAS)/i)
  const preamble = infoMatch > 0 ? semHistorico.slice(0, infoMatch) : ''
  const corpo = infoMatch > 0
    ? semHistorico.slice(infoMatch).replace(/^INFORMA[ÇC][ÕO]ES\s+(AO PACIENTE|T[ÉE]CNICAS\s+AOS\s+PROFISSIONAIS\s+DE\s+SA[ÚU]DE)\s*/i, '')
    : semHistorico

  const result = []

  // Extrai blocos do preamble: APRESENTAÇÃO e COMPOSIÇÃO
  if (preamble) {
    const apMatch = preamble.match(/APRESENTA[ÇC][ÕO]ES?\s+(.+?)(?=COMPOSI[ÇC][ÃA]O|USO\s+(ORAL|ADULTO|PEDIAT|TOPIC|INJECT)|$)/si)
    if (apMatch) {
      const conteudo = apMatch[1].replace(/USO\s+(ORAL|ADULTO|PEDI[ÁA]TRICO|T[ÓO]PICO|INJET[ÁA]VEL)[^\n]*/gi, '').trim()
      if (conteudo.length > 15) result.push({ titulo: 'Apresentação', conteudo })
    }

    const compMatch = preamble.match(/COMPOSI[ÇC][ÃA]O\s+(.+?)(?=INFORMA[ÇC]|USO\s+(ORAL|ADULTO)|$)/si)
    if (compMatch && compMatch[1].trim().length > 15) {
      result.push({ titulo: 'Composição', conteudo: compMatch[1].trim() })
    }
  }

  // Divide o corpo nas seções numeradas
  const partes = corpo.split(/(?<=\s|^)(?=[1-9]\d?\.\s+[A-ZÁÉÍÓÚ]{2})/m)
  for (const parte of partes) {
    const p = parte.trim()
    if (!p || p.length < 20) continue
    // Título: "1. PARA QUE ESTE MEDICAMENTO É INDICADO?" ou "1. INDICAÇÕES"
    const match = p.match(/^(\d{1,2}\.\s+[^\n]+?)\s{2,}(.+)$/s) ||
                  p.match(/^(\d{1,2}\.\s+[^?]+\?)\s*(.+)$/s)
    if (match) {
      result.push({ titulo: match[1].trim(), conteudo: match[2].trim() })
    } else if (p.length > 20) {
      result.push({ titulo: null, conteudo: p })
    }
  }

  return result.filter(s => s.conteudo && s.conteudo.length > 20)
}

export default function BulaPage({ bula, remediosComPreco }) {
  if (!bula) return (
    <div style={{ textAlign:'center', padding:60 }}>
      <h1>Bula nao encontrada</h1>
      <Link href="/bulas" style={{ color:ACCENT }}>Ver todas as bulas</Link>
    </div>
  )

  const nome = getNome(bula)
  const empresa = limparEmpresa(bula.empresa, bula.nome_limpo)
  const secoes = formatarTexto(bula.html_conteudo)

  return (
    <>
      <Head>
        <title>Bula {nome}{empresa ? ` — ${empresa}` : ''} | FarmáciaAí</title>
        <meta name="description" content={`Bula completa do ${nome}${empresa ? ` fabricado por ${empresa}` : ''}. Indicações, contraindicações e posologia.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/bula/${bula.slug}`} />
        <meta property="og:title" content={`Bula ${nome}${empresa ? ` — ${empresa}` : ''} | FarmáciaAí`} />
        <meta property="og:description" content={`Bula completa do ${nome}${empresa ? ` fabricado por ${empresa}` : ''}. Indicações, contraindicações e posologia.`} />
        <meta property="og:url" content={`https://farmaciaai.com.br/bula/${bula.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'MedicalWebPage',
          'name': `Bula ${nome}`,
          'url': `https://farmaciaai.com.br/bula/${bula.slug}`,
          'description': `Bula completa do ${nome}. Indicações, contraindicações e posologia.`,
          'about': {
            '@type': 'Drug',
            'name': nome,
            ...(empresa ? { 'manufacturer': { '@type': 'Organization', 'name': empresa } } : {}),
            ...(bula.principio_ativo ? { 'activeIngredient': bula.principio_ativo } : {}),
          },
          'breadcrumb': {
            '@type': 'BreadcrumbList',
            'itemListElement': [
              { '@type': 'ListItem', 'position': 1, 'name': 'Início', 'item': 'https://farmaciaai.com.br' },
              { '@type': 'ListItem', 'position': 2, 'name': 'Bulas', 'item': 'https://farmaciaai.com.br/bulas' },
              { '@type': 'ListItem', 'position': 3, 'name': nome },
            ],
          },
        }) }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:DM Sans,sans-serif;color:#222;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:900,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height:38 }} /></Link>
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
            {empresa && <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>{empresa}</span>}
            {bula.principio_ativo && <span style={{ background:'rgba(255,255,255,.2)',color:'#fff',fontSize:13,padding:'4px 12px',borderRadius:100 }}>{bula.principio_ativo}</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:900,margin:'0 auto',padding:'32px 20px 72px' }}>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:12,marginBottom:32 }}>
          {[
            ['Medicamento', nome],
            ...(empresa ? [['Fabricante', empresa]] : []),
            ...(bula.principio_ativo ? [['Princípio ativo', bula.principio_ativo]] : []),
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

        {remediosComPreco && remediosComPreco.length > 0 && (
          <div style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:16,padding:'20px 24px',marginBottom:16 }}>
            <h2 style={{ fontSize:15,fontWeight:700,color:'#111',marginBottom:4 }}>
              Comparar preço de {nome}
            </h2>
            <p style={{ fontSize:13,color:'#aaa',marginBottom:14 }}>Veja preços em farmácias online e economize</p>
            <div style={{ display:'flex',flexDirection:'column',gap:8 }}>
              {remediosComPreco.map(r => (
                <Link key={r.slug} href={`/remedio/${r.slug}`}
                  style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 14px',background:'#f7f8fa',borderRadius:10,fontSize:13,color:'#333',border:'1px solid transparent',transition:'all .12s' }}
                  onMouseOver={e => { e.currentTarget.style.borderColor=ACCENT; e.currentTarget.style.background='#fff3ee'; e.currentTarget.style.color=ACCENT }}
                  onMouseOut={e => { e.currentTarget.style.borderColor='transparent'; e.currentTarget.style.background='#f7f8fa'; e.currentTarget.style.color='#333' }}>
                  <span>{r.nome}</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                </Link>
              ))}
            </div>
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

  const nomeBase = (data.nome_limpo || data.nome_medicamento || '').split(/\s+/).slice(0, 2).join(' ')
  const { data: meds } = nomeBase
    ? await supabase
        .from('medicamentos')
        .select('slug, nome')
        .ilike('nome', `${nomeBase}%`)
        .eq('tem_preco', true)
        .limit(5)
    : { data: [] }

  const remediosComPreco = (meds || []).map(m => ({ slug: m.slug, nome: m.nome }))

  return { props: { bula: data, remediosComPreco }, revalidate: 86400 }
}
