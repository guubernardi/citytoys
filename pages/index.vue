<template>
  <div id="tela">
    <SectionHero/>
    <SectionBrinquedo/>
    <SectionComoFunciona/>
    <SectionBeneficios/>
    <SectionDepoimentos/>
    <SectionFaq/>
    <Footer/>
  </div>
</template>

<script setup>
import Footer from '../components/pages/index/Footer.vue';
import SectionBeneficios from '../components/pages/index/SectionBeneficios.vue';
import SectionBrinquedo from '../components/pages/index/SectionBrinquedo.vue';
import SectionComoFunciona from '../components/pages/index/SectionComoFunciona.vue';
import SectionDepoimentos from '../components/pages/index/SectionDepoimentos.vue';
import SectionFaq from '../components/pages/index/SectionFaq.vue';
import SectionHero from '../components/pages/index/SectionHero.vue';

definePageMeta({
  layout: 'web'
})

const tituloPagina = 'Aluguel de Brinquedos Infláveis no RJ'
const descricaoPagina =
  'Alugue pula-pula, tobogã, piscina de bolinhas e touro mecânico para festas infantis no Rio de Janeiro. Entrega, montagem e higienização inclusas. Orçamento na hora pelo WhatsApp.'

useHead({
  title: tituloPagina,
  meta: [
    { name: 'description', content: descricaoPagina },
    { property: 'og:title', content: `${tituloPagina} | City Toys` },
    { property: 'og:description', content: descricaoPagina },
    { name: 'twitter:title', content: `${tituloPagina} | City Toys` },
    { name: 'twitter:description', content: descricaoPagina }
  ]
})
</script>
