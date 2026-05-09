// components/Nav.js
import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          farmácia<span style={{color:'var(--orange-400)'}}>.ai</span>
          <div className="nav-logo-dot" />
        </Link>
        <div className="nav-links">
          <Link href="/cidades" className="nav-link">Cidades</Link>
          <Link href="/remedios" className="nav-link">Remédios</Link>
          <Link href="/#busca" className="nav-cta">Buscar remédio</Link>
        </div>
      </div>
    </nav>
  )
}
