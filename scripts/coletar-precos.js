const https = require('https')
const ws = require('ws')
const { createClient } = require('@supabase/supabase-js')

const APIFY_TOKEN = 'apify_api_vmjbQpgi4hhyvA9RC8JJ7hqkdyEk6V0uj8jv'
const ACTOR_ID = 'JWEHgf5HWeoLlbchr'

const supabase = createClient(
  'https://lbatmgvrqvjchbodzymy.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo',
  { realtime: { transport: ws } }
)

const MEDICAMENTOS = [
  // Analgésicos e antitérmicos
  'dipirona 500mg','dipirona 1g','dipirona gotas','paracetamol 500mg','paracetamol 750mg',
  'paracetamol gotas','ibuprofeno 400mg','ibuprofeno 600mg','ibuprofeno 800mg','ibuprofeno suspensao',
  'nimesulida 100mg','diclofenaco 50mg','diclofenaco gel','naproxeno 500mg','cetoprofeno 100mg',
  'piroxicam 20mg','meloxicam 15mg','celecoxibe 200mg','aspirina 100mg','aspirina 500mg',
  'tramadol 50mg','tramadol 100mg','codeina 30mg','butilescopolamina 10mg',
  'neosaldina','dorflex','tylenol','advil','profenid','cataflan','voltaren gel',
  // Antibióticos
  'amoxicilina 500mg','amoxicilina 875mg','amoxicilina suspensao','amoxicilina clavulanato 875mg',
  'azitromicina 500mg','azitromicina 250mg','azitromicina suspensao','claritromicina 500mg',
  'ciprofloxacino 500mg','levofloxacino 500mg','norfloxacino 400mg','moxifloxacino 400mg',
  'cefalexina 500mg','cefadroxila 500mg','ceftriaxona 1g','cefuroxima 500mg',
  'doxiciclina 100mg','minociclina 100mg','tetraciclina 500mg','eritromicina 500mg',
  'metronidazol 400mg','metronidazol gel','tinidazol 500mg','secnidazol 1g',
  'nitrofurantoina 100mg','sulfametoxazol trimetoprima','clindamicina 300mg','ampicilina 500mg',
  'bactrim forte','keflex 500mg','flagyl 400mg','zitromax 500mg','clavulin 875mg',
  // Anti-hipertensivos
  'losartana 50mg','losartana 100mg','valsartana 160mg','irbesartana 150mg','olmesartana 20mg',
  'telmisartana 80mg','candesartana 16mg','enalapril 10mg','enalapril 20mg','captopril 25mg',
  'captopril 50mg','lisinopril 10mg','ramipril 5mg','perindopril 5mg','benazepril 10mg',
  'amlodipino 5mg','amlodipino 10mg','nifedipino 20mg','lercanidipino 10mg','felodipino 5mg',
  'atenolol 50mg','atenolol 100mg','metoprolol 50mg','metoprolol 100mg','propranolol 40mg',
  'carvedilol 12.5mg','carvedilol 25mg','bisoprolol 5mg','bisoprolol 10mg','nebivolol 5mg',
  'hidroclorotiazida 25mg','furosemida 40mg','espironolactona 25mg','indapamida 1.5mg',
  'clortalidona 25mg','verapamil 80mg','diltiazem 60mg','clonidina 0.1mg','doxazosina 2mg',
  'cozaar 50mg','diovan 160mg','norvasc 5mg','concor 5mg','nebilet 5mg',
  // Antidiabéticos
  'metformina 500mg','metformina 850mg','metformina 1g','metformina xr 500mg','metformina xr 750mg',
  'glibenclamida 5mg','gliclazida 30mg','gliclazida 60mg','glimepirida 1mg','glimepirida 2mg',
  'sitagliptina 100mg','vildagliptina 50mg','saxagliptina 5mg','linagliptina 5mg',
  'dapagliflozina 10mg','empagliflozina 10mg','canagliflozina 100mg','ertugliflozina 5mg',
  'pioglitazona 30mg','acarbose 50mg','acarbose 100mg',
  'glifage 500mg','januvia 100mg','forxiga 10mg','jardins 10mg','galvus 50mg',
  // Colesterol e triglicérides
  'atorvastatina 10mg','atorvastatina 20mg','atorvastatina 40mg','atorvastatina 80mg',
  'sinvastatina 20mg','sinvastatina 40mg','rosuvastatina 10mg','rosuvastatina 20mg',
  'pravastatina 40mg','lovastatina 20mg','fluvastatina 80mg','pitavastatina 2mg',
  'ezetimiba 10mg','ezetimiba sinvastatina 10mg','bezafibrato 400mg','fenofibrato 160mg',
  'genfibrozila 600mg','omega 3 1g','crestor 10mg','lipitor 20mg','zocor 20mg',
  // Antiácidos e digestivo
  'omeprazol 20mg','omeprazol 40mg','pantoprazol 40mg','esomeprazol 40mg','lansoprazol 30mg',
  'rabeprazol 20mg','dexlansoprazol 30mg','ranitidina 150mg','famotidina 40mg','cimetidina 200mg',
  'hidroxido aluminio magnesio','carbonato calcio 500mg','metoclopramida 10mg','domperidona 10mg',
  'bromoprida 10mg','hioscina 10mg','dimeticona 40mg','bisacodil 5mg','lactulose 667mg',
  'ondansetrona 4mg','ondansetrona 8mg','granisetrona 1mg','prucaloprida 1mg',
  'nexium 40mg','losec 20mg','plasil 10mg','luftal','motilium 10mg','dulcolax',
  // Antialérgicos e asma
  'cetirizina 10mg','loratadina 10mg','desloratadina 5mg','fexofenadina 120mg','fexofenadina 180mg',
  'levocetirizina 5mg','bilastina 20mg','rupatadina 10mg','dexclorfeniramina 2mg',
  'prometazina 25mg','hidroxizina 25mg','montelucaste 10mg','montelucaste 5mg',
  'salbutamol 100mcg','fenoterol 100mcg','formoterol 12mcg','salmeterol 50mcg',
  'budesonida 200mcg','fluticasona 250mcg','beclometasona 50mcg','tiotrópio 18mcg',
  'ipratrópio 20mcg','teofilina 100mg','aminofilina 100mg',
  'allegra 120mg','claritin 10mg','zyrtec 10mg','singulaire 10mg','berotec','flixotide',
  // Sistema nervoso
  'clonazepam 0.5mg','clonazepam 1mg','clonazepam 2mg','diazepam 5mg','diazepam 10mg',
  'alprazolam 0.25mg','alprazolam 0.5mg','alprazolam 1mg','bromazepam 3mg','lorazepam 1mg',
  'fluoxetina 20mg','fluoxetina 40mg','sertralina 50mg','sertralina 100mg','paroxetina 20mg',
  'escitalopram 10mg','escitalopram 20mg','citalopram 20mg','fluvoxamina 50mg',
  'venlafaxina 75mg','venlafaxina 150mg','duloxetina 30mg','duloxetina 60mg',
  'bupropiona 150mg','bupropiona 300mg','mirtazapina 30mg','trazodona 100mg',
  'amitriptilina 25mg','amitriptilina 75mg','nortriptilina 25mg','imipramina 25mg',
  'clomipramina 25mg','maprotilina 75mg',
  'risperidona 2mg','olanzapina 5mg','olanzapina 10mg','quetiapina 25mg','quetiapina 100mg',
  'quetiapina 200mg','aripiprazol 10mg','ziprasidona 40mg','haloperidol 1mg','haloperidol 5mg',
  'clozapina 100mg','amisulprida 200mg','paliperidona 3mg',
  'carbamazepina 200mg','valproato 500mg','lamotrigina 100mg','topiramato 50mg',
  'gabapentina 300mg','pregabalina 75mg','pregabalina 150mg','levetiracetam 500mg',
  'fenitoina 100mg','fenobarbital 100mg','oxcarbazepina 300mg','lacosamida 100mg',
  'donepezila 5mg','memantina 10mg','rivastigmina 3mg','galantamina 8mg',
  'levodopa carbidopa','pramipexol 0.125mg','amantadina 100mg','entacapona 200mg',
  'rivotril 2mg','frontal 0.5mg','prozac 20mg','zoloft 50mg','lexapro 10mg',
  'effexor 75mg','cymbalta 30mg','zyprexa 10mg','risperdal 2mg','seroquel 25mg',
  'tegretol 200mg','depakene 500mg','gardenal 100mg','neurontin 300mg','lyrica 75mg',
  // Tireoide
  'levotiroxina 25mcg','levotiroxina 50mcg','levotiroxina 75mcg','levotiroxina 100mcg',
  'levotiroxina 125mcg','levotiroxina 150mcg','propiltiouracila 100mg','metimazol 10mg',
  'puran t4 50mcg','euthyrox 50mcg',
  // Corticosteroides
  'prednisona 5mg','prednisona 20mg','prednisolona 5mg','dexametasona 0.5mg','dexametasona 4mg',
  'betametasona 0.5mg','hidrocortisona 20mg','metilprednisolona 4mg','triancinolona 4mg',
  'deflazacorte 6mg','budesonida 3mg','beclometasona creme','decadron 4mg','medrol 4mg',
  // Anticoagulantes
  'varfarina 5mg','rivaroxabana 10mg','rivaroxabana 20mg','apixabana 5mg','dabigatrana 110mg',
  'dabigatrana 150mg','clopidogrel 75mg','ticagrelor 90mg','acido acetilsalicilico 100mg',
  'enoxaparina 40mg','xarelto 20mg','pradaxa 110mg','eliquis 5mg','aas 100mg',
  // Cardiovascular
  'digoxina 0.25mg','amiodarona 200mg','sotalol 80mg','propafenona 150mg',
  'nitroglicerina 0.5mg','isossorbida 5mg','isossorbida mononitrato 20mg',
  'ivabradina 5mg','trimetazidina 20mg','hidralazina 25mg','minoxidil 5mg',
  // Urológico
  'tamsulosina 0.4mg','finasterida 5mg','dutasterida 0.5mg','sildenafila 50mg','sildenafila 100mg',
  'tadalafila 5mg','tadalafila 20mg','vardenafila 10mg','oxibutinina 5mg','solifenacina 5mg',
  'tolterodina 2mg','fenazopiridina 200mg','nitrofurantoina macrocristal 100mg',
  'viagra 50mg','cialis 20mg','levitra 10mg','flomax 0.4mg','avodart 0.5mg',
  // Vitaminas e suplementos
  'vitamina c 500mg','vitamina c 1g','vitamina d 1000ui','vitamina d 2000ui','vitamina d 4000ui',
  'vitamina b12 1000mcg','complexo b','acido folico 400mcg','acido folico 5mg',
  'ferro sulfato 40mg','ferro quelato','calcio vitamina d','calcio carbonato 500mg',
  'zinco 7mg','magnesio 500mg','omega 3 1g','coenzima q10 100mg','vitamina e 400ui',
  'biotina 5mg','colageno hidrolisado','probiotico lactobacillus','polivitaminico adulto',
  'centrum adulto','caltrate 600mg','supradyn','femme 30','vitasay 50 mais',
  // Hormônios femininos e masculinos
  'levonorgestrel etinilestradiol','desogestrel 75mcg','progesterona 100mg','estradiol 1mg',
  'medroxiprogesterona 150mg','tibolona 2.5mg','raloxifeno 60mg','testosterona gel',
  'postinor 2','yasmin','diane 35','micronor',
  // Dermatologia
  'isotretinoina 20mg','isotretinoina 10mg','minociclina 100mg','doxiciclina 100mg',
  'fluconazol 150mg','itraconazol 100mg','terbinafina 250mg','ketoconazol 200mg',
  'ketoconazol shampoo','miconazol creme','clotrimazol creme','nistatina suspensao',
  'aciclovir 200mg','aciclovir creme','valaciclovir 500mg','oseltamivir 75mg',
  'tretinoina 0.025','adapaleno 0.1','peroxido benzoila 5','clindamicina gel',
  'roacutan 20mg','nizoral shampoo','lamisil 250mg','zovirax creme',
  // Reumatologia
  'metotrexato 2.5mg','metotrexato 7.5mg','hidroxicloroquina 400mg','sulfassalazina 500mg',
  'leflunomida 20mg','alopurinol 100mg','alopurinol 300mg','colchicina 0.5mg',
  'alendronato 70mg','risedronato 35mg','acido zoledronico 5mg',
  'plaquenil 400mg','arava 20mg','zyloric 300mg','fosamax 70mg',
  // Respiratório superior
  'ambroxol 30mg','acetilcisteina 600mg','bromexina 8mg','guaifenesina 200mg',
  'mometasona spray','fluticasona spray','budesonida spray','xylometazolina',
  'oximetazolina 0.05','beclometasona spray nasal','nasonex','beconase',
  'benegrip','naldecon','coristina','trimedal','resfenol',
  // Outros muito buscados
  'insulina nph','insulina regular','insulina glargina','insulina asparte',
  'morfina 10mg','codeina paracetamol','fentanila adesivo','buprenorfina',
  'metilfenidato 10mg','metilfenidato 20mg','lisdexanfetamina 30mg',
  'zolpidem 10mg','zopiclona 7.5mg','eszopiclona 3mg',
  'naltrexona 50mg','dissulfiram 250mg','acamprosato 333mg',
  'vareniclina 1mg','bupropiona 150mg tabaco',
]

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function runActor(query) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      searchQuery: query + ' farmacia',
      country: 'br',
      language: 'pt',
      sortBy: 'BEST_MATCH',
      limit: 20
    })
    const req = https.request({
      hostname: 'api.apify.com',
      path: '/v2/acts/' + ACTOR_ID + '/runs?token=' + APIFY_TOKEN + '&waitForFinish=120',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve(JSON.parse(d)) }
        catch(e) { resolve(null) }
      })
    })
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

