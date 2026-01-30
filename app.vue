<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

useHead({
  htmlAttrs: { lang: 'pt-BR' },
  meta: [
    { charset: 'utf-8' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'HandheldFriendly', content: 'true' },

    { name: 'theme-color', content: '#2D3A7A' },
    { name: 'msapplication-TileColor', content: '#2D3A7A' },
    { name: 'msapplication-navbutton-color', content: '#2D3A7A' },

    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
    { name: 'mobile-web-app-capable', content: 'yes' },

    { name: 'apple-mobile-web-app-title', content: 'City Toys' },
    { name: 'application-name', content: 'City Toys' },

    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow, max-image-preview:large' },

    { name: 'author', content: 'City Toys' },

    {
      name: 'description',
      content:
        'City Toys — aluguel de brinquedos para festas no RJ. Monte seu combo, escolha a data e finalize no WhatsApp com praticidade e segurança.'
    },

    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'City Toys' },
    { property: 'og:locale', content: 'pt_BR' },
    { property: 'og:title', content: 'City Toys | Aluguel de Brinquedos para Festas no RJ' },
    {
      property: 'og:description',
      content:
        'Aluguel de brinquedos para festas no RJ. Monte seu combo e finalize no WhatsApp. Prático, seguro e no capricho!'
    },
    { property: 'og:url', content: 'https://citytoys.com.br' },
    { property: 'og:image', content: '/share.png' }, 
    { property: 'og:image:type', content: 'image/png' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'City Toys — Aluguel de Brinquedos' },

    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'City Toys | Aluguel de Brinquedos no RJ' },
    {
      name: 'twitter:description',
      content: 'Monte seu combo e alugue brinquedos para festa no RJ com a City Toys.'
    },
    { name: 'twitter:image', content: '/share.png' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicons/favicon.ico' }
  ]
})

if (process.client) {
  watch(
    () => route.fullPath,
    () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  )
}
</script>
