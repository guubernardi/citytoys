<template>
  <section class="hero" id="inicio" aria-label="Seção principal" :class="{ 'is-loaded': loaded }">
    <div class="decoracoes-hero" aria-hidden="true">
      <img
        class="imagem-brinquedo"
        src="/images/brinquedo-astrounata.png"
        alt=""
        loading="eager"
        decoding="async"
      />

      <img class="imagem-foguete" src="/images/foguete.png" alt="" loading="eager" decoding="async" />
    </div>

    <div class="conteudo-hero" id="hero-conteudo">
      <p class="chamada-hero" id="hero-chamada">A diversão decola aqui</p>

      <h1 class="titulo-hero" id="hero-titulo">
        <span class="sr-only">{{ fullText }}</span>

        <span class="titulo-digitado" id="hero-typewriter" aria-hidden="true">
          {{ typedText }}
        </span>
        <span class="cursor-digitando" id="hero-cursor" aria-hidden="true"></span>
      </h1>

      <div class="acoes-hero" id="hero-acoes">
        <a
          class="botao-whats"
          id="hero-cta-whats"
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/5521984848699?text=Oi%21%20Quero%20um%20or%C3%A7amento%20%F0%9F%98%8A%0AData%3A%20____%0ABairro%3A%20____%0ABrinquedo%3A%20____"
          aria-label="Fazer orçamento no WhatsApp"
        >
          <svg
            fill="currentColor"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            class="icone-whats"
            aria-hidden="true"
          >
            <path
              d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"
            />
          </svg>
          Fazer orçamento
        </a>

        <button
          type="button"
          class="botao-combo"
          id="hero-cta-combo"
          @click="irParaCombo"
          aria-label="Monte seu combo"
        >
          <img
            class="icone-combo"
            src="/images/foguete.png"
            alt=""
            width="36"
            height="36"
            loading="lazy"
            decoding="async"
            aria-hidden="true"
          />

          <span class="now">monte seu combo</span>
          <span class="play">monte seu combo</span>
        </button>
      </div>
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

  &::after
    content: ""
    position: absolute
    inset: -40px
    background-image: url("/images/fundo-header.png")
    background-size: cover
    background-position: center
    background-repeat: no-repeat
    transform: translate3d(0, 0px, 0) scale(1.05)
    will-change: transform
    z-index: 0

  &::before
    content: ""
    position: absolute
    inset: 0
    background: linear-gradient(180deg, rgba(0,0,0,.14) 0%, rgba(0,0,0,.08) 40%, rgba(0,0,0,0) 100%)
    pointer-events: none
    z-index: 1

.conteudo-hero,
.decoracoes-hero
  opacity: 0
  transform: translateY(14px) scale(.995)
  transition: opacity .55s ease, transform .55s ease

.hero.is-loaded .conteudo-hero,
.hero.is-loaded .decoracoes-hero
  opacity: 1
  transform: translateY(0) scale(1)

.chamada-hero,
.titulo-hero,
.acoes-hero
  opacity: 0
  transform: translateY(12px)
  transition: opacity .55s ease, transform .55s ease

.hero.is-loaded .chamada-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .05s

.hero.is-loaded .titulo-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .14s

.hero.is-loaded .acoes-hero
  opacity: 1
  transform: translateY(0)
  transition-delay: .22s

@media (prefers-reduced-motion: reduce)
  .conteudo-hero,
  .decoracoes-hero,
  .chamada-hero,
  .titulo-hero,
  .acoes-hero
    transition: none !important
    transform: none !important
    opacity: 1 !important

.decoracoes-hero
  position: absolute
  inset: 0
  z-index: 2
  pointer-events: none

.imagem-brinquedo
  position: absolute
  left: 60px
  bottom: 35px
  width: min(520px, 52vw)
  height: auto
  filter: drop-shadow(0 22px 30px rgba(0,0,0,.20))
  transform: rotate(-2deg)
  animation: float 4s ease-in-out infinite

.imagem-foguete
  position: absolute
  right: 40px
  bottom: 90px
  width: min(260px, 24vw)
  height: auto
  filter: drop-shadow(0 18px 26px rgba(0,0,0,.18))
  transform: rotate(10deg)
  animation: float-foguete 3s ease-in-out infinite

