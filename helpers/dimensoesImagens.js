// GERADO AUTOMATICAMENTE a partir dos arquivos em public/images.
// Serve para preencher width/height nas <img>, reservando o espaço no layout
// e evitando CLS (Cumulative Layout Shift), que é fator de ranqueamento.
// Ao adicionar um brinquedo novo, inclua a imagem aqui também.

const DIMENSOES = {
  '/images/air-game.webp': [1536, 1024],
  '/images/area-baby.png': [1536, 1024],
  '/images/borrifador.webp': [853, 1280],
  '/images/brinquedo-astrounata.png': [1536, 1024],
  '/images/caminhao-citytoys-Photoroom.webp': [1280, 853],
  '/images/caminhao-citytoys.webp': [1280, 853],
  '/images/castelinho.webp': [1536, 1024],
  '/images/colorex2.webp': [864, 1184],
  '/images/colrex2.webp': [1536, 1024],
  '/images/crianca-brincando.webp': [1024, 1024],
  '/images/dino.webp': [1536, 1024],
  '/images/foguete.png': [2404, 3622],
  '/images/fundo-header.png': [1536, 1024],
  '/images/fundo-hero.png': [1672, 941],
  '/images/fundo-hero.webp': [1672, 941],
  '/images/futebol-sabao-10x5.webp': [1536, 1024],
  '/images/futebol-sabao-4x8.webp': [1536, 1024],
  '/images/gigante.webp': [1536, 1024],
  '/images/guerra-cotonete.webp': [1536, 1024],
  '/images/legolandia.jpg': [1951, 1454],
  '/images/legolandia.webp': [1280, 960],
  '/images/logo-citytoys.png': [1024, 1024],
  '/images/mini-circuito.webp': [1536, 1024],
  '/images/passo-whats.webp': [980, 980],
  '/images/piscina-bolinha.webp': [1536, 1024],
  '/images/piscina-dino.webp': [1600, 561],
  '/images/premium.webp': [1536, 1024],
  '/images/pula-pula-2,44.webp': [1536, 1024],
  '/images/pula-pula-244.webp': [1536, 1024],
  '/images/pula-pula-3,05.webp': [1536, 1024],
  '/images/tigrinho.webp': [1536, 1024],
  '/images/toboagua.webp': [1536, 1024],
  '/images/toboga-colorex.webp': [1536, 1024],
  '/images/toboga-gigante.webp': [1536, 1024],
  '/images/toboga-premium.webp': [1600, 900],
  '/images/toto.webp': [1536, 1024],
  '/images/touro-mecanico.webp': [1536, 1024]
}

// Proporção usada quando a imagem não está no mapa (padrão dos brinquedos).
const PADRAO = [1536, 1024]

export function dimensaoImagem(caminho) {
  const [largura, altura] = DIMENSOES[caminho] || PADRAO
  return { largura, altura }
}

export default DIMENSOES
