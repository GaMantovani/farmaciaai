// pages/remedios.js
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { REMEDIOS, CIDADES } from '../lib/data'

export default function Remedios() {
  const categorias = [...new Set(REMEDIOS.map(r => r.categoria))].sort()

  return (
    <>
      <Head>
        <title>Remédios — Compare preços nas farmácias | Farmácia.ai</title>
        <meta name="description" content="Compare preços de remédios nas principais farmácias do Brasil. Analgésicos, antibióticos, anti-hipertensivos e muito mais." />
      </Head>
      <Nav />
      <div style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-eyebrow">Medicamentos</div>
          <h1 className="section-title">Compare preços de remédios</h1>
        </div>
      </div>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
        {categorias.map(cat => {
          const remedios = REMEDIOS.filter(r => r.categoria === cat)
          return (
            <div key={cat} style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-400)', marginBottom: 14 }}>{cat}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
                {remedios.map(r => (
                  <div key={r.slug} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', padding: '16px 18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 2 }}>{r.nome}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{r.principio}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        {r.generico && <span className="badge badge-green">Genérico</span>}
                        {!r.receita && <span className="badge badge-gray">Sem receita</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                      {CIDADES.slice(0, 4).map(c => (
                        <Link key={c.slug} href={`/remedio/${r.slug}/${c.slug}`}
                          style={{ fontSize: 11, color: 'var(--orange-600)', background: 'var(--orange-50)', border: '1px solid var(--orange-100)', padding: '3px 8px', borderRadius: 100 }}>
                          {c.nome}
                        </Link>
                      ))}
                    </div>
                  </div>
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
