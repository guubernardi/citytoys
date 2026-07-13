<template>
  <section class="hero" id="inicio" aria-label="Seção principal" :class="{ 'is-loaded': loaded }">
    <div class="fundo-hero" aria-hidden="true"></div>
    <div class="scrim-hero" aria-hidden="true"></div>

    <div class="conteudo-hero" id="hero-conteudo">
      <span class="selo-hero" id="hero-selo">
        <SvgIcone nome="localizacao" :tamanho="16" />
        Aluguel de brinquedos infláveis · Rio de Janeiro
      </span>

      <h1 class="titulo-hero" id="hero-titulo">
        A diversão
        <span class="destaque">decola aqui</span>
      </h1>

      <p class="subtitulo-hero" id="hero-subtitulo">
        <span class="sr-only">{{ fullText }}</span>
        <span class="subtitulo-digitado" aria-hidden="true">{{ typedText }}</span>
        <span class="cursor-digitando" aria-hidden="true"></span>
      </p>

      <div class="acoes-hero" id="hero-acoes">
        <a
          class="botao botao-whats"
          id="hero-cta-whats"
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/5521984848699?text=Oi%21%20Quero%20um%20or%C3%A7amento%20%F0%9F%98%8A%0AData%3A%20____%0ABairro%3A%20____%0ABrinquedo%3A%20____"
          aria-label="Fazer orçamento no WhatsApp"
        >
          <SvgIcone nome="whatsapp" :tamanho="24" />
          Fazer orçamento
        </a>

        <button
          type="button"
          class="botao botao-combo"
          id="hero-cta-combo"
          @click="irParaCombo"
          aria-label="Monte seu combo"
        >
          <SvgIcone nome="foguete" :tamanho="22" />
          Monte seu combo
        </button>
      </div>

      <ul class="provas-hero" aria-label="Diferenciais">
        <li><SvgIcone nome="check-circulo" :tamanho="16" /> Higienizado</li>
        <li><SvgIcone nome="check-circulo" :tamanho="16" /> Montagem inclusa</li>
        <li><SvgIcone nome="check-circulo" :tamanho="16" /> Entrega em todo o RJ</li>
      </ul>
    </div>

    <div class="divisoria-nuvem" id="hero-nuvem" aria-hidden="true">
      <svg class="nuvem-svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
import { onBeforeUnmount, onMounted, ref } from 'vue'

useHead ({
  title: 'City Toys Locação de Brinquedos'
})

const loaded = ref(false)

const fullText = 'Escolha seu brinquedo e prepare a contagem regressiva!'
const typedText = ref('')

let tmr: number | null = null

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function typeWriter(text: string) {
  if (prefersReducedMotion()) {
    typedText.value = text
    return
  }

  typedText.value = ''
  let i = 0

  const tick = () => {
    typedText.value += text.charAt(i)
    i++

    if (i >= text.length) {
      tmr = null
      return
    }

    const ch = text.charAt(i - 1)
    const base = 26
    const jitter = Math.floor(Math.random() * 26)
    const extra = ch === '!' || ch === '?' || ch === '.' ? 220 : ch === ',' ? 120 : 0

    tmr = window.setTimeout(tick, base + jitter + extra)
  }

  tmr = window.setTimeout(tick, 180)
}

function irParaCombo() {
  if (import.meta.server) return
  window.location.href = '/montar-combo'
}

onMounted(() => {
  requestAnimationFrame(() => {
    loaded.value = true
  })

  typeWriter(fullText)
})

onBeforeUnmount(() => {
  if (tmr) {
    clearTimeout(tmr)
    tmr = null
  }
})
</script>

<style scoped lang="sass">
.hero
  position: relative
  overflow: hidden
  font-family: var(--fonte)

  /* espaço pro menu overlay */
  padding-top: var(--menu-h, 76px)

  min-height: 100vh
  min-height: 100svh
  min-height: 100dvh

  display: flex
  align-items: center
  justify-content: center

.fundo-hero
  position: absolute
  inset: 0
  background-image: url("/images/fundo-hero.webp")
  background-size: cover
  background-position: center
  background-repeat: no-repeat
  z-index: 0

.scrim-hero
  position: absolute
  inset: 0
  z-index: 1
  pointer-events: none
  /* topo levemente escurecido pro menu, respiro no meio, base pros botões */
  background: linear-gradient(180deg, rgba(4,22,60,.34) 0%, rgba(4,22,60,.10) 22%, rgba(4,22,60,0) 46%, rgba(4,22,60,.16) 78%, rgba(4,22,60,.30) 100%)

  &::after
    content: ""
    position: absolute
    inset: 0
    /* leve foco atrás do texto sem apagar a imagem */
    background: radial-gradient(60% 55% at 50% 46%, rgba(2,18,52,.28) 0%, rgba(2,18,52,0) 70%)

/* ---- animação de entrada ---- */
.conteudo-hero
  opacity: 0
  transform: translateY(14px) scale(.995)
  transition: opacity .55s ease, transform .55s ease

.hero.is-loaded .conteudo-hero
  opacity: 1
  transform: translateY(0) scale(1)

