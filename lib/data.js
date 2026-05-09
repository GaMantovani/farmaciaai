// lib/data.js — base de dados estática para SEO programático

export const CIDADES = [
  { slug: 'sao-paulo-sp', nome: 'São Paulo', estado: 'SP', lat: -23.5505, lng: -46.6333, populacao: 12300000 },
  { slug: 'rio-de-janeiro-rj', nome: 'Rio de Janeiro', estado: 'RJ', lat: -22.9068, lng: -43.1729, populacao: 6700000 },
  { slug: 'belo-horizonte-mg', nome: 'Belo Horizonte', estado: 'MG', lat: -19.9167, lng: -43.9345, populacao: 2500000 },
  { slug: 'curitiba-pr', nome: 'Curitiba', estado: 'PR', lat: -25.4284, lng: -49.2733, populacao: 1900000 },
  { slug: 'porto-alegre-rs', nome: 'Porto Alegre', estado: 'RS', lat: -30.0346, lng: -51.2177, populacao: 1400000 },
  { slug: 'salvador-ba', nome: 'Salvador', estado: 'BA', lat: -12.9714, lng: -38.5014, populacao: 2900000 },
  { slug: 'fortaleza-ce', nome: 'Fortaleza', estado: 'CE', lat: -3.7172, lng: -38.5433, populacao: 2700000 },
  { slug: 'manaus-am', nome: 'Manaus', estado: 'AM', lat: -3.1190, lng: -60.0217, populacao: 2200000 },
  { slug: 'recife-pe', nome: 'Recife', estado: 'PE', lat: -8.0476, lng: -34.8770, populacao: 1600000 },
  { slug: 'brasilia-df', nome: 'Brasília', estado: 'DF', lat: -15.7797, lng: -47.9297, populacao: 3000000 },
  { slug: 'belem-pa', nome: 'Belém', estado: 'PA', lat: -1.4558, lng: -48.5044, populacao: 1500000 },
  { slug: 'goiania-go', nome: 'Goiânia', estado: 'GO', lat: -16.6864, lng: -49.2643, populacao: 1500000 },
  { slug: 'guarulhos-sp', nome: 'Guarulhos', estado: 'SP', lat: -23.4538, lng: -46.5333, populacao: 1400000 },
  { slug: 'campinas-sp', nome: 'Campinas', estado: 'SP', lat: -22.9056, lng: -47.0608, populacao: 1200000 },
  { slug: 'sao-luis-ma', nome: 'São Luís', estado: 'MA', lat: -2.5297, lng: -44.3028, populacao: 1100000 },
  { slug: 'maceio-al', nome: 'Maceió', estado: 'AL', lat: -9.6658, lng: -35.7350, populacao: 1000000 },
  { slug: 'natal-rn', nome: 'Natal', estado: 'RN', lat: -5.7945, lng: -35.2110, populacao: 900000 },
  { slug: 'teresina-pi', nome: 'Teresina', estado: 'PI', lat: -5.0892, lng: -42.8019, populacao: 870000 },
  { slug: 'campo-grande-ms', nome: 'Campo Grande', estado: 'MS', lat: -20.4697, lng: -54.6201, populacao: 900000 },
  { slug: 'joao-pessoa-pb', nome: 'João Pessoa', estado: 'PB', lat: -7.1195, lng: -34.8450, populacao: 820000 },
  { slug: 'santos-sp', nome: 'Santos', estado: 'SP', lat: -23.9618, lng: -46.3322, populacao: 430000 },
  { slug: 'ribeirao-preto-sp', nome: 'Ribeirão Preto', estado: 'SP', lat: -21.1704, lng: -47.8103, populacao: 720000 },
  { slug: 'uberlandia-mg', nome: 'Uberlândia', estado: 'MG', lat: -18.9186, lng: -48.2772, populacao: 700000 },
  { slug: 'contagem-mg', nome: 'Contagem', estado: 'MG', lat: -19.9317, lng: -44.0536, populacao: 660000 },
  { slug: 'aracaju-se', nome: 'Aracaju', estado: 'SE', lat: -10.9472, lng: -37.0731, populacao: 650000 },
  { slug: 'feira-de-santana-ba', nome: 'Feira de Santana', estado: 'BA', lat: -12.2664, lng: -38.9663, populacao: 600000 },
  { slug: 'cuiaba-mt', nome: 'Cuiabá', estado: 'MT', lat: -15.5989, lng: -56.0949, populacao: 600000 },
  { slug: 'joinville-sc', nome: 'Joinville', estado: 'SC', lat: -26.3044, lng: -48.8487, populacao: 590000 },
  { slug: 'florianopolis-sc', nome: 'Florianópolis', estado: 'SC', lat: -27.5954, lng: -48.5480, populacao: 530000 },
  { slug: 'sorocaba-sp', nome: 'Sorocaba', estado: 'SP', lat: -23.5015, lng: -47.4526, populacao: 680000 },
]

