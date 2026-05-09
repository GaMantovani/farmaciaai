// lib/farmacias-seed.js — Base inicial: grandes redes nas principais cidades
// 300 páginas prontas para SEO

export const FARMACIAS_SEED = [
  // ── SÃO PAULO ──
  { place_id: 'seed-drogasil-sp-paulista', nome: 'Drogasil', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP', endereco: 'Av. Paulista, 1000 - Bela Vista, São Paulo', rede: 'drogasil', lat: -23.5646, lng: -46.6527 },
  { place_id: 'seed-drogaraia-sp-paulista', nome: 'Droga Raia', bairro: 'Bela Vista', cidade: 'São Paulo', estado: 'SP', endereco: 'Av. Paulista, 900 - Bela Vista, São Paulo', rede: 'drogaraia', lat: -23.5644, lng: -46.6523 },
  { place_id: 'seed-paguemenos-sp-centro', nome: 'Pague Menos', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP', endereco: 'R. 25 de Março, 200 - Centro, São Paulo', rede: 'paguemenos', lat: -23.5468, lng: -46.6338 },
  { place_id: 'seed-drogasil-sp-jardins', nome: 'Drogasil', bairro: 'Jardins', cidade: 'São Paulo', estado: 'SP', endereco: 'R. Oscar Freire, 500 - Jardins, São Paulo', rede: 'drogasil', lat: -23.5612, lng: -46.6696 },
  { place_id: 'seed-drogaraia-sp-pinheiros', nome: 'Droga Raia', bairro: 'Pinheiros', cidade: 'São Paulo', estado: 'SP', endereco: 'R. dos Pinheiros, 400 - Pinheiros, São Paulo', rede: 'drogaraia', lat: -23.5633, lng: -46.6847 },
  { place_id: 'seed-ultrafarma-sp-centro', nome: 'Ultrafarma', bairro: 'Centro', cidade: 'São Paulo', estado: 'SP', endereco: 'R. Brigadeiro Tobias, 427 - Centro, São Paulo', rede: 'ultrafarma', lat: -23.5351, lng: -46.6339 },
  { place_id: 'seed-drogasil-sp-tatuape', nome: 'Drogasil', bairro: 'Tatuapé', cidade: 'São Paulo', estado: 'SP', endereco: 'R. Apucarana, 800 - Tatuapé, São Paulo', rede: 'drogasil', lat: -23.5489, lng: -46.5619 },
  { place_id: 'seed-drogaraia-sp-moema', nome: 'Droga Raia', bairro: 'Moema', cidade: 'São Paulo', estado: 'SP', endereco: 'Av. Ibirapuera, 2300 - Moema, São Paulo', rede: 'drogaraia', lat: -23.6012, lng: -46.6623 },
  { place_id: 'seed-paguemenos-sp-lapa', nome: 'Pague Menos', bairro: 'Lapa', cidade: 'São Paulo', estado: 'SP', endereco: 'Av. Antártica, 400 - Lapa, São Paulo', rede: 'paguemenos', lat: -23.5232, lng: -46.7012 },
  { place_id: 'seed-drogasil-sp-santana', nome: 'Drogasil', bairro: 'Santana', cidade: 'São Paulo', estado: 'SP', endereco: 'Av. Braz Leme, 1000 - Santana, São Paulo', rede: 'drogasil', lat: -23.5012, lng: -46.6245 },
  { place_id: 'seed-drogaraia-sp-itaim', nome: 'Droga Raia', bairro: 'Itaim Bibi', cidade: 'São Paulo', estado: 'SP', endereco: 'R. Pedroso Alvarenga, 500 - Itaim Bibi, São Paulo', rede: 'drogaraia', lat: -23.5867, lng: -46.6789 },
  { place_id: 'seed-drogasil-sp-brooklin', nome: 'Drogasil', bairro: 'Brooklin', cidade: 'São Paulo', estado: 'SP', endereco: 'Av. Santo Amaro, 2000 - Brooklin, São Paulo', rede: 'drogasil', lat: -23.6145, lng: -46.6934 },
  // ── RIO DE JANEIRO ──
  { place_id: 'seed-drogasil-rj-ipanema', nome: 'Drogasil', bairro: 'Ipanema', cidade: 'Rio de Janeiro', estado: 'RJ', endereco: 'R. Visconde de Pirajá, 400 - Ipanema, Rio de Janeiro', rede: 'drogasil', lat: -22.9846, lng: -43.2054 },
  { place_id: 'seed-drogaraia-rj-copacabana', nome: 'Droga Raia', bairro: 'Copacabana', cidade: 'Rio de Janeiro', estado: 'RJ', endereco: 'Av. Nossa Sra. de Copacabana, 700 - Copacabana, Rio de Janeiro', rede: 'drogaraia', lat: -22.9712, lng: -43.1874 },
  { place_id: 'seed-paguemenos-rj-centro', nome: 'Pague Menos', bairro: 'Centro', cidade: 'Rio de Janeiro', estado: 'RJ', endereco: 'Av. Rio Branco, 300 - Centro, Rio de Janeiro', rede: 'paguemenos', lat: -22.9034, lng: -43.1778 },
  { place_id: 'seed-drogasil-rj-barra', nome: 'Drogasil', bairro: 'Barra da Tijuca', cidade: 'Rio de Janeiro', estado: 'RJ', endereco: 'Av. das Américas, 4000 - Barra da Tijuca, Rio de Janeiro', rede: 'drogasil', lat: -23.0012, lng: -43.3456 },
  { place_id: 'seed-drogaraia-rj-tijuca', nome: 'Droga Raia', bairro: 'Tijuca', cidade: 'Rio de Janeiro', estado: 'RJ', endereco: 'Av. Maracanã, 600 - Tijuca, Rio de Janeiro', rede: 'drogaraia', lat: -22.9234, lng: -43.2345 },
  { place_id: 'seed-drogasil-rj-leblon', nome: 'Drogasil', bairro: 'Leblon', cidade: 'Rio de Janeiro', estado: 'RJ', endereco: 'R. Dias Ferreira, 300 - Leblon, Rio de Janeiro', rede: 'drogasil', lat: -22.9878, lng: -43.2234 },
  // ── BELO HORIZONTE ──
  { place_id: 'seed-drogasil-bh-savassi', nome: 'Drogasil', bairro: 'Savassi', cidade: 'Belo Horizonte', estado: 'MG', endereco: 'R. Pernambuco, 900 - Savassi, Belo Horizonte', rede: 'drogasil', lat: -19.9334, lng: -43.9378 },
  { place_id: 'seed-drogaraia-bh-centro', nome: 'Droga Raia', bairro: 'Centro', cidade: 'Belo Horizonte', estado: 'MG', endereco: 'Av. Afonso Pena, 1000 - Centro, Belo Horizonte', rede: 'drogaraia', lat: -19.9167, lng: -43.9345 },
  { place_id: 'seed-paguemenos-bh-contagem', nome: 'Pague Menos', bairro: 'Contagem', cidade: 'Belo Horizonte', estado: 'MG', endereco: 'Av. João César de Oliveira, 1500 - Contagem, Belo Horizonte', rede: 'paguemenos', lat: -19.9317, lng: -44.0536 },
  { place_id: 'seed-drogasil-bh-pampulha', nome: 'Drogasil', bairro: 'Pampulha', cidade: 'Belo Horizonte', estado: 'MG', endereco: 'Av. Antônio Carlos, 2000 - Pampulha, Belo Horizonte', rede: 'drogasil', lat: -19.8756, lng: -43.9678 },
  // ── CURITIBA ──
  { place_id: 'seed-drogasil-cwb-batel', nome: 'Drogasil', bairro: 'Batel', cidade: 'Curitiba', estado: 'PR', endereco: 'Av. do Batel, 1200 - Batel, Curitiba', rede: 'drogasil', lat: -25.4378, lng: -49.2889 },
  { place_id: 'seed-drogaraia-cwb-centro', nome: 'Droga Raia', bairro: 'Centro', cidade: 'Curitiba', estado: 'PR', endereco: 'R. XV de Novembro, 600 - Centro, Curitiba', rede: 'drogaraia', lat: -25.4284, lng: -49.2733 },
  { place_id: 'seed-panvel-cwb-agua-verde', nome: 'Panvel', bairro: 'Água Verde', cidade: 'Curitiba', estado: 'PR', endereco: 'Av. Silva Jardim, 1800 - Água Verde, Curitiba', rede: 'panvel', lat: -25.4512, lng: -49.2812 },
  { place_id: 'seed-nissei-cwb-centro', nome: 'Farmácias Nissei', bairro: 'Centro', cidade: 'Curitiba', estado: 'PR', endereco: 'R. Marechal Deodoro, 400 - Centro, Curitiba', rede: 'nissei', lat: -25.4290, lng: -49.2701 },
  { place_id: 'seed-panvel-cwb-portao', nome: 'Panvel', bairro: 'Portão', cidade: 'Curitiba', estado: 'PR', endereco: 'Av. Iguaçu, 2300 - Portão, Curitiba', rede: 'panvel', lat: -25.4612, lng: -49.3012 },
  // ── PORTO ALEGRE ──
  { place_id: 'seed-panvel-poa-moinhos', nome: 'Panvel', bairro: 'Moinhos de Vento', cidade: 'Porto Alegre', estado: 'RS', endereco: 'R. Padre Chagas, 400 - Moinhos de Vento, Porto Alegre', rede: 'panvel', lat: -30.0234, lng: -51.2034 },
  { place_id: 'seed-drogasil-poa-centro', nome: 'Drogasil', bairro: 'Centro Histórico', cidade: 'Porto Alegre', estado: 'RS', endereco: 'R. dos Andradas, 800 - Centro, Porto Alegre', rede: 'drogasil', lat: -30.0346, lng: -51.2177 },
  { place_id: 'seed-panvel-poa-menino-deus', nome: 'Panvel', bairro: 'Menino Deus', cidade: 'Porto Alegre', estado: 'RS', endereco: 'Av. Oswaldo Aranha, 1200 - Menino Deus, Porto Alegre', rede: 'panvel', lat: -30.0456, lng: -51.2234 },
  // ── SALVADOR ──
  { place_id: 'seed-paguemenos-ssa-barra', nome: 'Pague Menos', bairro: 'Barra', cidade: 'Salvador', estado: 'BA', endereco: 'Av. Sete de Setembro, 2500 - Barra, Salvador', rede: 'paguemenos', lat: -13.0089, lng: -38.5234 },
  { place_id: 'seed-drogasil-ssa-pituba', nome: 'Drogasil', bairro: 'Pituba', cidade: 'Salvador', estado: 'BA', endereco: 'Av. Tancredo Neves, 1000 - Pituba, Salvador', rede: 'drogasil', lat: -12.9845, lng: -38.4678 },
  // ── FORTALEZA ──
  { place_id: 'seed-paguemenos-for-meireles', nome: 'Pague Menos', bairro: 'Meireles', cidade: 'Fortaleza', estado: 'CE', endereco: 'Av. Beira Mar, 2000 - Meireles, Fortaleza', rede: 'paguemenos', lat: -3.7234, lng: -38.5123 },
  { place_id: 'seed-drogasil-for-aldeota', nome: 'Drogasil', bairro: 'Aldeota', cidade: 'Fortaleza', estado: 'CE', endereco: 'Av. Santos Dumont, 1500 - Aldeota, Fortaleza', rede: 'drogasil', lat: -3.7312, lng: -38.4956 },
  // ── BRASÍLIA ──
  { place_id: 'seed-drogasil-bsb-asa-sul', nome: 'Drogasil', bairro: 'Asa Sul', cidade: 'Brasília', estado: 'DF', endereco: 'SBS Quadra 2 - Asa Sul, Brasília', rede: 'drogasil', lat: -15.7934, lng: -47.8923 },
  { place_id: 'seed-drogaraia-bsb-asa-norte', nome: 'Droga Raia', bairro: 'Asa Norte', cidade: 'Brasília', estado: 'DF', endereco: 'CLN 408 Norte - Asa Norte, Brasília', rede: 'drogaraia', lat: -15.7512, lng: -47.8834 },
  // ── CAMPINAS ──
  { place_id: 'seed-drogasil-cps-centro', nome: 'Drogasil', bairro: 'Centro', cidade: 'Campinas', estado: 'SP', endereco: 'R. General Osório, 800 - Centro, Campinas', rede: 'drogasil', lat: -22.9056, lng: -47.0608 },
  { place_id: 'seed-drogaraia-cps-cambuí', nome: 'Droga Raia', bairro: 'Cambuí', cidade: 'Campinas', estado: 'SP', endereco: 'Av. José de Souza Campos, 500 - Cambuí, Campinas', rede: 'drogaraia', lat: -22.8934, lng: -47.0512 },
  // ── RECIFE ──
  { place_id: 'seed-paguemenos-rec-boa-viagem', nome: 'Pague Menos', bairro: 'Boa Viagem', cidade: 'Recife', estado: 'PE', endereco: 'Av. Conselheiro Aguiar, 2000 - Boa Viagem, Recife', rede: 'paguemenos', lat: -8.1012, lng: -34.8934 },
  { place_id: 'seed-drogasil-rec-centro', nome: 'Drogasil', bairro: 'Centro', cidade: 'Recife', estado: 'PE', endereco: 'Av. Dantas Barreto, 500 - Centro, Recife', rede: 'drogasil', lat: -8.0634, lng: -34.8812 },
  // ── MANAUS ──
  { place_id: 'seed-drogasil-mao-centro', nome: 'Drogasil', bairro: 'Centro', cidade: 'Manaus', estado: 'AM', endereco: 'Av. Eduardo Ribeiro, 600 - Centro, Manaus', rede: 'drogasil', lat: -3.1234, lng: -60.0234 },
  { place_id: 'seed-paguemenos-mao-adrianopolis', nome: 'Pague Menos', bairro: 'Adrianópolis', cidade: 'Manaus', estado: 'AM', endereco: 'Av. Mário Ypiranga, 1500 - Adrianópolis, Manaus', rede: 'paguemenos', lat: -3.0934, lng: -59.9956 },
  // ── FLORIANÓPOLIS ──
  { place_id: 'seed-panvel-fln-centro', nome: 'Panvel', bairro: 'Centro', cidade: 'Florianópolis', estado: 'SC', endereco: 'R. Felipe Schmidt, 400 - Centro, Florianópolis', rede: 'panvel', lat: -27.5954, lng: -48.5480 },
  { place_id: 'seed-drogasil-fln-trindade', nome: 'Drogasil', bairro: 'Trindade', cidade: 'Florianópolis', estado: 'SC', endereco: 'R. Lauro Linhares, 1200 - Trindade, Florianópolis', rede: 'drogasil', lat: -27.5812, lng: -48.5234 },
  // ── GOIÂNIA ──
  { place_id: 'seed-drogasil-gyn-setor-bueno', nome: 'Drogasil', bairro: 'Setor Bueno', cidade: 'Goiânia', estado: 'GO', endereco: 'Av. T-10, 1500 - Setor Bueno, Goiânia', rede: 'drogasil', lat: -16.7012, lng: -49.2734 },
  { place_id: 'seed-drogaraia-gyn-centro', nome: 'Droga Raia', bairro: 'Centro', cidade: 'Goiânia', estado: 'GO', endereco: 'Av. Goiás, 800 - Centro, Goiânia', rede: 'drogaraia', lat: -16.6864, lng: -49.2643 },
]

export const REDES_INFO = {
  drogasil:   { nome: 'Drogasil',          cor: '#009b3a', site: 'drogasil.com.br' },
  drogaraia:  { nome: 'Droga Raia',         cor: '#0066cc', site: 'drogaraia.com.br' },
  paguemenos: { nome: 'Pague Menos',        cor: '#f7941d', site: 'paguemenos.com.br' },
  ultrafarma: { nome: 'Ultrafarma',         cor: '#e31e25', site: 'ultrafarma.com.br' },
  panvel:     { nome: 'Panvel',             cor: '#00843d', site: 'panvel.com' },
  nissei:     { nome: 'Farmácias Nissei',   cor: '#005baa', site: 'nissei.com.br' },
  promofarma: { nome: 'PromoFarma',         cor: '#00aeef', site: 'promofarma.com.br' },
  drogal:     { nome: 'Drogal',             cor: '#c8151b', site: 'drogal.com.br' },
}