.selo-hero,
.titulo-hero,
.subtitulo-hero,
.acoes-hero,
.provas-hero
  opacity: 0
  transform: translateY(12px)
  transition: opacity .55s ease, transform .55s ease

.hero.is-loaded .selo-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .05s

.hero.is-loaded .titulo-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .12s

.hero.is-loaded .subtitulo-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .20s

.hero.is-loaded .acoes-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .28s

.hero.is-loaded .provas-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .36s

@media (prefers-reduced-motion: reduce)
  .conteudo-hero,
  .selo-hero,
  .titulo-hero,
  .subtitulo-hero,
  .acoes-hero,
  .provas-hero
    transition: none !important
    transform: none !important
    opacity: 1 !important

/* ---- conteúdo ---- */
.conteudo-hero
  position: relative
  z-index: 3
  width: min(920px, 92vw)
  padding: clamp(28px, 4vw, 54px) 16px clamp(96px, 11vw, 132px)
  text-align: center

  display: flex
  flex-direction: column
  align-items: center
  gap: 18px

.selo-hero
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 8px 16px
  border-radius: 999px
  background: rgba(255,255,255,.16)
  border: 1px solid rgba(255,255,255,.34)
  backdrop-filter: blur(6px)
  -webkit-backdrop-filter: blur(6px)
  color: #ffffff
  font-weight: 700
  font-size: clamp(12px, 1.4vw, 14px)
  letter-spacing: .2px
  text-shadow: 0 1px 8px rgba(3,18,50,.35)

.titulo-hero
  margin: 0
  color: #ffffff
  font-weight: 800
  font-size: clamp(38px, 7vw, 82px)
  line-height: 1.02
  letter-spacing: -0.5px
  text-shadow: 0 6px 26px rgba(3,20,54,.38)

  .destaque
    display: block
    color: #ffd23f
    text-shadow: 0 4px 18px rgba(0,0,0,.30), 0 2px 2px rgba(120,72,0,.28)

.subtitulo-hero
  margin: 2px 0 0
  color: rgba(255,255,255,.96)
  font-weight: 600
  font-size: clamp(16px, 2.3vw, 22px)
  line-height: 1.35
  max-width: 560px
  min-height: 1.35em
  text-shadow: 0 2px 12px rgba(3,20,54,.45)

.sr-only
  position: absolute
  left: -9999px
  top: auto
  width: 1px
  height: 1px
  overflow: hidden

.subtitulo-digitado
  white-space: normal

.cursor-digitando
  display: inline-block
  width: 3px
  height: 1.05em
  margin-left: 4px
  background: rgba(255,255,255,.92)
  border-radius: 2px
  transform: translateY(3px)
  animation: piscar .9s steps(1) infinite

@keyframes piscar
  50%
    opacity: 0

@media (prefers-reduced-motion: reduce)
  .cursor-digitando
    animation: none

/* ---- botões (sistema único) ---- */
.acoes-hero
  margin-top: 6px
  display: flex
  flex-wrap: wrap
  gap: 14px
  justify-content: center

.botao
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  min-height: 56px
  padding: 0 clamp(22px, 3vw, 34px)
  border: none
  border-radius: 16px
  font-family: var(--fonte)
  font-weight: 800
  font-size: clamp(15px, 1.9vw, 18px)
  letter-spacing: .2px
  cursor: pointer
  text-decoration: none
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease, filter .2s ease

  &:active
    transform: translateY(0) scale(.98)

.botao-whats
  background: #2b74eb
  color: #ffffff
  box-shadow: 0 14px 32px rgba(20,70,170,.42)

  &:hover
    background: #1b5fd0
    box-shadow: 0 18px 40px rgba(20,70,170,.5)

.botao-combo
  background: #ffd23f
  color: #052a54
  box-shadow: 0 14px 32px rgba(120,80,0,.30)

  &:hover
    filter: brightness(1.05)
    transform: translateY(-2px)
    box-shadow: 0 18px 40px rgba(120,80,0,.38)

/* ---- provas sociais ---- */
.provas-hero
  margin: 6px 0 0
  padding: 0
  list-style: none
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 8px 22px

  li
    display: inline-flex
    align-items: center
    gap: 6px
    color: rgba(255,255,255,.94)
    font-weight: 700
    font-size: clamp(13px, 1.5vw, 15px)
    text-shadow: 0 1px 8px rgba(3,18,50,.4)

    :deep(svg)
      color: #46e39b

/* ---- nuvem divisória ---- */
.divisoria-nuvem
  position: absolute
  left: 0
  right: 0
  bottom: -1px
  z-index: 2
  line-height: 0
  pointer-events: none

.nuvem-svg
  display: block
  width: 100%
  height: clamp(60px, 9vw, 130px)

  path
    fill: #ffffff

/* ---- responsivo ---- */
@media (max-width: 768px)
  .fundo-hero
    background-position: 50% 42%

  .titulo-hero
    font-size: clamp(36px, 12vw, 60px)

  .acoes-hero
    width: 100%
    flex-direction: column

  .botao
    width: min(340px, 88vw)

@media (max-width: 480px)
  .conteudo-hero
    padding-bottom: 104px
    gap: 14px
</style>
