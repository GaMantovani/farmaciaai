// Google Indexing API — notifica Google sobre URLs novas/atualizadas
// Documentação: https://developers.google.com/search/apis/indexing-api/v3/quickstart
//
// Setup (uma vez por conta):
//   1. Acesse https://console.cloud.google.com
//   2. Crie um projeto (ou use existente)
//   3. Ative a "Indexing API" em APIs & Services > Library
//   4. Crie uma Service Account: IAM & Admin > Service Accounts > Create
//   5. Gere uma chave JSON: Service Account > Keys > Add Key > JSON
//   6. Salve o JSON como scripts/google-service-account.json
//   7. No Google Search Console, adicione o email da service account como "Owner" do site
//      (Site Settings > Users and permissions > Add user — papel: Owner)
//
// Uso:
//   node scripts/google-indexing-api.js               # envia as URLs prioritárias (~1000)
//   node scripts/google-indexing-api.js --all         # envia todas (respeita cota diária)
//   node scripts/google-indexing-api.js --type=meds   # só remédios
//   node scripts/google-indexing-api.js --type=produtos
//   node scripts/google-indexing-api.js --type=farmacias

const fs = require('fs')
const https = require('https')
const path = require('path')
const ws = require('ws')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://lbatmgvrqvjchbodzymy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo'
const BASE = 'https://farmaciaai.com.br'
// Quota: 200 URLs/dia por service account
// Para escalar: crie múltiplas service accounts e passe como --key=caminho.json
const DAILY_QUOTA = 200
const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'google-service-account.json')

function norm(str) {
  if (!str) return ''
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

// Gera JWT para autenticação com a Google Indexing API
function base64url(str) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

async function getAccessToken(serviceAccount) {
  const crypto = require('crypto')
  const now = Math.floor(Date.now() / 1000)
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))
  const payload = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/indexing',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }))
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(`${header}.${payload}`)
  const signature = sign.sign(serviceAccount.private_key, 'base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  const jwt = `${header}.${payload}.${signature}`

  return new Promise((resolve, reject) => {
    const body = `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`
    const req = https.request({
      hostname: 'oauth2.googleapis.com',
      path: '/token',
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => {
        const json = JSON.parse(d)
        if (json.access_token) resolve(json.access_token)
        else reject(new Error(`Token error: ${d}`))
      })
    })
    req.on('error', reject)
    req.write(body); req.end()
  })
}

function submitUrl(url, token) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ url, type: 'URL_UPDATED' })
    const req = https.request({
      hostname: 'indexing.googleapis.com',
      path: '/v3/urlNotifications:publish',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Length': Buffer.byteLength(body),
      },
    }, res => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => resolve({ status: res.statusCode, ok: res.statusCode === 200 }))
    })
    req.on('error', e => resolve({ status: 0, ok: false, error: e.message }))
    req.write(body); req.end()
  })
}

async function main() {
  // Verifica service account
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`\n❌ Service account não encontrada em: ${SERVICE_ACCOUNT_PATH}`)
    console.error('\nSiga os passos no topo deste arquivo para configurar.\n')
    process.exit(1)
  }

  const serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'))
  const args = process.argv.slice(2)
  const typeArg = args.find(a => a.startsWith('--type='))?.split('=')[1]
  const sendAll = args.includes('--all')
  const keyArg = args.find(a => a.startsWith('--key='))?.split('=')[1]
  const altKeyPath = keyArg ? path.join(__dirname, keyArg) : null

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws } })

  console.log('Coletando URLs prioritárias...')
  const urls = []

  // Páginas estáticas sempre incluídas
  urls.push(`${BASE}/`, `${BASE}/remedios`, `${BASE}/produtos`, `${BASE}/cidades`, `${BASE}/bulas`)

  if (!typeArg || typeArg === 'meds') {
    const { data: meds } = await supabase
      .from('medicamentos')
      .select('slug')
      .eq('tem_preco', true)
      .order('slug')
      .limit(sendAll ? 10000 : 100)
    meds?.forEach(m => urls.push(`${BASE}/remedio/${m.slug}`))
    console.log(`  ${meds?.length || 0} remédios`)
  }

  if (!typeArg || typeArg === 'produtos') {
    const { data: prods } = await supabase
      .from('produtos')
      .select('slug')
      .not('slug', 'is', null)
      .order('slug')
      .limit(sendAll ? 10000 : 100)
    prods?.forEach(p => urls.push(`${BASE}/produto/${p.slug}`))
    console.log(`  ${prods?.length || 0} produtos`)
  }

  if (!typeArg || typeArg === 'farmacias') {
    const { data: farmacias } = await supabase
      .from('farmacias_fisicas')
      .select('cidade, estado, bairro, nome')
      .not('nome', 'is', null)
      .not('cidade', 'is', null)
      .limit(sendAll ? 10000 : 50)
    farmacias?.forEach(f => {
      const cidadeSlug = `${norm(f.cidade)}-${f.estado?.toLowerCase()}`
      const slug = f.bairro && norm(f.bairro) !== norm(f.cidade)
        ? `${norm(f.bairro)}-${norm(f.nome)}`
        : norm(f.nome)
      urls.push(`${BASE}/farmacia/${cidadeSlug}/${slug}`)
    })
    console.log(`  ${farmacias?.length || 0} farmácias`)
  }

  // Respeita cota diária
  const toSend = urls.slice(0, DAILY_QUOTA)
  console.log(`\nTotal coletado: ${urls.length} URLs`)
  console.log(`Enviando: ${toSend.length} (cota diária: ${DAILY_QUOTA})\n`)

  console.log('Obtendo token de acesso...')
  const token = await getAccessToken(serviceAccount)
  console.log('✓ Autenticado\n')

  let ok = 0, erros = 0
  for (let i = 0; i < toSend.length; i++) {
    const result = await submitUrl(toSend[i], token)
    if (result.ok) {
      ok++
      if (i % 20 === 0) process.stdout.write(`  ${i + 1}/${toSend.length} ✓\r`)
    } else {
      erros++
      console.log(`  ✗ ${toSend[i]} (${result.status})`)
    }
    // Google aceita até ~20 req/s mas vamos conservador
    if (i % 10 === 9) await sleep(500)
  }

  console.log(`\n✅ Google Indexing API: ${ok} URLs enviadas, ${erros} erros`)
  console.log('Google processará em minutos a horas.')
  console.log('\n💡 Para múltiplas service accounts, rode novamente com --key=outra-conta.json')
}

main().catch(console.error)