export const REMEDIOS = [
  { slug: 'dipirona-500mg', nome: 'Dipirona Sódica 500mg', principio: 'Dipirona Sódica', categoria: 'Analgésico', generico: true, receita: false, descricao: 'Analgésico e antitérmico amplamente utilizado para alívio de dores de cabeça, dores musculares e febre.' },
  { slug: 'amoxicilina-500mg', nome: 'Amoxicilina 500mg', principio: 'Amoxicilina', categoria: 'Antibiótico', generico: true, receita: true, descricao: 'Antibiótico de amplo espectro indicado para infecções bacterianas. Requer receita médica.' },
  { slug: 'omeprazol-20mg', nome: 'Omeprazol 20mg', principio: 'Omeprazol', categoria: 'Antiácido', generico: true, receita: false, descricao: 'Inibidor de bomba de prótons indicado para gastrite, refluxo e úlceras gástricas.' },
  { slug: 'losartana-50mg', nome: 'Losartana Potássica 50mg', principio: 'Losartana', categoria: 'Anti-hipertensivo', generico: true, receita: true, descricao: 'Medicamento para controle da pressão arterial. Uso contínuo, requer acompanhamento médico.' },
  { slug: 'ibuprofeno-600mg', nome: 'Ibuprofeno 600mg', principio: 'Ibuprofeno', categoria: 'Anti-inflamatório', generico: true, receita: false, descricao: 'Anti-inflamatório, analgésico e antitérmico indicado para dores e inflamações.' },
  { slug: 'metformina-850mg', nome: 'Metformina 850mg', principio: 'Metformina', categoria: 'Antidiabético', generico: true, receita: true, descricao: 'Medicamento para controle do diabetes tipo 2. Uso contínuo sob prescrição médica.' },
  { slug: 'atorvastatina-20mg', nome: 'Atorvastatina 20mg', principio: 'Atorvastatina', categoria: 'Hipolipemiante', generico: true, receita: true, descricao: 'Reduz o colesterol ruim (LDL) e triglicérides. Uso contínuo sob prescrição médica.' },
  { slug: 'azitromicina-500mg', nome: 'Azitromicina 500mg', principio: 'Azitromicina', categoria: 'Antibiótico', generico: true, receita: true, descricao: 'Antibiótico indicado para infecções respiratórias e de garganta. Requer receita médica.' },
  { slug: 'paracetamol-750mg', nome: 'Paracetamol 750mg', principio: 'Paracetamol', categoria: 'Analgésico', generico: true, receita: false, descricao: 'Analgésico e antitérmico indicado para dores leves a moderadas e febre.' },
  { slug: 'clonazepam-2mg', nome: 'Clonazepam 2mg', principio: 'Clonazepam', categoria: 'Ansiolítico', generico: true, receita: true, descricao: 'Medicamento para ansiedade e epilepsia. Requer receita de controle especial.' },
  { slug: 'sinvastatina-20mg', nome: 'Sinvastatina 20mg', principio: 'Sinvastatina', categoria: 'Hipolipemiante', generico: true, receita: true, descricao: 'Controle do colesterol. Uso noturno contínuo sob prescrição médica.' },
  { slug: 'enalapril-10mg', nome: 'Enalapril 10mg', principio: 'Enalapril', categoria: 'Anti-hipertensivo', generico: true, receita: true, descricao: 'Inibidor da ECA para tratamento da hipertensão e insuficiência cardíaca.' },
  { slug: 'levotiroxina-50mcg', nome: 'Levotiroxina 50mcg', principio: 'Levotiroxina Sódica', categoria: 'Hormônio tireoidiano', generico: true, receita: true, descricao: 'Reposição hormonal para hipotireoidismo. Uso contínuo em jejum.' },
  { slug: 'dexametasona-4mg', nome: 'Dexametasona 4mg', principio: 'Dexametasona', categoria: 'Corticosteroide', generico: true, receita: true, descricao: 'Anti-inflamatório e imunossupressor. Requer prescrição médica.' },
  { slug: 'cetirizina-10mg', nome: 'Cetirizina 10mg', principio: 'Cetirizina', categoria: 'Antialérgico', generico: true, receita: false, descricao: 'Anti-histamínico para rinite alérgica, urticária e outras alergias.' },
]

export const FARMACIAS_REDES = [
  { id: 'ultrafarma', nome: 'Ultrafarma', url: 'https://www.ultrafarma.com.br', cor: '#e31e25', nacional: true },
  { id: 'drogasil', nome: 'Drogasil', url: 'https://www.drogasil.com.br', cor: '#009b3a', nacional: true },
  { id: 'drogaraia', nome: 'Droga Raia', url: 'https://www.drogaraia.com.br', cor: '#0066cc', nacional: true },
  { id: 'paguemenos', nome: 'Pague Menos', url: 'https://www.paguemenos.com.br', cor: '#f7941d', nacional: true },
  { id: 'drogal', nome: 'Drogal', url: 'https://www.drogal.com.br', cor: '#c8151b', nacional: false },
  { id: 'promofarma', nome: 'PromoFarma', url: 'https://www.promofarma.com.br', cor: '#00aeef', nacional: false },
  { id: 'panvel', nome: 'Panvel', url: 'https://www.panvel.com', cor: '#00843d', nacional: false },
  { id: 'catarinense', nome: 'Drogaria Catarinense', url: 'https://www.drogacatarinense.com.br', cor: '#e2001a', nacional: false },
]

// Gera todas as combinações remédio × cidade para SEO programático
export function gerarPaginasSEO() {
  const paginas = []
  for (const remedio of REMEDIOS) {
    for (const cidade of CIDADES) {
      paginas.push({
        params: {
          remedio: remedio.slug,
          cidade: cidade.slug,
        }
      })
    }
  }
  return paginas // 15 remédios × 30 cidades = 450 páginas iniciais
}

export function getCidade(slug) {
  return CIDADES.find(c => c.slug === slug)
}

export function getRemedio(slug) {
  return REMEDIOS.find(r => r.slug === slug)
}

export function slugify(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
}
