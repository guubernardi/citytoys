// Fonte única de verdade do SEO da City Toys.
// Qualquer mudança de domínio, contato ou área atendida acontece só aqui.
//
// ATENÇÃO — por que não existe Review/AggregateRating aqui:
// os depoimentos da home são reais, mas o Google trata avaliação sobre o
// próprio negócio hospedada no site dele como "self-serving review", e desde
// 2019 elas não geram rich result para Organization/LocalBusiness — só rendem
// aviso no Search Console. O caminho para estrelinha na busca é o Google
// Business Profile, não structured data no site.

// Versão canônica confirmada: http, https e a forma sem "www" redirecionam
// todas para https://www.citytoysbrinquedos.com/.
export const URL_BASE = 'https://www.citytoysbrinquedos.com'
export const NOME_EMPRESA = 'City Toys'
export const WHATS_NUMERO = '5521984848699'
export const TELEFONE_E164 = '+5521984848699'
export const EMAIL_CONTATO = 'citytoyslocacoesdebrinquedos@gmail.com'
export const INSTAGRAM_URL = 'https://www.instagram.com/city_toysbrinquedos/'

export const IMAGEM_COMPARTILHAMENTO = `${URL_BASE}/share.png`
export const LOGO_URL = `${URL_BASE}/images/logo-citytoys.png`

export const DESCRICAO_PADRAO =
  'Aluguel de brinquedos infláveis para festas infantis no Rio de Janeiro. Pula-pula, tobogã, piscina de bolinhas e touro mecânico com entrega, montagem e higienização inclusas.'

// Bairros com atendimento já comprovado pelos depoimentos do site.
export const BAIRROS_ATENDIDOS = [
  'Barra da Tijuca',
  'Recreio dos Bandeirantes',
  'Jacarepaguá',
  'Tijuca',
  'Botafogo',
  'Copacabana'
]

// Monta URL absoluta a partir de um caminho da aplicação.
export function urlAbsoluta(caminho = '/') {
  if (!caminho || caminho === '/') return `${URL_BASE}/`
  const limpo = caminho.split('?')[0].split('#')[0]
  return `${URL_BASE}${limpo.startsWith('/') ? limpo : `/${limpo}`}`
}

// Áreas atendidas no formato schema.org, com a cidade primeiro.
function areasAtendidas() {
  return [
    { '@type': 'City', name: 'Rio de Janeiro', '@id': 'https://www.wikidata.org/wiki/Q8678' },
    ...BAIRROS_ATENDIDOS.map(bairro => ({
      '@type': 'Place',
      name: `${bairro}, Rio de Janeiro`
    }))
  ]
}

// Grafo global do site: Organization + WebSite + Service.
// Usa Organization (não LocalBusiness) porque a empresa não tem endereço
// público — LocalBusiness sem "address" gera aviso de validação no Google.
export function jsonLdSiteGlobal() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${URL_BASE}/#organizacao`,
        name: NOME_EMPRESA,
        alternateName: 'City Toys Locação de Brinquedos',
        url: `${URL_BASE}/`,
        description: DESCRICAO_PADRAO,
        email: EMAIL_CONTATO,
        telephone: TELEFONE_E164,
        logo: {
          '@type': 'ImageObject',
          '@id': `${URL_BASE}/#logo`,
          url: LOGO_URL,
          width: 1024,
          height: 1024,
          caption: NOME_EMPRESA
        },
        image: { '@id': `${URL_BASE}/#logo` },
        sameAs: [INSTAGRAM_URL],
        areaServed: areasAtendidas(),
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: TELEFONE_E164,
            email: EMAIL_CONTATO,
            availableLanguage: ['pt-BR'],
            areaServed: 'BR'
          }
        ]
      },
      {
        '@type': 'WebSite',
        '@id': `${URL_BASE}/#site`,
        url: `${URL_BASE}/`,
        name: NOME_EMPRESA,
        description: DESCRICAO_PADRAO,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${URL_BASE}/#organizacao` }
      },
      {
        '@type': 'Service',
        '@id': `${URL_BASE}/#servico`,
        name: 'Aluguel de brinquedos infláveis para festas infantis',
        serviceType: 'Locação de brinquedos infláveis',
        description: DESCRICAO_PADRAO,
        provider: { '@id': `${URL_BASE}/#organizacao` },
        areaServed: areasAtendidas(),
        audience: {
          '@type': 'Audience',
          audienceType: 'Famílias e organizadores de festas infantis'
        },
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${URL_BASE}/montar-combo`,
          servicePhone: TELEFONE_E164
        }
      }
    ]
  }
}

// Trilha de navegação. Espera [{ nome, caminho }].
export function jsonLdBreadcrumb(itens = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: itens.map((item, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      name: item.nome,
      item: urlAbsoluta(item.caminho)
    }))
  }
}

// Catálogo dos brinquedos como ItemList de Product.
// Espera a mesma estrutura de objeto usada em SectionBrinquedo.vue.
export function jsonLdCatalogoBrinquedos(brinquedos = []) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${URL_BASE}/#catalogo-brinquedos`,
    name: 'Catálogo de brinquedos infláveis City Toys',
    numberOfItems: brinquedos.length,
    itemListElement: brinquedos.map((brinquedo, indice) => ({
      '@type': 'ListItem',
      position: indice + 1,
      item: {
        '@type': 'Product',
        '@id': `${URL_BASE}/#${brinquedo.id}`,
        name: brinquedo.name,
        category: brinquedo.schemaCategory,
        image: urlAbsoluta(brinquedo.imageSrc),
        description: brinquedo.imageAlt,
        brand: { '@id': `${URL_BASE}/#organizacao` },
        // "ageText" ora é mínimo ("3+"), ora é máximo ("Até 5 anos").
        // Vai como texto livre para não afirmar a faixa etária errada.
        additionalProperty: [
          { '@type': 'PropertyValue', name: 'Faixa etária', value: brinquedo.ageText },
          { '@type': 'PropertyValue', name: 'Capacidade', value: brinquedo.capText }
        ]
      }
    }))
  }
}

// Helper para injetar JSON-LD via useHead sem repetir boilerplate.
export function scriptJsonLd(dados, id) {
  return {
    type: 'application/ld+json',
    key: id,
    innerHTML: JSON.stringify(dados)
  }
}
