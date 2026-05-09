# Farmácia.ai — Comparador de preços de remédios

## Stack
- **Next.js 14** (React) — SSG + ISR + API Routes
- **Vercel** — hospedagem gratuita, CDN global
- **Cheerio + Axios** — scraping dos sites das farmácias
- **ViaCEP** — geolocalização por CEP (gratuito)
- **Google Maps Embed** — mapa de farmácias por cidade

## Estrutura de páginas

| Rota | Tipo | Descrição |
|------|------|-----------|
| `/` | SSR | Homepage com busca em tempo real |
| `/cidade/[slug]` | SSG | Farmácias por cidade + Google Maps |
| `/remedio/[slug]/[cidade]` | SSG | Preço de remédio em cidade (SEO) |
| `/cidades` | SSG | Listagem de todas as cidades |
| `/remedios` | SSG | Listagem de todos os remédios |
| `/api/buscar` | API | Busca preços em tempo real (scraping) |
| `/sitemap.xml` | SSR | Sitemap dinâmico para Google |

## Como fazer deploy (5 minutos)

### 1. Instalar dependências
```bash
npm install
```

### 2. Testar localmente
```bash
npm run dev
# Acesse http://localhost:3000
```

### 3. Deploy no Vercel (gratuito)
1. Acesse vercel.com e crie conta com GitHub
2. Crie um repositório no GitHub e suba este projeto
3. Na Vercel: "New Project" → importe o repo → Deploy
4. Em 2 minutos o site está no ar

### 4. Adicionar domínio
1. No painel da Vercel: Settings → Domains
2. Adicione farmaciaai.com.br
3. Aponte o DNS no Registro.br para a Vercel

### 5. Ativar Google Maps (para maps reais)
1. Acesse console.cloud.google.com
2. Crie projeto → ative "Maps Embed API"
3. Crie uma API Key
4. Substitua `AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU3dTU` no código pela sua key

## Adicionar mais remédios e cidades
Edite `lib/data.js`:
- `REMEDIOS[]` — adicione novos medicamentos
- `CIDADES[]` — adicione novas cidades

O sitemap e as páginas SEO são gerados automaticamente.

## Adicionar links de afiliado (quando estiver pronto)
Em `pages/remedio/[slug]/[cidade].js`, substitua os links de "Ver oferta" pelos
links rastreados dos programas de afiliados (Awin, etc).

## Scraping — como funciona
O arquivo `lib/scraper.js` busca preços em:
- Ultrafarma
- Drogasil
- Pague Menos
- Drogal
- PromoFarma

Os resultados ficam em cache por 4 horas para não sobrecarregar os sites.
Para produção em escala, substitua o cache por Redis (Upstash — gratuito no Vercel).
