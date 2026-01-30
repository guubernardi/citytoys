<!-- components/sections/SecaoComoFunciona.vue -->
<template>
  <section
    ref="secEl"
    class="secao-como-funciona"
    id="como-funciona"
    aria-label="Como funciona o aluguel"
    aria-labelledby="como-funciona-titulo"
    itemscope
    itemtype="https://schema.org/HowTo"
  >
    <meta itemprop="name" content="Como alugar brinquedos com a City Toys" />
    <meta
      itemprop="description"
      content="Passo a passo para escolher o brinquedo, agendar no WhatsApp e receber a entrega com montagem no Rio de Janeiro."
    />

    <div class="container">
      <header class="cabecalho-funciona" id="como-funciona-cabecalho" data-reveal>
        <h2 class="titulo-funciona" id="como-funciona-titulo">Alugar com a City Toys é muito fácil!</h2>
        <p class="subtitulo-funciona" id="como-funciona-subtitulo">Escolha, agende e a gente cuida do resto 😉</p>
      </header>

      <div class="lista-passos" id="como-funciona-passos" role="list" aria-label="Passos do aluguel">
        <article
          v-for="s in passos"
          :key="s.id"
          :id="s.id"
          class="passo"
          :class="[
            s.passoClass,
            s.temCaminhao ? 'passo--caminhao' : '',
            s.pos === 1 ? 'reveal-left' : '',
            s.pos === 2 ? 'reveal-right' : '',
            s.temCaminhao ? 'no-reveal animar' : '',
          ]"
          :data-reveal="s.pos <= 2 ? '' : null"
          role="listitem"
          itemprop="step"
          itemscope
          itemtype="https://schema.org/HowToStep"
        >
          <meta itemprop="position" :content="String(s.pos)" />
          <span class="passo-num" aria-hidden="true">{{ s.pos }}</span>

          <div class="passo-grid">
            <div class="passo-textos">
              <h3 class="passo-titulo" itemprop="name">{{ s.titulo }}</h3>
              <p class="passo-desc" itemprop="text">{{ s.desc }}</p>
            </div>

            <div class="passo-ilustra">
              <img
                v-if="!s.temCaminhao"
                :src="s.imageSrc"
                :alt="s.imageAlt"
                loading="lazy"
                decoding="async"
                itemprop="image"
              />
              
              <div v-else class="caminhao-scene" aria-hidden="true">
                <div class="road">
                  <span class="dash"></span>
                </div>

                <img class="caminhao" src="/images/caminhao-citytoys.webp" alt="" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>

          <span class="passo-agua" aria-hidden="true"></span>
        </article>
      </div>
    </div>

    <div class="onda-transicao" aria-hidden="true">
      <svg viewBox="0 0 1440 160" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          class="onda-fill"
          d="M0,96 C240,160 480,32 720,96 C960,160 1200,32 1440,96 L1440,160 L0,160 Z"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type Passo = {
  id: string
  pos: number
  passoClass: string
  titulo: string
  desc: string
  imageSrc?: string
  imageAlt?: string
  temCaminhao?: boolean
}

const secEl = ref<HTMLElement | null>(null)

const passos = ref<Passo[]>([
  {
    id: 'passo-1-escolha',
    pos: 1,
    passoClass: 'passo--amarelo',
    titulo: 'Escolha o brinquedo',
    desc: 'Veja as opções e escolha o brinquedo ideal para sua festa.',
    imageSrc: '/images/brinquedo-astrounata.png',
    imageAlt: 'Mascote astronauta da City Toys representando a escolha do brinquedo'
  },
  {
    id: 'passo-2-agende',
    pos: 2,
    passoClass: 'passo--verde',
    titulo: 'Agende a data',
    desc: 'Confirmamos a disponibilidade rapidinho pelo WhatsApp.',
    imageSrc: '/images/passo-whats.webp',
    imageAlt: 'Agendamento e confirmação do aluguel pelo WhatsApp'
  },
  {
    id: 'passo-3-entrega',
    pos: 3,
    passoClass: 'passo--azul',
    titulo: 'Entregamos e montamos',
    desc: 'Levamos, montamos e retiramos tudo no horário combinado.',
    temCaminhao: true
  }
])

let io: IntersectionObserver | null = null

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

onMounted(() => {
  const root = secEl.value
  if (!root) return

  const revealEls = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))

  if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('is-inview'))
    return
  }

  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target as HTMLElement
        el.classList.add('is-inview')
        io?.unobserve(el)
      })
    },
    { threshold: 0.12, rootMargin: '0px 0px 160px 0px' }
  )

  revealEls.forEach((el) => io?.observe(el))
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<style lang="sass" scoped>
.secao-como-funciona
  position: relative
  background: #f4f7fb
  overflow: hidden
  padding: 76px 0
  padding-bottom: calc(80px + 160px)
  font-family: var(--fonte)

  .container
    position: relative
    z-index: 2
    max-width: 1100px
    margin: 0 auto
    padding: 0 20px

.cabecalho-funciona
  text-align: left
  max-width: 860px
  margin: 0 auto 26px

