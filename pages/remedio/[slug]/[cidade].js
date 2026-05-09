// pages/remedio/[slug]/[cidade].js — Template SEO: "Preço de X em Y"
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../../components/Nav'
import Footer from '../../../components/Footer'
import { REMEDIOS, CIDADES, getCidade, getRemedio, gerarPaginasSEO } from '../../../lib/data'

export default function RemedioNaCidade({ remedio, cidade }) {
  if (!remedio || !cidade) return <div>Página não encontrada</div>

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `Qual o menor preço de ${remedio.nome} em ${cidade.nome}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Compare os preços de ${remedio.nome} nas farmácias de ${cidade.nome}, ${cidade.estado}. Use nossa ferramenta de busca por CEP para encontrar o menor preço na sua região.`
        }
      },
      {
        "@type": "Question",
        "name": `${remedio.nome} precisa de receita?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": remedio.receita
            ? `Sim, ${remedio.nome} requer receita médica para ser dispensado.`
            : `Não, ${remedio.nome} pode ser adquirido sem receita médica.`
        }
      },
      {
        "@type": "Question",
        "name": `Existe genérico de ${remedio.principio}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": remedio.generico
            ? `Sim, existem versões genéricas de ${remedio.principio} aprovadas pela ANVISA, com o mesmo princípio ativo e eficácia comprovada, geralmente com preço menor.`
            : `Consulte seu farmacêutico sobre alternativas genéricas disponíveis.`
        }
      }
    ]
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": "https://farmaciaai.com.br" },
      { "@type": "ListItem", "position": 2, "name": cidade.nome, "item": `https://farmaciaai.com.br/cidade/${cidade.slug}` },
      { "@type": "ListItem", "position": 3, "name": remedio.nome },
    ]
  }

  const outrasCoidades = CIDADES.filter(c => c.slug !== cidade.slug).slice(0, 8)
  const outrosRemedios = REMEDIOS.filter(r => r.slug !== remedio.slug && r.categoria === remedio.categoria).slice(0, 4)

  return (
    <>
      <Head>
        <title>Preço de {remedio.nome} em {cidade.nome}, {cidade.estado} | Farmácia.ai</title>
        <meta name="description" content={`Compare o preço de ${remedio.nome} nas farmácias de ${cidade.nome}. Encontre o menor preço e economize. Atualizado diariamente.`} />
        <meta property="og:title" content={`Preço de ${remedio.nome} em ${cidade.nome}`} />
        <meta property="og:description" content={`Compare preços de ${remedio.nome} nas farmácias de ${cidade.nome}, ${cidade.estado}.`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      </Head>
      <Nav />

      {/* HERO ESCURO */}
      <div style={{ background: 'var(--gray-900)', padding: '48px 24px 56px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 20, flexWrap: 'wrap' }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.5)' }}>Início</Link>
            <span>›</span>
            <Link href={`/cidade/${cidade.slug}`} style={{ color: 'rgba(255,255,255,.5)' }}>{cidade.nome}, {cidade.estado}</Link>
            <span>›</span>
            <span>{remedio.nome}</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(26px,4vw,44px)', color: 'var(--white)', lineHeight: 1.15, marginBottom: 16 }}>
            Preço de <em style={{ color: 'var(--orange-400)', fontStyle: 'italic' }}>{remedio.nome}</em>
            <br />em {cidade.nome}, {cidade.estado}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'rgba(255,255,255,.4)' }}>
            <span>⏱ Atualizado hoje</span>
            <span>💊 {remedio.categoria}</span>
            {remedio.generico && <span>✓ Genérico disponível</span>}
            {remedio.receita ? <span>📋 Requer receita</span> : <span>🟢 Sem receita</span>}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 72px' }}>

        {/* BUSCA INLINE */}
        <div style={{ background: 'var(--orange-50)', border: '1px solid var(--orange-100)', borderRadius: 'var(--r-md)', padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--orange-600)', marginBottom: 4 }}>Busca em tempo real</div>
            <div style={{ fontSize: 13, color: 'var(--orange-600)', opacity: .8 }}>Veja os preços atuais de {remedio.principio} nas farmácias</div>
          </div>
          <Link href={`/?q=${encodeURIComponent(remedio.principio)}`} className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>
            Ver preços agora →
          </Link>
        </div>

        {/* SOBRE O MEDICAMENTO */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 32 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Sobre o medicamento</div>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{remedio.descricao}</p>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 10 }}>Como economizar</div>
            <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>
              {remedio.generico
                ? `Genéricos de ${remedio.principio} têm o mesmo efeito terapêutico com preços até 60% menores. Pergunte ao farmacêutico.`
                : 'Compare preços entre as farmácias — a diferença pode ser significativa para o mesmo produto.'}
            </p>
          </div>
        </div>

        {/* MAPA GOOGLE */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 16 }}>
            Farmácias em {cidade.nome} que vendem {remedio.principio.split(' ')[0]}
          </h2>
          <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
            <iframe
              width="100%"
              height="320"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3dTU&q=farmácias+em+${encodeURIComponent(cidade.nome)}+${cidade.estado}&zoom=13`}
              title={`Farmácias em ${cidade.nome}`}
            />
          </div>
          <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 8 }}>
            Mapa mostrando farmácias em {cidade.nome}. Use a busca acima para comparar preços em tempo real.
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 16 }}>Perguntas frequentes</h2>
          {[
            [`Qual o menor preço de ${remedio.nome} em ${cidade.nome}?`, `Use nossa busca em tempo real para ver o menor preço atual de ${remedio.nome} nas farmácias de ${cidade.nome}. Os preços são coletados diretamente dos sites das farmácias e atualizam automaticamente.`],
            [`${remedio.nome} precisa de receita médica?`, remedio.receita ? `Sim, ${remedio.nome} requer receita médica para ser dispensado nas farmácias. Consulte seu médico para obter a prescrição.` : `Não, ${remedio.nome} pode ser adquirido sem receita médica nas farmácias.`],
            [`Existe versão genérica de ${remedio.principio}?`, remedio.generico ? `Sim, existem genéricos de ${remedio.principio} aprovados pela ANVISA. Eles têm o mesmo princípio ativo, mesma eficácia e segurança, com preço geralmente menor. Pergunte ao farmacêutico.` : `Consulte seu farmacêutico sobre alternativas genéricas disponíveis para ${remedio.principio}.`],
            [`Como encontrar a farmácia mais barata em ${cidade.nome}?`, `Use a busca do Farmácia.ai com seu CEP para ver os preços nas farmácias mais próximas de você em ${cidade.nome}. Comparamos Ultrafarma, Drogasil, Droga Raia, Pague Menos e outras automaticamente.`],
          ].map(([q, a], i) => (
            <details key={i} style={{ border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', marginBottom: 8, overflow: 'hidden' }}>
              <summary style={{ padding: '16px 20px', fontSize: 14, fontWeight: 500, color: 'var(--gray-800)', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {q} <span style={{ color: 'var(--gray-400)', marginLeft: 8 }}>+</span>
              </summary>
              <div style={{ padding: '0 20px 16px', fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{a}</div>
            </details>
          ))}
        </div>

        {/* LINK PARA OUTRAS CIDADES */}
        {outrasCoidades.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12 }}>
              Preço de {remedio.principio.split(' ')[0]} em outras cidades
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {outrasCoidades.map(c => (
                <Link key={c.slug} href={`/remedio/${remedio.slug}/${c.slug}`}
                  style={{ fontSize: 13, color: 'var(--orange-600)', background: 'var(--orange-50)', border: '1px solid var(--orange-100)', padding: '5px 12px', borderRadius: 100 }}>
                  {c.nome}, {c.estado}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* REMÉDIOS SIMILARES */}
        {outrosRemedios.length > 0 && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12 }}>
              Outros {remedio.categoria.toLowerCase()}s em {cidade.nome}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {outrosRemedios.map(r => (
                <Link key={r.slug} href={`/remedio/${r.slug}/${cidade.slug}`}
                  style={{ fontSize: 13, color: 'var(--gray-600)', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', padding: '5px 12px', borderRadius: 100 }}>
                  {r.nome}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  const paths = gerarPaginasSEO().map(({ params }) => ({
    params: { slug: params.remedio, cidade: params.cidade }
  }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }) {
  const remedio = getRemedio(params.slug)
  const cidade = getCidade(params.cidade)
  if (!remedio || !cidade) return { notFound: true }
  return {
    props: { remedio, cidade },
    revalidate: 86400, // Regenera a cada 24h (ISR)
  }
}
