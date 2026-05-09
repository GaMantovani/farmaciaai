// pages/cidade/[slug].js — Página de cidade com Google Maps
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../../components/Nav'
import Footer from '../../components/Footer'
import { CIDADES, REMEDIOS, getCidade } from '../../lib/data'

export default function CidadePage({ cidade }) {
  if (!cidade) return <div>Cidade não encontrada</div>

  const schema = {
    "@context": "https://schema.org",
    "@type": "City",
    "name": cidade.nome,
    "containedInPlace": { "@type": "State", "name": cidade.estado },
  }

  return (
    <>
      <Head>
        <title>Farmácias e preços de remédios em {cidade.nome}, {cidade.estado} | Farmácia.ai</title>
        <meta name="description" content={`Compare preços de remédios nas farmácias de ${cidade.nome}, ${cidade.estado}. Encontre a farmácia mais barata perto de você.`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Nav />

      <div style={{ background: 'var(--gray-900)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: 6, fontSize: 13, color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,.5)' }}>Início</Link>
            <span>›</span>
            <Link href="/cidades" style={{ color: 'rgba(255,255,255,.5)' }}>Cidades</Link>
            <span>›</span>
            <span>{cidade.nome}, {cidade.estado}</span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px,4vw,44px)', color: 'var(--white)', marginBottom: 12 }}>
            Farmácias em <em style={{ color: 'var(--orange-400)', fontStyle: 'italic' }}>{cidade.nome}</em>
          </h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,.5)' }}>Compare preços de remédios nas farmácias de {cidade.nome}, {cidade.estado}</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 24px 72px' }}>

        {/* BUSCA */}
        <div style={{ background: 'var(--orange-50)', border: '1px solid var(--orange-100)', borderRadius: 'var(--r-md)', padding: '20px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--orange-600)', marginBottom: 4 }}>Buscar remédio em {cidade.nome}</div>
            <div style={{ fontSize: 13, color: 'var(--orange-600)', opacity: .8 }}>Digite o nome do remédio e seu CEP para comparar preços</div>
          </div>
          <Link href="/#busca" className="btn-primary" style={{ fontSize: 14, padding: '10px 20px' }}>Buscar agora →</Link>
        </div>

        {/* MAPA */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Farmácias em {cidade.nome}</h2>
          <div style={{ borderRadius: 'var(--r-md)', overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
            <iframe
              width="100%" height="400" style={{ border: 0, display: 'block' }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps/embed/v1/search?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3dTU&q=farmácias+em+${encodeURIComponent(cidade.nome)}+${cidade.estado}&zoom=12`}
              title={`Mapa de farmácias em ${cidade.nome}`}
            />
          </div>
        </div>

        {/* REMÉDIOS NESSA CIDADE */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Compare preços por remédio em {cidade.nome}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {REMEDIOS.map(r => (
              <Link key={r.slug} href={`/remedio/${r.slug}/${cidade.slug}`}
                style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit', transition: 'border-color .15s' }}
                onMouseOver={e => e.currentTarget.style.borderColor='var(--orange-400)'}
                onMouseOut={e => e.currentTarget.style.borderColor='var(--gray-200)'}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 2 }}>{r.nome}</div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{r.categoria}</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
        </div>

        {/* OUTRAS CIDADES */}
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Outras cidades</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {CIDADES.filter(c => c.slug !== cidade.slug).slice(0, 15).map(c => (
              <Link key={c.slug} href={`/cidade/${c.slug}`}
                style={{ fontSize: 13, color: 'var(--gray-600)', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', padding: '5px 12px', borderRadius: 100 }}>
                {c.nome}, {c.estado}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export async function getStaticPaths() {
  return {
    paths: CIDADES.map(c => ({ params: { slug: c.slug } })),
    fallback: 'blocking',
  }
}

export async function getStaticProps({ params }) {
  const cidade = getCidade(params.slug)
  if (!cidade) return { notFound: true }
  return { props: { cidade }, revalidate: 86400 }
}
