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
      <img class="faixa-sazonal__neve" src="/images/natal/icone-neve.svg" alt="" width="16" height="16" aria-hidden="true" />
      <img class="faixa-sazonal__icone" src="/images/natal/icone-presente.svg" alt="" width="18" height="18" aria-hidden="true" />

      <span class="faixa-sazonal__texto">{{ copy.faixa }}</span>
      <span class="faixa-sazonal__textoCurto">{{ copy.faixaCurta }}</span>

      <span class="faixa-sazonal__cta">
        {{ copy.faixaCta }}
        <img src="/images/natal/icone-whats-branco.svg" alt="" width="15" height="15" aria-hidden="true" />
      </span>

      <img class="faixa-sazonal__neve" src="/images/natal/icone-neve.svg" alt="" width="16" height="16" aria-hidden="true" />
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
  min-height: var(--tema-faixa-h, 48px)
  padding: 7px var(--container-px, 20px)
  overflow: hidden
  text-decoration: none
  font-family: var(--fonte)
  color: var(--tema-faixa-texto, #ffffff)

.faixa-sazonal__fundo
  position: absolute
  inset: 0
  background: var(--tema-faixa-bg)

.faixa-sazonal__conteudo
  position: relative
  z-index: 1
  display: flex
  align-items: center
  justify-content: center
  flex-wrap: wrap
  gap: 6px 14px
  width: 100%
  max-width: var(--largura-max)
  font-weight: 800
  font-size: clamp(13px, 1.5vw, 15px)
  line-height: 1.25
  text-align: center

.faixa-sazonal__icone,
.faixa-sazonal__neve
  flex: none
  display: block

.faixa-sazonal__neve
  animation: faixa-girar-neve 9s linear infinite

// O texto curto só aparece no mobile, onde o longo quebraria em três linhas.
.faixa-sazonal__textoCurto
  display: none

.faixa-sazonal__cta
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 6px 14px
  border-radius: 999px
  background: rgba(255, 255, 255, .18)
  border: 1px solid rgba(255, 255, 255, .42)
  font-size: clamp(13px, 1.45vw, 14.5px)
  white-space: nowrap
  transition: background .3s ease, border-color .3s ease

  img
    display: block

.faixa-sazonal:hover .faixa-sazonal__cta
  background: rgba(255, 255, 255, .30)
  border-color: rgba(255, 255, 255, .70)

@keyframes faixa-girar-neve
  to
    transform: rotate(360deg)

@media (max-width: 600px)
  .faixa-sazonal__texto,
  .faixa-sazonal__neve
    display: none

  .faixa-sazonal__textoCurto
    display: inline

@media (prefers-reduced-motion: reduce)
  .faixa-sazonal__neve
    animation: none
</style>
