const https = require('https')
const ws = require('ws')
const { createClient } = require('@supabase/supabase-js')

const SUPABASE_URL = 'https://lbatmgvrqvjchbodzymy.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, { realtime: { transport: ws } })

const MEDICAMENTOS = ['dipirona','paracetamol','ibuprofeno','amoxicilina','omeprazol','losartana','metformina','atorvastatina','azitromicina','cetirizina','sinvastatina','enalapril','levotiroxina','clonazepam','nimesulida','diclofenaco','prednisona','fluoxetina','sertralina','pantoprazol','loratadina','salbutamol','tamsulosina','sildenafila','rosuvastatina','metoprolol','furosemida','glibenclamida','pregabalina','tramadol','ondansetrona','metronidazol','ciprofloxacino','cefalexina','fluconazol','alopurinol','naproxeno','meloxicam','ambroxol','acetilcisteina','carbamazepina','valproato','quetiapina','risperidona','captopril','amlodipino','atenolol']

const FARMACIAS = [
  { id:'drogal', nome:'Drogal', cor:'#c8151b', base:'www.drogal.com.br', entrega:'Interior SP e MG' },
  { id:'drogsp', nome:'Drogaria SP', cor:'#cc0000', base:'www.drogariasaopaulo.com.br', entrega:'Sao Paulo' },
  { id:'promofarma', nome:'PromoFarma', cor:'#00aeef', base:'www.promofarma.com.br', entrega:'Sao Paulo' },
  { id:'paguemenos', nome:'Pague Menos', cor:'#f7941d', base:'www.paguemenos.com.br', entrega:'Todo o Brasil' },
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function buscarVTEX(farmacia, query) {
  return new Promise(resolve => {
    const url = 'https://' + farmacia.base + '/api/catalog_system/pub/products/search/' + encodeURIComponent(query) + '?_from=0&_to=3'
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json' }, timeout: 10000 }, res => {
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => {
        try {
          const produtos = JSON.parse(data)
          if (!Array.isArray(produtos)) return resolve([])
          const resultados = []
          for (const p of produtos.slice(0, 3)) {
            const preco = p.items?.[0]?.sellers?.[0]?.commertialOffer?.Price
            if (preco && preco > 0) {
              resultados.push({
                medicamento: query.toLowerCase(),
                farmacia: farmacia.nome,
                farmacia_id: farmacia.id,
                preco: preco,
                url: 'https://' + farmacia.base + '/' + p.linkText + '/p',
                logo_cor: farmacia.cor,
                entrega: farmacia.entrega,
                disponivel: true
              })
            }
          }
          resolve(resultados)
        } catch(e) { resolve([]) }
      })
    })
    req.on('error', () => resolve([]))
    req.on('timeout', () => { req.destroy(); resolve([]) })
  })
}

async function main() {
  // Limpa tabela antes de começar
  console.log('Limpando tabela...')
  await supabase.from('precos').delete().gte('id', 0)

  console.log('Coletando ' + MEDICAMENTOS.length + ' medicamentos...')
  const todosPre = []

  for (let i = 0; i < MEDICAMENTOS.length; i++) {
    const med = MEDICAMENTOS[i]
    process.stdout.write('[' + (i+1) + '/' + MEDICAMENTOS.length + '] ' + med + '... ')
    const resultados = (await Promise.all(FARMACIAS.map(f => buscarVTEX(f, med)))).flat()
    todosPre.push(...resultados)
    console.log(resultados.length + ' precos')
    await sleep(300)
  }

  // Insere tudo de uma vez em batches de 100
  console.log('\nSalvando ' + todosPre.length + ' precos no Supabase...')
  for (let i = 0; i < todosPre.length; i += 100) {
    const batch = todosPre.slice(i, i + 100)
    const { error } = await supabase.from('precos').insert(batch)
    if (error) console.error('Erro batch ' + i + ':', error.message)
    else process.stdout.write('.')
  }
  console.log('\nFinalizado! ' + todosPre.length + ' precos salvos.')
}

main().catch(console.error)
