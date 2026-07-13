<template>
  <section class="secao-beneficios" id="beneficios" aria-label="Diferenciais da City Toys">
    <div class="onda-divisoria top" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,40 C420,120 1020,120 1440,40 L1440,120 L0,120 Z"
          fill="#0B4AA2"
        />
      </svg>
    </div>

    <div class="container">
      <header class="cabecalho text-center">
        <span class="eyebrow">BENEFÍCIOS</span>
        <h2 class="titulo">Por que a City Toys é diferente?</h2>
        <p class="subtitulo">Tudo pensado pra sua festa ser tranquila do começo ao fim.</p>
      </header>

      <span class="sr-only">No celular, você pode arrastar para o lado para ver mais benefícios.</span>

      <div ref="trackRef" class="beneficios-grid" @scroll="onScroll">
        <article
          v-for="(item, index) in beneficios"
          :key="index"
          class="card-beneficio"
          :class="{ 'is-active': activeIndex === index }"
          :ref="(el) => setCardRef(el as HTMLElement | null, index)"
        >
          <div class="icon-box">
            <SvgIcone :nome="item.icone" :tamanho="24" />
          </div>
          <div class="content">
            <h3>{{ item.titulo }}</h3>
            <p>{{ item.desc }}</p>
          </div>
        </article>
      </div>

      <div class="mobile-controls">
        <div class="dots">
          <button
            v-for="(_, index) in beneficios"
            :key="index"
            class="dot"
            :class="{ active: activeIndex === index }"
            @click="scrollToIndex(index)"
            :aria-label="`Ir para benefício ${index + 1}`"
          ></button>
        </div>
      </div>
    </div>

    <div class="onda-divisoria bottom" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,40 C420,120 1020,120 1440,40 L1440,120 L0,120 Z"
          fill="#f7fbff"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'

const trackRef = ref<HTMLElement | null>(null)

const cardRefs = ref<(HTMLElement | null)[]>([])
function setCardRef(el: HTMLElement | null, index: number) {
  cardRefs.value[index] = el
}

const activeIndex = ref(0)
let scrollTimeout: number | null = null

// Dados
const beneficios = [
  {
    titulo: 'Higienização Total',
    desc: 'Tudo lavado e desinfetado. Zero sujeira, zero preocupação.',
    icone: 'gota'
  },
  {
    titulo: 'Entrega e retirada no horário',
    desc: 'Chegamos no combinado pra sua festa começar sem correria.',
    icone: 'relogio'
  },
  {
    titulo: 'Montagem sem dor de cabeça',
    desc: 'Nossa equipe monta tudo rapidinho e deixa pronto pro uso.',
    icone: 'ferramenta'
  },
  {
    titulo: 'Segurança Garantida',
    desc: 'Brinquedos revisados antes de cada festa.',
    icone: 'escudo'
  },
  {
    titulo: 'Suporte',
    desc: 'Precisou? Você chama e a gente resolve rápido.',
    icone: 'headset'
  },
  {
    titulo: 'Variedade',
    desc: 'Mais de 20 brinquedos disponíveis.',
    icone: 'quadrados'
  }
]

const scrollToIndex = (index: number) => {
  const track = trackRef.value
  if (!track) return

  const card = cardRefs.value[index]
  if (!card) return

  // centraliza o card no viewport do carrossel (mais confiável que "width + gap")
  const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2

  track.scrollTo({
    left: Math.max(0, left),
    behavior: 'smooth'
  })
}

const onScroll = () => {
  if (scrollTimeout) window.clearTimeout(scrollTimeout)

  scrollTimeout = window.setTimeout(() => {
    const track = trackRef.value
    if (!track) return

    const center = track.scrollLeft + track.offsetWidth / 2
    const cards = cardRefs.value.filter(Boolean) as HTMLElement[]
    if (!cards.length) return

    let closestIndex = 0
    let closestDist = Infinity

    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - cardCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIndex = i
      }
    })

    activeIndex.value = closestIndex
  }, 60)
}

onUnmounted(() => {
  if (scrollTimeout) window.clearTimeout(scrollTimeout)
})
</script>