@keyframes float
  0%, 100%
    transform: translateY(0) rotate(-2deg)
  50%
    transform: translateY(-10px) rotate(-2deg)

@keyframes float-foguete
  0%, 100%
    transform: translateY(0) rotate(10deg)
  50%
    transform: translateY(-15px) rotate(10deg)

.conteudo-hero
  position: relative
  z-index: 3
  width: min(980px, 92vw)
  padding: clamp(28px, 4vw, 54px) 16px clamp(86px, 10vw, 120px)
  text-align: center

  display: flex
  flex-direction: column
  align-items: center
  gap: 14px

.chamada-hero
  margin: 0
  color: #ffffff
  font-weight: 1000
  font-size: clamp(18px, 2.2vw, 32px)
  text-shadow: 0 12px 24px rgba(0,0,0,.18)

.titulo-hero
  margin: 4px 0 0
  color: #ffffff
  font-weight: 1000
  font-size: clamp(18px, 2.1vw, 26px)
  line-height: 1.25
  text-shadow: 0 14px 26px rgba(0,0,0,.18)
  max-width: 760px

.sr-only
  position: absolute
  left: -9999px
  top: auto
  width: 1px
  height: 1px
  overflow: hidden

.titulo-digitado
  white-space: normal

.cursor-digitando
  display: inline-block
  width: 10px
  height: 1.1em
  margin-left: 6px
  background: rgba(255,255,255,.9)
  border-radius: 2px
  transform: translateY(2px)
  animation: piscar .9s steps(1) infinite

@keyframes piscar
  50%
    opacity: 0

@media (prefers-reduced-motion: reduce)
  .cursor-digitando
    animation: none

.acoes-hero
  margin-top: 14px
  display: grid
  gap: 14px
  justify-items: center

.botao-whats
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 12px
  min-height: 54px
  padding: 0 clamp(18px, 5vw, 54px)
  border-radius: 18px
  background: #2b74eb
  color: #ffffff
  font-weight: 1000
  text-decoration: none
  box-shadow: 0 20px 50px rgba(0,0,0,.18)
  font-size: clamp(16px, 2vw, 20px)
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease
  max-width: 92vw

  &:hover
    background: #004dc9
    transform: translateY(-2px)
    box-shadow: 0 25px 60px rgba(0,0,0,.25)

.icone-whats
  width: 28px
  height: 28px

.botao-combo
  display: flex
  align-items: center
  justify-content: center
  gap: 10px
  padding: 0px 40px
  min-height: 54px
  max-width: 92vw
  color: #ffffff
  text-shadow: 2px 2px rgb(116, 116, 116)
  text-transform: uppercase
  cursor: pointer
  border: solid 2px #000
  letter-spacing: 1px
  font-weight: 1000
  font-size: 16px
  background-color: hsl(49deg 98% 60%)
  border-radius: 18px
  position: relative
  overflow: hidden
  transition: all 0.5s ease
  box-shadow: 0 20px 50px rgba(0,0,0,.18)

  &:active
    transform: scale(0.95)
    transition: all 100ms ease

  .icone-combo
    width: 36px
    height: 36px
    object-fit: contain
    transition: all 0.5s ease
    z-index: 2
    filter: drop-shadow(0 8px 14px rgba(0,0,0,.18))

  .play
    transition: all 0.5s ease
    transition-delay: 300ms

  &:hover .icone-combo
    transform: scale(3) translate(50%)

  .now
    position: absolute
    left: 0
    transform: translateX(-100%)
    transition: all 0.5s ease
    z-index: 2
    padding-left: 18px

  &:hover .now
    transform: translateX(10px)
    transition-delay: 300ms

  &:hover .play
    transform: translateX(200%)
    transition-delay: 300ms

@media (max-width: 980px)
  .imagem-brinquedo,
  .imagem-foguete
    display: none

@media (max-width: 480px)
  .conteudo-hero
    padding-bottom: 96px

  .icone-whats
    width: 24px
    height: 24px
</style>
