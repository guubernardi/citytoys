<template>
  <section class="erro">
    <div class="conteudo-erro">
      <img
        class="logo-erro"
        src="/images/logo-citytoys-sem-fundo.svg"
        alt="City Toys"
        width="180"
        height="60"
      />

      <p class="codigo-erro">{{ codigo }}</p>

      <h1 class="titulo-erro">{{ titulo }}</h1>
      <p class="texto-erro">{{ mensagem }}</p>

      <div class="acoes-erro">
        <button type="button" class="botao botao-primario" @click="voltarAoInicio">
          Voltar para o início
        </button>

        <a class="botao botao-whats" :href="linkWhats" target="_blank" rel="noopener noreferrer">
          Falar no WhatsApp
        </a>
      </div>

      <nav class="atalhos-erro" aria-label="Atalhos">
        <NuxtLink to="/">Brinquedos</NuxtLink>
        <NuxtLink to="/montar-combo">Monte seu combo</NuxtLink>
      </nav>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { WHATS_NUMERO } from '~/helpers/seo.js'

const props = defineProps({
  error: { type: Object, default: () => ({}) }
})

const codigo = computed(() => props.error?.statusCode || 404)
const ehNaoEncontrado = computed(() => Number(codigo.value) === 404)

const titulo = computed(() =>
  ehNaoEncontrado.value ? 'Essa página escapou da festa!' : 'Algo deu errado por aqui'
)

const mensagem = computed(() =>
  ehNaoEncontrado.value
    ? 'O link que você abriu não existe mais ou foi digitado errado. Mas relaxa — os brinquedos continuam todos no lugar.'
    : 'Tivemos um problema inesperado ao carregar essa página. Tente de novo em instantes ou fale com a gente no WhatsApp.'
)

const linkWhats = computed(() => {
  const msg = 'Olá! Tentei acessar uma página do site da City Toys e deu erro. Podem me ajudar?'
  return `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(msg)}`
})

function voltarAoInicio() {
  clearError({ redirect: '/' })
}

// Página de erro nunca deve ser indexada nem repassar autoridade.
useHead({
  title: computed(() => (ehNaoEncontrado.value ? 'Página não encontrada' : 'Erro inesperado')),
  meta: [{ name: 'robots', content: 'noindex, follow' }],
  link: [{ rel: 'canonical', href: null }]
})
</script>

<style lang="sass" scoped>
$ct-navy: #2D3A7A
$ct-yellow: #FFC93A
$ct-whats: #00a884

section.erro
  display: flex
  align-items: center
  justify-content: center
  min-height: 100svh
  padding: 40px 20px
  font-family: var(--fonte)
  background: linear-gradient(160deg, $ct-navy 0%, #1b2350 100%)
  color: var(--cor-branco)
  text-align: center

.conteudo-erro
  display: flex
  flex-direction: column
  align-items: center
  gap: 14px
  max-width: 560px
  width: 100%

.logo-erro
  width: 180px
  height: auto
  margin-bottom: 8px

.codigo-erro
  margin: 0
  font-size: clamp(3.5rem, 12vw, 6rem)
  font-weight: 700
  line-height: 1
  color: $ct-yellow
  letter-spacing: -2px

.titulo-erro
  margin: 0
  font-size: var(--f5)
  font-weight: 700

.texto-erro
  margin: 0
  font-size: var(--f2)
  line-height: 1.6
  color: rgba(255, 255, 255, .8)

.acoes-erro
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 12px
  margin-top: 12px

.botao
  display: inline-flex
  align-items: center
  justify-content: center
  padding: 14px 26px
  border: none
  border-radius: 999px
  font-family: var(--fonte)
  font-size: var(--f2)
  font-weight: 700
  text-decoration: none
  cursor: pointer
  transition: transform .18s ease, filter .18s ease

  &:hover
    transform: translateY(-2px)
    filter: brightness(1.08)

  &:focus-visible
    outline: 3px solid $ct-yellow
    outline-offset: 3px

.botao-primario
  background: $ct-yellow
  color: $ct-navy

.botao-whats
  background: $ct-whats
  color: var(--cor-branco)

.atalhos-erro
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 20px
  margin-top: 18px

  a
    color: rgba(255, 255, 255, .75)
    font-size: var(--f2)
    text-decoration: underline
    text-underline-offset: 4px

    &:hover
      color: $ct-yellow

@media screen and (max-width: 1000px)
  .acoes-erro
    width: 100%
    flex-direction: column

  .botao
    width: 100%
</style>