<style lang="sass" scoped>
$cor-bg: var(--bg-azul, #0B4AA2)
$cor-texto: #ffffff
$cor-card-bg: rgba(255, 255, 255, 0.10)
$cor-card-border: rgba(255, 255, 255, 0.15)

.secao-beneficios
  position: relative
  background-color: $cor-bg
  color: $cor-texto
  overflow: hidden
  font-family: var(--fonte)
  width: 100%
  padding: clamp(84px, 8vw, 120px) 0

  .container
    width: 100%
    max-width: var(--largura-max)
    margin: 0 auto
    padding: 0 var(--container-px)
    position: relative
    z-index: 2
    display: flex
    flex-direction: column
    align-items: center

  .cabecalho
    margin-bottom: clamp(26px, 3.5vw, 46px)
    text-align: center
    max-width: 820px

  .eyebrow
    display: block
    font-size: .85rem
    font-weight: 800
    letter-spacing: 2px
    text-transform: uppercase
    opacity: .85
    margin-bottom: 10px

  .titulo
    font-size: clamp(2rem, 5vw, 3rem)
    font-weight: 1000
    margin: 0 0 14px
    line-height: 1.08

  .subtitulo
    font-size: 1.05rem
    opacity: .92
    max-width: 620px
    margin: 0 auto

  .sr-only
    position: absolute !important
    width: 1px !important
    height: 1px !important
    padding: 0 !important
    margin: -1px !important
    overflow: hidden !important
    clip: rect(0,0,0,0) !important
    white-space: nowrap !important
    border: 0 !important

  .beneficios-grid
    width: 100%
    display: flex
    gap: 20px
    overflow-x: auto
    scroll-snap-type: x mandatory
    padding-bottom: 18px
    scroll-behavior: smooth
    -webkit-overflow-scrolling: touch
    justify-content: flex-start
    scrollbar-width: none

    // melhora snap no mobile (primeiro/último não ficam "cortados")
    scroll-padding-inline: 7.5%

    &::before,
    &::after
      content: ''
      flex: 0 0 7.5%

    &::-webkit-scrollbar
      display: none

    @media (min-width: 900px)
      display: grid
      grid-template-columns: repeat(3, 1fr)
      overflow-x: visible
      scroll-snap-type: none
      justify-content: center
      align-items: stretch

      &::before,
      &::after
        display: none

  .card-beneficio
    flex: 0 0 85%
    max-width: 400px
    scroll-snap-align: center
    scroll-snap-stop: always
    background: $cor-card-bg
    border: 1px solid $cor-card-border
    border-radius: 24px
    padding: 32px 24px
    display: flex
    flex-direction: column
    align-items: center
    text-align: center
    // Se o iPhone for birrento com blur, dá pra comentar as 2 linhas abaixo.
    backdrop-filter: blur(10px)
    -webkit-backdrop-filter: blur(10px)
    position: relative
    overflow: hidden
    opacity: 1 !important
    transform: none !important
    filter: none !important
    transition: transform .28s cubic-bezier(.2,.9,.2,1), background .28s ease, box-shadow .28s ease, border-color .28s ease

    &:hover
      background: rgba(255, 255, 255, 0.14)
      border-color: rgba(255,255,255,.28)
      transform: translate3d(0, -10px, 0) scale(1.02)
      box-shadow: 0 18px 55px rgba(0, 0, 0, 0.25)

      .icon-box
        transform: translate3d(0, -2px, 0) scale(1.03)
        background: rgba(255,255,255,.22)
        border-color: rgba(255,255,255,.30)

        :deep(svg)
          transform: rotate(-6deg) scale(1.06)

    @media (min-width: 900px)
      flex: 1
      max-width: none
      scroll-snap-stop: normal

  .icon-box
    width: 66px
    height: 66px
    background: rgba(255, 255, 255, 0.18)
    border: 1px solid rgba(255,255,255,.18)
    border-radius: 50%
    display: flex
    align-items: center
    justify-content: center
    margin-bottom: 18px
    color: #fff
    transition: transform .28s cubic-bezier(.2,.9,.2,1), background .28s ease, border-color .28s ease

    :deep(svg)
      width: 24px
      height: 24px
      display: block
      transition: transform .28s cubic-bezier(.2,.9,.2,1)

  .content
    h3
      font-size: 1.25rem
      font-weight: 900
      margin-bottom: 12px

    p
      font-size: .95rem
      line-height: 1.5
      opacity: .88
      margin: 0

  .mobile-controls
    display: flex
    justify-content: center
    margin-top: 10px
    width: 100%

    @media (min-width: 900px)
      display: none

  .dots
    display: flex
    gap: 8px
    background: rgba(0,0,0,0.2)
    padding: 8px 12px
    border-radius: 20px

    .dot
      width: 8px
      height: 8px
      border-radius: 50%
      border: none
      background: rgba(255,255,255,0.4)
      cursor: pointer
      transition: transform .25s ease, background .25s ease, width .25s ease, border-radius .25s ease
      padding: 0

      &.active
        background: #fff
        transform: scale(1.15)
        width: 18px
        border-radius: 6px

  .onda-divisoria
    position: absolute
    left: 0
    width: 100%
    line-height: 0
    pointer-events: none
    z-index: 1

    svg
      display: block
      width: 100%
      height: 60px

      @media (min-width: 768px)
        height: 100px

    &.top
      top: 0
      transform: rotate(180deg)

    &.bottom
      bottom: 0
</style>