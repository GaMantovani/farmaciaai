// pages/cidades.js
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { CIDADES } from '../lib/data'

export default function Cidades() {
  const estados = [...new Set(CIDADES.map(c => c.estado))].sort()

  return (
    <>
      <Head>
        <title>Compare remédios por cidade — Farmácia.ai</title>
        <meta name="description" content="Encontre preços de remédios nas farmácias de todas as cidades do Brasil. Cobertura em mais de 30 cidades." />
      </Head>
      <Nav />
      <div style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-eyebrow">Cobertura nacional</div>
          <h1 className="section-title">Preços de remédios por cidade</h1>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {estados.map(estado => {
          const cidades = CIDADES.filter(c => c.estado === estado)
          return (
            <div key={estado} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-400)', marginBottom: 12 }}>{estado}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
                {cidades.map(c => (
                  <Link key={c.slug} href={`/cidade/${c.slug}`}
                    style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'inherit', transition: 'border-color .15s' }}
                    onMouseOver={e => e.currentTarget.style.borderColor='var(--orange-400)'}
                    onMouseOut={e => e.currentTarget.style.borderColor='var(--gray-200)'}>
                    <span style={{ fontSize: 14, fontWeight: 500 }}>{c.nome}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>
      <Footer />
    </>
  )
}
