// pages/produto/[slug].js — ex: /produto/nivea-sun-fps-50-4005808315062
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../lib/supabase'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

const CATEGORIAS = [
  { re: /DENTAL|DENTIFRICIO|ESCOVA.{0,10}DENT|ENXAGUANTE|FIO.{0,8}DENT|PASTA.{0,8}DENT/i, nome: 'Higiene Bucal' },
  { re: /BARBEAR|BARBEADOR/i, nome: 'Barbear' },
  { re: /SHAMPOO|CONDICIONADOR|CAPILAR|TÔNICO.{0,8}CAPILAR/i, nome: 'Cabelos' },
  { re: /PROTETOR.{0,6}SOLAR|FPS\s+\d|SPF\s+\d/i, nome: 'Protetor Solar' },
  { re: /DESODORANTE|ANTITRANSPIRANTE/i, nome: 'Desodorante' },
  { re: /FRALDA/i, nome: 'Fraldas' },
  { re: /ABSORVENTE/i, nome: 'Absorventes' },
  { re: /VITAMINA|SUPLEMENTO|OMEGA|CALCIO|ZINCO/i, nome: 'Suplementos' },
  { re: /WHEY|CREATINA|PROTEINA/i, nome: 'Suplementos' },
  { re: /SABONETE/i, nome: 'Sabonete' },
  { re: /HIDRATANTE|CREME.{0,8}CORPO|BODY.{0,6}LOTION/i, nome: 'Hidratante' },
  { re: /BATOM|BLUSH|SOMBRA|MAQUIAGEM/i, nome: 'Maquiagem' },
  { re: /CURATIVO|BAND.{0,4}AID|GAZES/i, nome: 'Curativos' },
  { re: /PRESERVATIVO|CAMISINHA/i, nome: 'Preservativos' },
  { re: /PERFUME|COLONIA/i, nome: 'Perfumaria' },
]

const MARCAS_CONHECIDAS = [
  'BEPANTOL','BIODERMA','CETAPHIL','DOVE','EUCERIN','GARNIER','GILLETTE',
  'HIMALAYA','HUGGIES','INTIMUS','JOHNSON','LA ROCHE','LISTERINE','LOREAL',
  'NEUTROGENA','NIVEA','ORAL-B','PAMPERS','PANTENE','PANTENOL','PHILIPS',
  'REXONA','SENSODYNE','SUNDOWN','VICHY',
]

function inferirCategoria(nome) {
  for (const c of CATEGORIAS) {
    if (c.re.test(nome)) return c.nome
  }
  return 'Produto de Farmácia'
}

function inferirMarca(nome) {
  const upper = nome.toUpperCase()
  for (const m of MARCAS_CONHECIDAS) {
    if (upper.includes(m)) return m.charAt(0) + m.slice(1).toLowerCase()
  }
  return null
}

function formatarNome(nome) {
  return nome.split(/\s+/).map(w => {
    if (w.length <= 3 || /\d/.test(w)) return w
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
  }).join(' ')
}

