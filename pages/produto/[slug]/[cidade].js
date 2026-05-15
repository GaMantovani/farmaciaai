// pages/produto/[slug]/[cidade].js — Produto por cidade
import Head from 'next/head'
import Link from 'next/link'
import { getSupabase } from '../../../lib/supabase'

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

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parseCidadeSlug(cidadeSlug) {
  const parts = cidadeSlug.split('-')
  const estado = parts[parts.length - 1].toUpperCase()
  const cidade = parts.slice(0, -1).join(' ').replace(/\b\w/g, c => c.toUpperCase())
  return { cidade, estado }
}

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

export default function ProdutoEmCidade({ produto, farmacias, slug, cidadeSlug, cidade, estado }) {
  if (!produto) return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <h1>Página não encontrada</h1>
      <Link href="/produtos" style={{ color: ACCENT }}>Ver todos os produtos</Link>
    </div>
  )

  const nome = formatarNome(produto.nome)
  const marca = inferirMarca(produto.nome)
  const categoria = inferirCategoria(produto.nome)
  const cidadeNome = `${cidade}, ${estado}`
  const title = `${nome} em ${cidade} — Onde comprar | FarmáciaAí`
  const description = `Onde comprar ${nome}${marca ? ` da ${marca}` : ''} em farmácias de ${cidadeNome}. EAN ${produto.ean}. Compare preços e encontre a melhor oferta.`

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://farmaciaai.com.br/produto/${slug}/${cidadeSlug}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={`https://farmaciaai.com.br/produto/${slug}/${cidadeSlug}`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="FarmáciaAí" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://farmaciaai.com.br' },
            { '@type': 'ListItem', position: 2, name: 'Produtos', item: 'https://farmaciaai.com.br/produtos' },
            { '@type': 'ListItem', position: 3, name: nome, item: `https://farmaciaai.com.br/produto/${slug}` },
            { '@type': 'ListItem', position: 4, name: cidade, item: `https://farmaciaai.com.br/produto/${slug}/${cidadeSlug}` },
          ]
        })}} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'Product',
          'name': nome,
          'gtin13': produto.ean,
          'category': categoria,
          ...(marca ? { 'brand': { '@type': 'Brand', 'name': marca } } : {}),
          'offers': { '@type': 'AggregateOffer', 'priceCurrency': 'BRL', 'availability': 'https://schema.org/InStock', 'areaServed': cidadeNome }
        })}} />
        {farmacias.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'ItemList',
          'name': `Onde comprar ${nome} em ${cidade}`,
          'numberOfItems': farmacias.length,
          'itemListElement': farmacias.map((f,i) => ({
            '@type': 'ListItem', 'position': i+1,
            'item': {
              '@type': 'Pharmacy', 'name': f.nome,
              'address': {
                '@type': 'PostalAddress',
                'streetAddress': f.logradouro||'',
                'addressLocality': f.cidade, 'addressRegion': f.estado, 'addressCountry': 'BR'
              }
            }
          }))
        })}} />}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org', '@type': 'FAQPage',
          'mainEntity': [
            { '@type': 'Question', 'name': `Onde comprar ${nome} em ${cidade}?`,
              'acceptedAnswer': { '@type': 'Answer', 'text': `Encontre ${nome}${marca ? ` da ${marca}` : ''} em farmácias de ${cidadeNome}. Compare preços online com entrega para ${cidade} no FarmáciaAí.` }},
            { '@type': 'Question', 'name': `Qual o EAN de ${nome}?`,
              'acceptedAnswer': { '@type': 'Answer', 'text': `O código EAN de ${nome} é ${produto.ean}. Use esse código para identificar o produto exato em qualquer farmácia de ${cidade}.` }},
          ]
        })}} />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" fetchPriority="high" style={{ height: 38 }} /></Link>
          <Link href={`/?q=${encodeURIComponent(produto.nome)}`} style={{ background: OG, color: '#fff', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700 }}>Comparar preços</Link>
        </div>
      </nav>

      <div style={{ background: OG, padding: '36px 20px 44px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)', marginBottom: 10 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.7)' }}>Início</Link>
            <span style={{ margin: '0 6px' }}>{'>'}</span>
            <Link href="/produtos" style={{ color: 'rgba(255,255,255,.7)' }}>Produtos</Link>
            <span style={{ margin: '0 6px' }}>{'>'}</span>
            <Link href={`/produto/${slug}`} style={{ color: 'rgba(255,255,255,.7)' }}>{nome}</Link>
            <span style={{ margin: '0 6px' }}>{'>'}</span>
            <span style={{ color: '#fff' }}>{cidade}</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,.55)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>{categoria}</div>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 'clamp(22px,4vw,38px)', color: '#fff', lineHeight: 1.15, marginBottom: 12 }}>
            {nome} em {cidade}
          </h1>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, marginBottom: 16 }}>
            {farmacias.length > 0
              ? `${farmacias.length} farmácias em ${cidadeNome}`
              : `Encontre ${nome} em farmácias de ${cidadeNome}`}
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 13, padding: '4px 12px', borderRadius: 100 }}>📍 {cidadeNome}</span>
            {marca && <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 13, padding: '4px 12px', borderRadius: 100 }}>{marca}</span>}
            <span style={{ background: 'rgba(255,255,255,.2)', color: '#fff', fontSize: 13, padding: '4px 12px', borderRadius: 100 }}>EAN {produto.ean}</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 72px' }}>

        {/* Info do produto */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 12, marginBottom: 32 }}>
          {[
            ['Produto', nome],
            ...(marca ? [['Fabricante', marca]] : []),
            ['Categoria', categoria],
            ['Código EAN', produto.ean],
            ['Cidade', cidadeNome],
          ].map(([label, value]) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: '14px 16px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#222', lineHeight: 1.5 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Compare preços CTA */}
        <div style={{ background: 'linear-gradient(135deg,#fff8f5,#fff3ee)', border: '1px solid #ffd4be', borderRadius: 20, padding: '26px 28px', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 8 }}>Compare preços online</div>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#111', marginBottom: 6 }}>Encontre {nome} mais barato</h2>
              <p style={{ fontSize: 14, color: '#666' }}>Compare preços em farmácias online. Entrega em {cidade} e todo o Brasil.</p>
            </div>
            <Link href={`/?q=${encodeURIComponent(produto.nome)}`}
              style={{ background: OG, color: '#fff', padding: '13px 26px', borderRadius: 14, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(255,69,0,.3)' }}>
              Ver preços →
            </Link>
          </div>
        </div>

        {/* Farmácias na cidade */}
        {farmacias.length > 0 ? (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>
              Farmácias em {cidade} para comprar {nome}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {farmacias.map((f, i) => (
                <Link key={i} href={`/farmacia/${norm(f.cidade)}-${f.estado.toLowerCase()}/${norm(f.bairro) !== norm(f.cidade) && f.bairro ? `${norm(f.bairro)}-${norm(f.nome)}` : norm(f.nome)}`}>
                  <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, cursor: 'pointer' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: i === 0 ? ACCENT : '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: i === 0 ? '#fff' : '#666', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 }}>{f.nome}</div>
                      <div style={{ fontSize: 13, color: '#888' }}>
                        {f.bairro && `${f.bairro} · `}{f.logradouro || cidadeNome}
                      </div>
                    </div>
                    {i === 0 && (
                      <span style={{ background: '#f0fff4', color: '#22c55e', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>
                        Mais próxima
                      </span>
                    )}
                    <span style={{ color: ACCENT, fontSize: 18 }}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: '32px', textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 8 }}>Buscando em {cidade}</h2>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>Compare preços online com entrega para {cidade} e todo o Brasil.</p>
            <Link href={`/?q=${encodeURIComponent(produto.nome)}`} style={{ display: 'inline-block', background: OG, color: '#fff', padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 700 }}>
              Comparar preços online
            </Link>
          </div>
        )}

        {/* Perguntas frequentes */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: '24px 28px', marginBottom: 32 }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 20, color: '#111', marginBottom: 20 }}>Perguntas frequentes</h2>
          {[
            [`Onde comprar ${nome} em ${cidade}?`, `Compare preços de ${nome} em farmácias que entregam em ${cidadeNome}. Use o FarmáciaAí para encontrar o menor preço com frete para sua cidade.`],
            [`Qual o código EAN de ${nome}?`, `O código EAN (código de barras) do produto ${nome} é ${produto.ean}. Use esse código para buscar o produto exato em qualquer farmácia.`],
            ...(marca ? [[`${nome} é da marca ${marca}?`, `Sim, ${nome} é um produto da marca ${marca} na categoria ${categoria}, disponível em farmácias de ${cidadeNome}.`]] : []),
          ].map(([q, a], i, arr) => (
            <div key={i} style={{ marginBottom: i < arr.length - 1 ? 20 : 0, paddingBottom: i < arr.length - 1 ? 20 : 0, borderBottom: i < arr.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#111', marginBottom: 6 }}>{q}</div>
              <div style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>{a}</div>
            </div>
          ))}
        </div>

        {/* Outras cidades */}
        <div style={{ background: '#fff', border: '1px solid #f0f0f0', borderRadius: 16, padding: '24px', marginBottom: 32 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 16 }}>
            {nome} em outras cidades
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {[
              { nome: 'São Paulo', slug: 'sao-paulo-sp' },
              { nome: 'Rio de Janeiro', slug: 'rio-de-janeiro-rj' },
              { nome: 'Belo Horizonte', slug: 'belo-horizonte-mg' },
              { nome: 'Curitiba', slug: 'curitiba-pr' },
              { nome: 'Porto Alegre', slug: 'porto-alegre-rs' },
              { nome: 'Salvador', slug: 'salvador-ba' },
              { nome: 'Fortaleza', slug: 'fortaleza-ce' },
              { nome: 'Recife', slug: 'recife-pe' },
              { nome: 'Manaus', slug: 'manaus-am' },
              { nome: 'Goiânia', slug: 'goiania-go' },
              { nome: 'Campinas', slug: 'campinas-sp' },
              { nome: 'Natal', slug: 'natal-rn' },
            ].filter(c => c.slug !== cidadeSlug).map(c => (
              <Link key={c.slug} href={`/produto/${slug}/${c.slug}`} style={{ background: '#f7f8fa', border: '1px solid #e8e8e8', borderRadius: 8, padding: '6px 14px', fontSize: 13, color: '#444' }}>
                {c.nome}
              </Link>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Link href={`/produto/${slug}`} style={{ fontSize: 13, color: ACCENT, border: '1px solid #ffb89a', padding: '8px 16px', borderRadius: 10 }}>
            ← Voltar para {nome}
          </Link>
          <Link href="/produtos" style={{ fontSize: 13, color: '#666', border: '1px solid #e0e0e0', padding: '8px 16px', borderRadius: 10 }}>
            Ver todos os produtos
          </Link>
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
  const { slug, cidade: cidadeSlug } = params
  const supabase = getSupabase()

  const { data: produto } = await supabase
    .from('produtos')
    .select('id, ean, nome, slug')
    .eq('slug', slug)
    .maybeSingle()

  if (!produto) return { notFound: true }

  const { cidade, estado } = parseCidadeSlug(cidadeSlug)

  const { data: farmacias } = await supabase
    .from('farmacias_fisicas')
    .select('nome, bairro, logradouro, cidade, estado')
    .ilike('cidade', cidade)
    .eq('estado', estado)
    .limit(20)

  return {
    props: {
      produto: { ean: produto.ean, nome: produto.nome, slug: produto.slug },
      farmacias: farmacias || [],
      slug: produto.slug,
      cidadeSlug,
      cidade,
      estado,
    },
    revalidate: 86400,
  }
}
