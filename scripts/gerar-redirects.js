// scripts/gerar-redirects.js
// Gera redirects 301 do site antigo para o novo
// Uso: node scripts/gerar-redirects.js

const fs = require('fs')
const path = require('path')

function norm(str) {
  if (!str) return ''
  return str.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const csvPath = path.join(process.env.HOME, 'Downloads/farmacias_sitemap.csv')
const csv = fs.readFileSync(csvPath, 'utf8')
const linhas = csv.trim().split('\n')

const redirects = []
const vistos = new Set()

for (const linha of linhas) {
  const [estado, cidade, bairro, nome, cnpj] = linha.split(',')
  if (!estado || !cidade || !nome) continue

  // URL antiga: /farmacias-e-drogarias/SP/SAO-PAULO/ACLIMACAO/DROGA-BUENO-LTDA/12345678000190
  const urlAntiga = `/farmacias-e-drogarias/${estado}/${cidade}/${bairro}/${nome}/${cnpj}`

  // URL nova: /farmacia/sao-paulo/aclimacao-droga-bueno-ltda
  const cidadeNorm = norm(cidade)
  const bairroNorm = norm(bairro)
  const nomeNorm = norm(nome)
  const slugFarmacia = bairroNorm && bairroNorm !== cidadeNorm 
    ? `${bairroNorm}-${nomeNorm}` 
    : nomeNorm
  const urlNova = `/farmacia/${cidadeNorm}/${slugFarmacia}`

  const key = urlAntiga
  if (vistos.has(key)) continue
  vistos.add(key)

  redirects.push({ source: urlAntiga, destination: urlNova, permanent: true })
}

console.log(`Total de redirects gerados: ${redirects.length}`)

// Salva como JSON para usar no next.config.js
const outputPath = path.join(process.env.HOME, 'Downloads/farmaciaai/lib/redirects-farmacias.json')
fs.writeFileSync(outputPath, JSON.stringify(redirects, null, 2))
console.log(`Salvo em: ${outputPath}`)
