<template>

    <!-- Google Tag Manager (noscript) -->
  <noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PB65JQK3"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>
  </noscript>


  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import {
  DESCRICAO_PADRAO,
  IMAGEM_COMPARTILHAMENTO,
  NOME_EMPRESA,
  jsonLdSiteGlobal,
  scriptJsonLd,
  urlAbsoluta
} from '~/helpers/seo.js'

const route = useRoute()

// Canonical e og:url acompanham a rota atual, sem query nem hash.
const urlCanonica = computed(() => urlAbsoluta(route.path))

// Tema sazonal: a classe no <html> liga a paleta da campanha
// (assets/css/tema-sazonal.sass) e a barra do navegador acompanha.
// Fora da janela do tema as duas voltam ao padrão sozinhas.
const { temaAtivo } = useTemaSazonal()
const classeTema = computed(() => (temaAtivo.value ? 'tema-sazonal' : ''))
// Na campanha, a barra do navegador acompanha o vermelho da faixa de Natal.
const corTema = computed(() => (temaAtivo.value ? '#b8202c' : '#2D3A7A'))

useHead({
  htmlAttrs: { lang: 'pt-BR', class: classeTema },

  titleTemplate: titulo => (titulo ? `${titulo} | ${NOME_EMPRESA}` : `${NOME_EMPRESA} | Aluguel de Brinquedos Infláveis no Rio de Janeiro`),

  script: [
  {
    hid: 'gtm-script',
    innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PB65JQK3');`,
    type: 'text/javascript',
    tagPosition: 'head'
  },
  scriptJsonLd(jsonLdSiteGlobal(), 'ld-site-global')
],



  meta: [
    { charset: 'utf-8' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'HandheldFriendly', content: 'true' },

    { name: 'theme-color', content: corTema },
    { name: 'msapplication-TileColor', content: '#2D3A7A' },
    { name: 'msapplication-navbutton-color', content: '#2D3A7A' },

    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'mobile-web-app-capable', content: 'yes' },

    { name: 'apple-mobile-web-app-title', content: 'City Toys' },
    { name: 'application-name', content: 'City Toys' },

    { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
    { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1' },

    { name: 'author', content: 'City Toys' },
    { name: 'publisher', content: 'City Toys' },

    // Sinais geográficos — reforçam a relevância local no Rio de Janeiro.
    { name: 'geo.region', content: 'BR-RJ' },
    { name: 'geo.placename', content: 'Rio de Janeiro' },

    { name: 'description', content: DESCRICAO_PADRAO },

    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: NOME_EMPRESA },
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:title', content: 'City Toys | Aluguel de Brinquedos Infláveis no Rio de Janeiro' },
    { property: 'og:description', content: DESCRICAO_PADRAO },
    { property: 'og:url', content: () => urlCanonica.value },
    { property: 'og:image', content: IMAGEM_COMPARTILHAMENTO },
    { property: 'og:image:secure_url', content: IMAGEM_COMPARTILHAMENTO },
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'City Toys — Aluguel de Brinquedos Infláveis para Festas' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'City Toys | Aluguel de Brinquedos Infláveis no RJ' },
    { name: 'twitter:description', content: DESCRICAO_PADRAO },
    { name: 'twitter:image', content: IMAGEM_COMPARTILHAMENTO },
    { name: 'twitter:image:alt', content: 'City Toys — Aluguel de Brinquedos Infláveis para Festas' }
  ],
  link: [
    { rel: 'canonical', href: () => urlCanonica.value },

    { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicons/android-chrome-192x192.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/favicons/apple-touch-icon.png' },
    { rel: 'manifest', href: '/manifest.webmanifest' },

    // Abre a conexão com o GTM antes do script ser baixado — economiza ~100-300ms.
    { rel: 'preconnect', href: 'https://www.googletagmanager.com', crossorigin: '' },
    { rel: 'dns-prefetch', href: 'https://www.googletagmanager.com' },

    // Fonte principal do site: pré-carregada para não atrasar o LCP do hero.
    {
      rel: 'preload',
      as: 'font',
      type: 'font/ttf',
      href: '/fonts/nunito-bold.ttf',
      crossorigin: 'anonymous'
    }
  ]
})

if (process.client) {
  watch(
    () => route.fullPath,
    () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  )

  // bloqueia arrastar imagens (reforço p/ Firefox, que ignora user-drag no CSS)
  document.addEventListener('dragstart', (e) => {
    if (e.target && e.target.tagName === 'IMG') e.preventDefault()
  })
}
</script>
