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

useHead({
  title: 'City Toys',
  meta: [
    { name: 'description', content: 'Alugue Brinquedos Inflavéis atendemos todo o Rio de Janeiro, Aproveite o melhor preço' },
    { property: 'og:title', content: 'City Toys Locação de Brinquedos' },
    { property: 'og:description', content: 'Alugue brinquedos inflaveis para sua festa com a melhor locadora de Brinquedos do Rio de Janeiro' }
  ]
})
</script>