.titulo-funciona
  font-size: clamp(1.6rem, 2.1vw, 2.2rem)
  font-weight: 800
  letter-spacing: -0.02em
  color: #15264b
  display: flex
  justify-content: center
  align-items: center

.subtitulo-funciona
  margin-top: 8px
  font-size: 1.05rem
  color: rgba(21, 38, 75, 0.78)
  display: flex
  justify-content: center

.lista-passos
  max-width: 980px
  margin: 22px auto 0
  display: grid
  gap: 18px

.passo
  position: relative
  border-radius: 22px
  background: rgba(255, 255, 255, 0.92)
  box-shadow: 0 18px 45px rgba(18, 48, 98, 0.16), 0 6px 16px rgba(18, 48, 98, 0.10)
  overflow: hidden
  border: 1px solid rgba(255, 255, 255, 0.7)

  &::before
    content: ""
    position: absolute
    left: 14px
    right: 14px
    top: 10px
    height: 10px
    border-radius: 999px
    opacity: 0.95
    background: #ffc94a

  &::after
    content: ""
    position: absolute
    left: 18px
    right: 18px
    bottom: -16px
    height: 28px
    border-radius: 999px
    background: #feffff
    filter: blur(0.2px)
    z-index: 0
    pointer-events: none

.passo--amarelo
  &::before
    background: #ffc94a
  .passo-num
    background: #ffc94a

.passo--verde
  &::before
    background: #7ad6b4
  .passo-num
    background: #7ad6b4

.passo--azul
  &::before
    background: #6fb7ff
  .passo-num
    background: #6fb7ff

.passo-grid
  position: relative
  z-index: 1
  display: grid
  grid-template-columns: 1.2fr 0.8fr
  gap: 18px
  align-items: center
  padding: 38px 36px 34px

.passo-num
  position: absolute
  left: 18px
  top: 30px
  width: 42px
  height: 42px
  display: grid
  place-items: center
  border-radius: 999px
  color: #fff
  font-weight: 900
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.12)
  z-index: 2
  background: #ffc94a

.passo-textos
  padding-left: 52px

.passo-titulo
  font-size: 1.25rem
  font-weight: 800
  color: #15264b

.passo-desc
  margin-top: 8px
  color: rgba(21, 38, 75, 0.78)
  line-height: 1.5
  max-width: 420px

.passo-ilustra
  display: flex
  justify-content: flex-end
  align-items: center

  img
    max-width: 260px
    width: 100%
    height: auto
    filter: drop-shadow(0 12px 18px rgba(10, 40, 90, 0.12))

[data-reveal]
  opacity: 0
  transform: translateX(-22px)
  transition: opacity .55s ease, transform .55s ease

.reveal-right[data-reveal]
  transform: translateX(22px)

.is-inview[data-reveal]
  opacity: 1
  transform: translateX(0)

.no-reveal
  opacity: 1 !important
  transform: none !important

.caminhao-scene
  position: relative
  width: 100%
  max-width: 320px
  height: 120px
  border-radius: 18px
  overflow: hidden
  background: linear-gradient(180deg, rgba(230, 245, 255, 0.75), rgba(230, 245, 255, 0))

.road
  position: absolute
  left: 10px
  right: 10px
  bottom: 14px
  height: 10px
  border-radius: 999px
  background: rgba(30, 70, 140, 0.10)
  overflow: hidden

  .dash
    position: absolute
    inset: 0
    background: repeating-linear-gradient(90deg, rgba(21, 38, 75, 0.35) 0 18px, rgba(21, 38, 75, 0) 18px 34px)
    opacity: 0.35
    animation: road-move 0.55s linear infinite

.caminhao
  position: absolute
  top: -10px
  left: -16%
  width: 240px
  max-width: none
  will-change: transform
  filter: drop-shadow(0 14px 18px rgba(10, 40, 90, 0.18))
  animation: caminhao-drive 4.8s linear infinite

@keyframes caminhao-drive
  0%
    transform: translateX(0) translateY(0)
  10%
    transform: translateX(18%) translateY(-1px)
  30%
    transform: translateX(55%) translateY(0)
  60%
    transform: translateX(115%) translateY(-1px)
  100%
    transform: translateX(185%) translateY(0)

@keyframes road-move
  from
    transform: translateX(0)
  to
    transform: translateX(-34px)

.onda-transicao
  position: absolute
  left: 0
  bottom: -2px
  width: 100%
  line-height: 0
  z-index: 1
  pointer-events: none

  svg
    display: block
    width: 100%
    height: 160px

.onda-fill
  fill: #0b4aa2

@media (max-width: 860px)
  .passo-grid
    grid-template-columns: 1fr
    gap: 14px

  .passo-ilustra
    justify-content: flex-start

  .caminhao-scene
    max-width: 100%

@media (max-width: 520px)
  .passo-grid
    padding: 24px 18px 28px

  .passo-num
    left: 14px
    top: 26px
    width: 40px
    height: 40px

  .passo-textos
    padding-left: 50px

  .passo-ilustra img
    max-width: 230px
</style>
