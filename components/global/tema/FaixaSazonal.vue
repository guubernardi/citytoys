<template>
  <a
    v-if="temaAtivo"
    class="faixa-sazonal"
    :href="linkWhatsTema"
    target="_blank"
    rel="noopener"
    @click="registrarCliqueTema('faixa-topo')"
  >
    <span class="faixa-sazonal__fundo" aria-hidden="true"></span>

    <span class="faixa-sazonal__conteudo">
      <SvgIcone class="faixa-sazonal__icone" nome="presente" :tamanho="20" />

      <span class="faixa-sazonal__texto">{{ copy.faixa }}</span>
      <span class="faixa-sazonal__textoCurto">{{ copy.faixaCurta }}</span>

      <span class="faixa-sazonal__cta">
        {{ copy.faixaCta }}
        <SvgIcone nome="whatsapp" :tamanho="16" />
      </span>
    </span>
  </a>
</template>

<script setup lang="ts">
import { useTemaSazonal } from '~/composables/useTemaSazonal'

// Faixa da campanha sazonal. Mora dentro do <header> do Nav de propósito: o
// Nav mede a altura do header e publica em --menu-h, então o hero e a página
// do combo se reacomodam sozinhos quando a faixa entra ou sai do ar.
const { temaAtivo, linkWhatsTema, registrarCliqueTema, copy } = useTemaSazonal()
</script>

<style lang="sass" scoped>
.faixa-sazonal
  position: relative
  display: flex
  align-items: center
  justify-content: center
  // o header do Nav é pointer-events: none pra não cobrir o hero
  pointer-events: auto
  min-height: var(--tema-faixa-h, 44px)
  padding: 8px var(--container-px, 20px)
  overflow: hidden
  text-decoration: none
  font-family: var(--fonte)
  color: var(--tema-faixa-texto, #ffffff)

.faixa-sazonal__fundo
  position: absolute
  inset: 0
  background: var(--tema-faixa-bg)
  background-size: 200% 100%
  animation: tema-correr-gradiente 18s linear infinite

.faixa-sazonal__conteudo
  position: relative
  z-index: 1
  display: flex
  align-items: center
  justify-content: center
  flex-wrap: wrap
  gap: 6px 12px
  width: 100%
  max-width: var(--largura-max)
  font-weight: 800
  font-size: clamp(13px, 1.5vw, 15px)
  line-height: 1.25
  text-align: center
  text-shadow: 0 1px 6px rgba(3, 18, 50, .28)

.faixa-sazonal__icone
  flex: none

// O texto curto só aparece no mobile, onde o longo quebraria em três linhas.
.faixa-sazonal__textoCurto
  display: none

.faixa-sazonal__cta
  display: inline-flex
  align-items: center
  gap: 6px
  padding: 5px 14px
  border-radius: 999px
  background: rgba(255, 255, 255, .18)
  border: 1px solid rgba(255, 255, 255, .42)
  white-space: nowrap
  transition: background .3s ease, border-color .3s ease

.faixa-sazonal:hover .faixa-sazonal__cta
  background: rgba(255, 255, 255, .30)
  border-color: rgba(255, 255, 255, .70)

@media (max-width: 600px)
  .faixa-sazonal__texto
    display: none

  .faixa-sazonal__textoCurto
    display: inline

@media (prefers-reduced-motion: reduce)
  .faixa-sazonal__fundo
    animation: none
</style>
