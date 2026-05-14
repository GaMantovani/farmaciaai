import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import '../styles/globals.css'
import { Analytics } from '@vercel/analytics/next'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
})

const dmSerif = DM_Serif_Display({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
})

export default function App({ Component, pageProps }) {
  return (
    <div className={`${dmSans.variable} ${dmSerif.variable}`} style={{ fontFamily: 'var(--font-sans), DM Sans, sans-serif' }}>
      <Component {...pageProps} />
      <Analytics />
    </div>
  )
}