function getDataset(id) {
  return new Promise((resolve, reject) => {
    https.get('https://api.apify.com/v2/datasets/' + id + '/items?token=' + APIFY_TOKEN, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve(JSON.parse(d)) }
        catch(e) { resolve([]) }
      })
    }).on('error', () => resolve([]))
  })
}

function parsePreco(priceStr) {
  if (!priceStr) return null
  const n = priceStr.replace(/[^\d,]/g, '').replace(',', '.')
  const v = parseFloat(n)
  return (!isNaN(v) && v > 0 && v < 5000) ? v : null
}

function normalizarFarmaciaId(storeName) {
  return storeName.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .substring(0, 30)
}

async function main() {
  console.log('🚀 Coleta via Google Shopping — ' + MEDICAMENTOS.length + ' medicamentos')
  console.log('Estimativa: ~' + Math.ceil(MEDICAMENTOS.length * 2) + ' minutos\n')

  console.log('Limpando tabela...')
  await supabase.from('precos').delete().gte('id', 0)

  const todos = []

  for (let i = 0; i < MEDICAMENTOS.length; i++) {
    const med = MEDICAMENTOS[i]
    process.stdout.write('[' + (i+1) + '/' + MEDICAMENTOS.length + '] ' + med + '... ')

    try {
      const run = await runActor(med)
      if (!run?.data?.defaultDatasetId) { console.log('sem dataset'); continue }

      const items = await getDataset(run.data.defaultDatasetId)
      const precos = []

      for (const item of items) {
        const preco = parsePreco(item.price)
        if (!preco || !item.storeName) continue

        precos.push({
          medicamento: med.toLowerCase(),
          farmacia: item.storeName,
          farmacia_id: normalizarFarmaciaId(item.storeName),
          preco,
          url: item.offerPageUrl || '',
          logo_cor: '#ff4500',
          entrega: 'Online',
          disponivel: true,
          principio_ativo: med.split(' ')[0]
        })
      }

      todos.push(...precos)
      console.log(precos.length + ' preços (' + [...new Set(precos.map(p=>p.farmacia))].length + ' farmácias)')
    } catch(e) {
      console.log('erro: ' + e.message)
    }

    await sleep(2000) // respeita rate limit do Apify
  }

  console.log('\nSalvando ' + todos.length + ' preços no Supabase...')
  for (let i = 0; i < todos.length; i += 100) {
    const batch = todos.slice(i, i + 100)
    const { error } = await supabase.from('precos').insert(batch)
    if (error) console.error('Erro batch:', error.message)
    else process.stdout.write('.')
  }

  console.log('\n✅ Finalizado! ' + todos.length + ' preços salvos.')
  const farmacias = [...new Set(todos.map(p => p.farmacia))]
  console.log('Farmácias cobertas (' + farmacias.length + '):', farmacias.join(', '))
}

main().catch(console.error)
