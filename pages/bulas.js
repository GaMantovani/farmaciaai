// pages/bulas.js — Listagem de todas as bulas
import Head from 'next/head'
import Link from 'next/link'
import { BULAS } from '../lib/bulas'

const OG = 'linear-gradient(135deg,#ff6b1a,#ff4500)'

export default function BulasPage() {
  const categorias = [...new Set(BULAS.map(b => b.categoria))]
  return (
    <>
      <Head>
        <title>Bulas de Remédios — Indicações e Posologia | FarmáciaAí</title>
        <meta name="description" content="Bulas completas de medicamentos. Indicações, posologia, contraindicações e compare preços nas farmácias." />
      </Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',sans-serif;color:#222;background:#f8f9fb;-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}`}</style>

      <nav style={{ position:'sticky',top:0,zIndex:100,background:'rgba(255,255,255,.96)',backdropFilter:'blur(12px)',borderBottom:'1px solid #f0f0f0',boxShadow:'0 1px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',padding:'0 20px',height:64,display:'flex',alignItems:'center',justifyContent:'space-between' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:40,width:'auto' }} /></Link>
          <Link href="/" style={{ fontSize:14,fontWeight:600,color:'#fff',background:OG,padding:'9px 20px',borderRadius:10 }}>Comparar preços</Link>
        </div>
      </nav>

      <div style={{ background:'linear-gradient(160deg,#fff8f5,#fff)',borderBottom:'1px solid #ffe8db',padding:'48px 20px' }}>
        <div style={{ maxWidth:700,margin:'0 auto',textAlign:'center' }}>
          <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.08em',textTransform:'uppercase',marginBottom:12 }}>Informação de saúde</div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif",fontSize:'clamp(28px,5vw,46px)',color:'#111',lineHeight:1.1,marginBottom:14 }}>
            Bulas de <em style={{ color:'#ff4500',fontStyle:'italic' }}>remédios</em>
          </h1>
          <p style={{ fontSize:16,color:'#666',lineHeight:1.65 }}>
            Informações completas sobre indicações, posologia, contraindicações e compare preços nas farmácias.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:1100,margin:'0 auto',padding:'40px 20px 64px' }}>
        {categorias.map(cat => (
          <div key={cat} style={{ marginBottom:36 }}>
            <div style={{ fontSize:12,fontWeight:700,color:'#ff4500',letterSpacing:'.07em',textTransform:'uppercase',marginBottom:14 }}>{cat}</div>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:12 }}>
              {BULAS.filter(b=>b.categoria===cat).map(b=>(
                <Link key={b.slug} href={`/bula/${b.slug}`}
                  style={{ background:'#fff',border:'1px solid #f0f0f0',borderRadius:14,padding:'18px 20px',transition:'all .15s' }}
                  onMouseOver={e=>{e.currentTarget.style.borderColor='#ffb89a';e.currentTarget.style.boxShadow='0 4px 14px rgba(255,90,0,.1)'}}
                  onMouseOut={e=>{e.currentTarget.style.borderColor='#f0f0f0';e.currentTarget.style.boxShadow='none'}}>
                  <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                    <div style={{ fontSize:15,fontWeight:700,color:'#222' }}>{b.nome}</div>
                    <span style={{ fontSize:11,fontWeight:600,background:b.receita?'#fee2e2':'#dcfce7',color:b.receita?'#dc2626':'#16a34a',padding:'2px 8px',borderRadius:100,flexShrink:0,marginLeft:8 }}>
                      {b.receita?'Receita':'Livre'}
                    </span>
                  </div>
                  <div style={{ fontSize:12,color:'#aaa',marginBottom:10 }}>{b.principio_ativo}</div>
                  <div style={{ fontSize:13,color:'#555',lineHeight:1.5 }}>{b.indicacoes.substring(0,80)}...</div>
                  <div style={{ marginTop:12,fontSize:13,color:'#ff4500',fontWeight:600 }}>Ver bula completa →</div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <footer style={{ background:'#111',color:'#666',padding:'28px 20px' }}>
        <div style={{ maxWidth:1100,margin:'0 auto',display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:14,alignItems:'center' }}>
          <Link href="/"><img src="/logo.png" alt="FarmáciaAí" style={{ height:30,filter:'brightness(10)' }} /></Link>
          <div style={{ fontSize:11,color:'#444' }}>As informações são de caráter informativo. Consulte sempre um profissional de saúde.</div>
        </div>
      </footer>
    </>
  )
}
