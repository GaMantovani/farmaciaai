import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <meta name="google-site-verification" content="LlHCOLzz6LCUVhmPVoqJDgprC3G4N_dUz8obWiPBt8A" />
        <link rel="preload" as="image" href="/logo.png" />
        <meta name="twitter:card" content="summary" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
