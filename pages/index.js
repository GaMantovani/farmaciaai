// pages/index.js — Homepage
import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { CIDADES, REMEDIOS } from '../lib/data'

export default function Home() {
  const [cep, setCep] = useState('')
  const [remedio, setRemedio] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [localizacao, setLocalizacao] = useState(null)
  const [erro, setErro] = useState(null)

  function maskCEP(v) {
    const n = v.replace(/\D/g, '').slice(0, 8)
    return n.length > 5 ? n.slice(0,5) + '-' + n.slice(5) : n
  }

  async function buscar() {
    if (!remedio.trim()) { setErro('Digite o nome do remédio'); return }
    setLoading(true); setErro(null); setResultados(null)
    try {
      const params = new URLSearchParams({ q: remedio.trim() })
      if (cep.replace(/\D/g,'').length === 8) params.append('cep', cep)
      const res = await fetch(`/api/buscar?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResultados(data.resultados || [])
      setLocalizacao(data.localizacao)
    } catch (e) {
      setErro(e.message || 'Erro ao buscar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const cidadesDestaque = CIDADES.slice(0, 12)
  const remediosDestaque = REMEDIOS.slice(0, 8)

  return (
    <>
      <Head>
        <title>Farmácia.ai — Compare preços de remédios perto de você</title>
        <meta name="description" content="Compare preços de remédios nas farmácias mais próximas. Digite o CEP e encontre o menor preço na sua região. Grátis." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Farmácia.ai",
          "url": "https://farmaciaai.com.br",
          "description": "Comparador de preços de remédios no Brasil",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://farmaciaai.com.br/?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        })}} />
      </Head>
      <Nav />

      {/* HERO */}
      <section style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)', padding: '80px 24px 64px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div className="badge badge-orange fade-up" style={{ marginBottom: 24, display: 'inline-flex' }}>
            <span style={{ width: 6, height: 6, background: 'var(--grad)', borderRadius: '50%' }} />
            Mais de 5 farmácias comparadas em tempo real
          </div>
          <h1 className="fade-up-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.1, color: 'var(--gray-900)', marginBottom: 16 }}>
            Compare preços de remédios{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--orange-400)' }}>perto de você</em>
          </h1>
          <p className="fade-up-3" style={{ fontSize: 18, color: 'var(--gray-600)', fontWeight: 300, lineHeight: 1.6, marginBottom: 40 }}>
            Digite o CEP e o nome do remédio. Mostramos os melhores preços nas farmácias da sua região.
          </p>

          {/* SEARCH BOX */}
          <div id="busca" className="fade-up-4" style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-xl)', padding: 32, boxShadow: 'var(--sh-lg)' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <div className="input-icon" style={{ flex: 1 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                <input className="input" type="text" placeholder="CEP (opcional)" value={cep} maxLength={9}
                  onChange={e => setCep(maskCEP(e.target.value))}
                  onKeyDown={e => e.key === 'Enter' && buscar()} />
              </div>
              <button className="btn-primary" onClick={buscar} disabled={loading} style={{ whiteSpace: 'nowrap', height: 50, padding: '0 28px' }}>
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <div className="input-icon" style={{ marginBottom: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              <input className="input" type="text" placeholder="Nome do remédio (ex: Dipirona 500mg)"
                value={remedio} onChange={e => setRemedio(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && buscar()} />
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center' }}>Mais buscados:</span>
              {['Dipirona', 'Omeprazol', 'Amoxicilina', 'Losartana', 'Ibuprofeno', 'Paracetamol'].map(r => (
                <button key={r} onClick={() => setRemedio(r)} style={{ fontSize: 12, color: 'var(--gray-600)', background: 'var(--gray-100)', border: '1px solid var(--gray-200)', padding: '4px 10px', borderRadius: 100, transition: 'all .15s' }}
                  onMouseOver={e => { e.target.style.background='var(--orange-50)'; e.target.style.color='var(--orange-600)'; e.target.style.borderColor='var(--orange-400)' }}
                  onMouseOut={e => { e.target.style.background='var(--gray-100)'; e.target.style.color='var(--gray-600)'; e.target.style.borderColor='var(--gray-200)' }}>
                  {r}
                </button>
              ))}
            </div>
            {erro && <p style={{ marginTop: 12, fontSize: 13, color: '#e53e3e' }}>{erro}</p>}
          </div>
        </div>
      </section>

      {/* RESULTADOS */}
      {(loading || resultados) && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
          {localizacao && (
            <p style={{ fontSize: 13, color: 'var(--gray-400)', marginBottom: 12 }}>
              📍 Mostrando resultados para {localizacao.cidade}, {localizacao.estado}
            </p>
          )}
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20 }}>
            {loading ? 'Buscando preços...' : `${resultados.length} resultado${resultados.length !== 1 ? 's' : ''} para "${remedio}"`}
          </h2>

          {loading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
              {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 160, borderRadius: 'var(--r-md)' }} />)}
            </div>
          ) : resultados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--gray-400)' }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>Nenhum resultado encontrado para "{remedio}"</p>
              <p style={{ fontSize: 13 }}>Tente um nome diferente ou verifique a grafia</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14 }}>
              {resultados.map((r, i) => (
                <div key={i} className="card" style={{ padding: 20, position: 'relative', overflow: 'hidden', transition: 'all .2s' }}>
                  {i === 0 && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--grad)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: '0 var(--r-md) 0 var(--r-sm)' }}>
                      Menor preço
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: r.logo_cor, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>{r.farmacia}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 12, lineHeight: 1.4 }}>{r.nome}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)', marginBottom: 2 }}>Preço</div>
                      <div className={`price-display${i === 0 ? ' best' : ''}`}>
                        <sup>R$</sup>{r.preco.toFixed(2).replace('.', ',')}
                      </div>
                    </div>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 18px', fontSize: 13, borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', gap: 6 }}>
                      Ver oferta
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                  <div style={{ marginTop: 10, fontSize: 11, color: 'var(--gray-400)' }}>🚚 {r.entrega}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* STATS */}
      {!resultados && (
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-lg)', overflow: 'hidden', background: 'var(--gray-200)', gap: 1 }}>
            {[['5+', 'farmácias monitoradas'], ['180k+', 'medicamentos'], ['até 60%', 'de economia'], ['tempo real', 'atualização']].map(([num, label]) => (
              <div key={label} style={{ background: 'var(--white)', padding: '32px 24px', textAlign: 'center' }}>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: 'var(--gray-900)', lineHeight: 1 }}>
                  <span style={{ color: 'var(--orange-400)' }}>{num}</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--gray-400)', marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COMO FUNCIONA */}
      <section id="como-funciona" style={{ padding: '72px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-eyebrow">Como funciona</div>
        <div className="section-title" style={{ marginBottom: 40 }}>Encontre o menor preço<br />em 3 passos simples</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 32 }}>
          {[
            ['1', 'Digite o CEP e o remédio', 'Usamos seu CEP para identificar as farmácias mais próximas — físicas e online com entrega na sua região.'],
            ['2', 'Comparamos em tempo real', 'Nosso sistema busca automaticamente os preços nos sites das principais farmácias do Brasil.'],
            ['3', 'Compre na melhor oferta', 'Clique em "Ver oferta" e vá direto para a farmácia com o menor preço. Sem cadastro, sem complicação.'],
          ].map(([num, titulo, desc]) => (
            <div key={num}>
              <div style={{ width: 40, height: 40, background: 'var(--grad)', borderRadius: 'var(--r-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#fff', marginBottom: 16 }}>{num}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 8 }}>{titulo}</div>
              <div style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.7 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REMÉDIOS POPULARES */}
      <section style={{ background: 'var(--gray-50)', borderTop: '1px solid var(--gray-200)', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-eyebrow">Mais buscados</div>
          <div className="section-title" style={{ marginBottom: 32 }}>Remédios populares</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 10 }}>
            {remediosDestaque.map(r => (
              <Link key={r.slug} href={`/remedio/${r.slug}`} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .15s', textDecoration: 'none', color: 'inherit' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='var(--orange-400)'; e.currentTarget.style.boxShadow='var(--sh-sm)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor='var(--gray-200)'; e.currentTarget.style.boxShadow='none' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 2 }}>{r.nome}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{r.categoria}</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/remedios" className="btn-secondary">Ver todos os remédios</Link>
          </div>
        </div>
      </section>

      {/* CIDADES */}
      <section id="cidades" style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-eyebrow">Cobertura nacional</div>
          <div className="section-title" style={{ marginBottom: 32 }}>Preços por cidade</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
            {cidadesDestaque.map(c => (
              <Link key={c.slug} href={`/cidade/${c.slug}`} style={{ background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 'var(--r-md)', padding: '16px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all .15s', textDecoration: 'none', color: 'inherit' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='var(--orange-400)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor='var(--gray-200)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)' }}>{c.nome}, {c.estado}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{(c.populacao/1000000).toFixed(1)}M hab.</div>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gray-400)" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link href="/cidades" className="btn-secondary">Ver todas as cidades</Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
