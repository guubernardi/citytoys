<script setup lang="ts">
import Nav from '../../components/global/nav/Nav.vue';
import MontarCombo from '../../components/pages/montar-combo/MontarCombo.vue';
import { jsonLdBreadcrumb, scriptJsonLd } from '~/helpers/seo.js';

const tituloPagina = 'Monte seu Combo de Brinquedos'
const descricaoPagina =
  'Monte o combo perfeito para a sua festa: escolha um brinquedo grande, um médio e um pequeno, selecione a data e finalize direto no WhatsApp. Entrega em todo o Rio de Janeiro.'

useHead({
  title: tituloPagina,
  meta: [
    { name: 'description', content: descricaoPagina },
    { property: 'og:title', content: `${tituloPagina} | City Toys` },
    { property: 'og:description', content: descricaoPagina },
    { name: 'twitter:title', content: `${tituloPagina} | City Toys` },
    { name: 'twitter:description', content: descricaoPagina }
  ],
  script: [
    scriptJsonLd(
      jsonLdBreadcrumb([
        { nome: 'Início', caminho: '/' },
        { nome: 'Monte seu Combo', caminho: '/montar-combo' }
      ]),
      'ld-breadcrumb-combo'
    )
  ]
})
</script>

<template>
    <Nav/>
    <MontarCombo/>
</template>