export default function ProdutoPage({ produto, relacionados }) {
  if (!produto) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <h1>Produto não encontrado</h1>
      <Link href="/produtos" style={{ color: ACCENT }}>Ver todos os produtos</Link>
    </div>
  )

  const nome = formatarNome(produto.nome)
  const marca = inferirMarca(produto.nome)
  const categoria = inferirCategoria(produto.nome)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: nome,
    ...(marca && { brand: { '@type': 'Brand', name: marca } }),
    category: categoria,
    gtin13: produto.ean,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'BRL',
      availability: 'https://schema.org/InStock',
    },
  }

  return (
    <>
      <Head>
        <title>{nome} — EAN {produto.ean} | FarmáciaAí</title>
        <meta name="description" content={`Informações sobre ${nome}${marca ? ` da ${marca}` : ''}. EAN ${produto.ean}. Encontre nas melhores farmácias do Brasil.`} />
        <link rel="canonical" href={`https://farmaciaai.com.br/produto/${produto.slug}`} />
        <meta property="og:title" content={`${nome} | FarmáciaAí`} />
        <meta property="og:description" content={`${nome}${marca ? ` - ${marca}` : ''}. EAN ${produto.ean}.`} />
        <meta property="og:url" content={`https://farmaciaai.com.br/produto/${produto.slug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height: 38 }} /></Link>
          <Link href="/" style={{ background: OG, color: '#fff', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>Comparar preços</Link>
        </div>
      </nav>

      <div style={{ background: OG, padding: '36px 20px 44px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginBottom: 10 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.7)' }}>Início</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <Link href="/produtos" style={{ color: 'rgba(255,255,255,.7)' }}>Produtos</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span style={{ color: '#fff' }}>{nome}</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{categoria}</div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(22px,4vw,38px)', color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
            {nome}
          </h1>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {marca && <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 13, padding: '4px 12px', borderRadius: 100 }}>{marca}</span>}
            <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 13, padding: '4px 12px', borderRadius: 100 }}>EAN {produto.ean}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 72px' }}>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 32 }}>
          {[
            ['Produto', nome],
            ...(marca ? [['Fabricante', marca]] : []),
            ['Categoria', categoria],
            ['Código EAN', produto.ean],
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#222', lineHeight: 1.5 }}>{value}</div>
            </div>
          ))}
        </div>

        <div style={{ background: 'linear-gradient(135deg,#fff8f5,#fff3ee)', border: '1px solid #ffd4be', borderRadius: 20, padding: '26px 28px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Compare preços</div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#111', marginBottom: 6 }}>Encontre {nome} mais barato</h2>
              <p style={{ fontSize: 14, color: '#666' }}>Compare preços em farmácias online. Gratuito e em tempo real.</p>
            </div>
            <Link href={`/?q=${encodeURIComponent(produto.nome)}`}
              style={{ background: OG, color: '#fff', padding: '13px 26px', borderRadius: 14, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(255,69,0,.3)' }}>
              Ver preços →
            </Link>
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: '24px 28px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#111', marginBottom: 20 }}>Perguntas frequentes</h2>
          {[
            [`Onde comprar ${nome}?`, `Compare preços de ${nome} em dezenas de farmácias online gratuitamente no FarmáciaAí. Encontre o menor preço com entrega para todo o Brasil.`],
            [`Qual é o código EAN de ${nome}?`, `O código EAN (código de barras) do produto ${nome} é ${produto.ean}.`],
            ...(marca ? [[`${nome} é da marca ${marca}?`, `Sim, ${nome} é um produto${marca ? ` da marca ${marca}` : ''} na categoria ${categoria}.`]] : []),
          ].map(([q, a], i) => (
            <div key={i} style={{ marginBottom: i < 2 ? 20 : 0, paddingBottom: i < 2 ? 20 : 0, borderBottom: i < 2 ? '1px solid #f5f5f5' : 'none' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 6 }}>{q}</div>
              <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </div>

        {relacionados.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#111', marginBottom: 16 }}>Produtos relacionados</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 8 }}>
              {relacionados.map(r => (
                <Link key={r.slug} href={`/produto/${r.slug}`}
                  style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: '#111', lineHeight: 1.4 }}>{formatarNome(r.nome)}</div>
                    <div style={{ fontSize: 11, color: '#ccc', marginTop: 3 }}>EAN {r.ean}</div>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/produtos" style={{ fontSize: 13, color: ACCENT, border: '1px solid #ffb89a', padding: '8px 16px', borderRadius: 10 }}>Ver todos os produtos</Link>
          <Link href="/remedios" style={{ fontSize: 13, color: '#666', border: '1px solid #e0e0e0', padding: '8px 16px', borderRadius: 10 }}>Ver remédios</Link>
        </div>
      </div>

      <footer style={{ background: '#111', color: '#555', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 12 }}>FarmáciaAí · Não vendemos medicamentos.</div>
      </footer>
    </>
  )
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const supabase = getSupabase()

  const { data: produto, error } = await supabase
    .from('produtos')
    .select('id, ean, nome, slug')
    .eq('slug', params.slug)
    .maybeSingle()

  if (error || !produto) return { notFound: true }

  const primeirasPalavras = produto.nome.split(/\s+/).slice(0, 2).join(' ')
  const { data: rel } = await supabase
    .from('produtos')
    .select('ean, nome, slug')
    .ilike('nome', `${primeirasPalavras}%`)
    .neq('slug', params.slug)
    .limit(8)

  return {
    props: {
      produto: { ean: produto.ean, nome: produto.nome, slug: produto.slug },
      relacionados: (rel || []).map(r => ({ ean: r.ean, nome: r.nome, slug: r.slug })),
    },
    revalidate: 86400 * 7,
  }
}
