import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'
const ACCENT = '#ff4500'

export default function NotFound() {
  const router = useRouter()
  const [busca, setBusca] = useState('')

  function buscar(e) {
    e.preventDefault()
    if (busca.trim()) router.push(`/?q=${encodeURIComponent(busca.trim())}`)
  }

  return (
    <>
      <Head>
        <title>Página não encontrada | FarmáciaAí</title>
        <meta name="robots" content="noindex" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#111;background:#f7f8fa;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}input:focus{outline:none}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid #f0f0f0' }}>
        <div style={{ maxWidth:900,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:38 }} /></Link>
          <Link href="/" style={{ background:OG,color:'#fff',padding:'8px 18px',borderRadius:10,fontSize:13,fontWeight:700 }}>Comparar preços</Link>
        </div>
      </nav>

      <div style={{ maxWidth:600,margin:'0 auto',padding:'80px 20px 100px',textAlign:'center' }}>
        <div style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(64px,12vw,96px)',color:'#f0f0f0',lineHeight:1,marginBottom:8 }}>404</div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(22px,4vw,32px)',color:'#111',marginBottom:12 }}>
          Página não encontrada
        </h1>
        <p style={{ fontSize:15,color:'#777',marginBottom:40,lineHeight:1.7 }}>
          A página que você procura não existe ou foi removida.<br />
          Tente buscar o remédio diretamente abaixo.
        </p>

        <form onSubmit={buscar} style={{ display:'flex',gap:8,marginBottom:48 }}>
          <input
            type="text"
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar remédio..."
            style={{ flex:1,height:46,border:'1.5px solid #e0e0e0',borderRadius:12,padding:'0 16px',fontSize:15,fontFamily:'DM Sans,sans-serif',background:'#fff',color:'#111' }}
          />
          <button type="submit"
            style={{ height:46,padding:'0 20px',background:OG,color:'#fff',border:'none',borderRadius:12,fontSize:14,fontWeight:700,cursor:'pointer',whiteSpace:'nowrap' }}>
            Buscar
          </button>
        </form>

        <div style={{ display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:10,marginBottom:40 }}>
          {[
            ['/remedios', '💊', 'Remédios', 'Compare preços de 5.332 medicamentos'],
            ['/bulas', '📄', 'Bulas', 'Consulte bulas de 9.005 medicamentos'],
            ['/cidades', '📍', 'Cidades', 'Farmácias perto de você'],
            ['/produtos', '🧴', 'Produtos', 'Catálogo com 28.476 produtos'],
          ].map(([href, icon, titulo, desc]) => (
            <Link key={href} href={href}
              style={{ background:'#fff',border:'1px solid #efefef',borderRadius:14,padding:'16px',textAlign:'left',display:'block',transition:'border-color .12s' }}
              onMouseOver={e => e.currentTarget.style.borderColor = ACCENT}
              onMouseOut={e => e.currentTarget.style.borderColor = '#efefef'}>
              <div style={{ fontSize:22,marginBottom:6 }}>{icon}</div>
              <div style={{ fontSize:14,fontWeight:700,color:'#111',marginBottom:3 }}>{titulo}</div>
              <div style={{ fontSize:12,color:'#aaa',lineHeight:1.4 }}>{desc}</div>
            </Link>
          ))}
        </div>

        <Link href="/" style={{ fontSize:13,color:ACCENT,border:'1px solid #ffb89a',padding:'9px 20px',borderRadius:10,display:'inline-block' }}>
          ← Voltar ao início
        </Link>
      </div>

      <footer style={{ background:'#111',color:'#555',padding:'24px 20px',textAlign:'center' }}>
        <div style={{ fontSize:12 }}>© {new Date().getFullYear()} FarmáciaAí · Não vendemos medicamentos.</div>
      </footer>
    </>
  )
}
