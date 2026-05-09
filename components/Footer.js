// components/Footer.js
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div>
            <div className="footer-logo">farmácia.ai</div>
            <div className="footer-tagline">Compare preços de remédios nas farmácias mais próximas de você. Grátis e atualizado.</div>
          </div>
          <div>
            <div className="footer-col-title">Explorar</div>
            <ul className="footer-links">
              <li><Link href="/cidades">Todas as cidades</Link></li>
              <li><Link href="/remedios">Todos os remédios</Link></li>
              <li><Link href="/#como-funciona">Como funciona</Link></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Farmácias</div>
            <ul className="footer-links">
              <li><a href="https://www.ultrafarma.com.br" target="_blank" rel="nofollow noopener">Ultrafarma</a></li>
              <li><a href="https://www.drogasil.com.br" target="_blank" rel="nofollow noopener">Drogasil</a></li>
              <li><a href="https://www.paguemenos.com.br" target="_blank" rel="nofollow noopener">Pague Menos</a></li>
              <li><a href="https://www.drogal.com.br" target="_blank" rel="nofollow noopener">Drogal</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {new Date().getFullYear()} Farmácia.ai — Todos os direitos reservados</div>
          <div className="footer-disclaimer">Os preços são obtidos automaticamente dos sites das farmácias e podem variar. Farmácia.ai não vende medicamentos.</div>
        </div>
      </div>
    </footer>
  )
}
