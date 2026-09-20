<template>
  <section
    class="secao-beneficios"
    :class="{ 'secao-tema': temaAtivo }"
    id="beneficios"
    aria-label="Diferenciais da City Toys"
  >
    <div class="onda-divisoria top" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path
          d="M0,40 C420,120 1020,120 1440,40 L1440,120 L0,120 Z"
          fill="#0B4AA2"
        />
      </svg>
    </div>

    <!-- Noite de festa: fogos de artifício e estrelinhas no fundo azul-escuro.
         Ficam atrás do conteúdo; os fogos que caem atrás dos cards aparecem
         desfocados pelo vidro. -->
    <div v-if="temaAtivo" class="enfeites-beneficios" aria-hidden="true">
      <svg
        v-for="(f, i) in fogos"
        :key="`fogo-${i}`"
        class="fogo"
        :class="{ 'fogo--mobile': f.mobile }"
        viewBox="-50 -50 100 100"
        :style="{ '--top': `${f.top}%`, '--left': `${f.left}%`, '--tam': `${f.tamanho}px`, '--atraso': `${f.atraso}s` }"
      >
        <line
          v-for="k in 12"
          :key="`raio-${k}`"
          x1="0"
          y1="-14"
          x2="0"
          y2="-38"
          :stroke="f.cores[k % 2]"
          :transform="`rotate(${k * 30})`"
        />
        <circle
          v-for="k in 12"
          :key="`ponto-${k}`"
          cx="0"
          cy="-46"
          r="2.6"
          :fill="f.cores[(k + 1) % 2]"
          :transform="`rotate(${k * 30 + 15})`"
        />
      </svg>

      <span
        v-for="(e, i) in estrelas"
        :key="`estrela-${i}`"
        class="estrelinha"
        :class="{ 'estrelinha--mobile': e.mobile }"
        :style="{ '--top': `${e.top}%`, '--left': `${e.left}%`, '--tam': `${e.tamanho}px`, '--atraso': `${e.atraso}s` }"
      ></span>
    </div>

    <div class="container">
      <header class="cabecalho text-center">
        <span class="eyebrow" :class="{ 'eyebrow--tema': temaAtivo }">
          <SvgIcone v-if="temaAtivo" nome="presente" :tamanho="14" />
          BENEFÍCIOS
        </span>
        <!-- &nbsp; mantém "City Toys" sempre na mesma linha. -->
        <h2 class="titulo">
          Por que a City&nbsp;Toys é
          <LetrasColoridas v-if="temaAtivo" texto="diferente" fundo="noite" />
          <template v-else>diferente</template>?
        </h2>
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
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import LetrasColoridas from '~/components/global/tema/LetrasColoridas.vue'

// Na temporada de Dia das Crianças o azul-escuro vira noite de festa: fogos,
// estrelinhas, ícones coloridos e "diferente" em letras de inflável. Os
// benefícios em si não mudam.
const { temaAtivo } = useTemaSazonal()

// Posições fixas (sem aleatoriedade) pra sair igual no servidor e no
// navegador. top/left em % da seção; os marcados "mobile" aparecem no celular.
type Fogo = { top: number; left: number; tamanho: number; cores: [string, string]; atraso: number; mobile?: boolean }

const fogos: Fogo[] = [
  { top: 16, left: 12, tamanho: 130, cores: ['#ffd23f', '#ff6b6b'], atraso: 0, mobile: true },
  { top: 12, left: 86, tamanho: 110, cores: ['#4ade80', '#22d3ee'], atraso: -1.1, mobile: true },
  { top: 74, left: 94, tamanho: 150, cores: ['#d8b4fe', '#ff9ecb'], atraso: -2.2 },
  { top: 80, left: 4, tamanho: 120, cores: ['#ffb347', '#ffd23f'], atraso: -1.7 }
]

type Estrela = { top: number; left: number; tamanho: number; atraso: number; mobile?: boolean }

const estrelas: Estrela[] = [
  { top: 9, left: 28, tamanho: 10, atraso: 0, mobile: true },
  { top: 22, left: 70, tamanho: 8, atraso: -0.6 },
  { top: 30, left: 6, tamanho: 12, atraso: -1.2 },
  { top: 8, left: 58, tamanho: 7, atraso: -1.8, mobile: true },
  { top: 26, left: 95, tamanho: 9, atraso: -0.9 },
  { top: 90, left: 30, tamanho: 8, atraso: -1.5, mobile: true },
  { top: 88, left: 70, tamanho: 10, atraso: -0.3, mobile: true },
  { top: 50, left: 2, tamanho: 7, atraso: -2.1 }
]

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

/* ---- tema sazonal (Dia das Crianças) ---- */
/* Tudo abaixo depende da classe .secao-tema na <section>, que entra e sai
   junto com a campanha (composables/useTemaSazonal.ts). */

/* Fundo "noite de festa": o azul chapado da marca vira um céu que escurece
   do índigo pro roxo, com brilhos suaves atrás dos fogos de cima. A cor do
   topo vem do token --tema-noite-topo, que a onda do Passo a passo também usa. */
/* A 1ª camada garante o topo exatamente na cor da onda do Passo a passo (os
   brilhos de baixo iam até a borda e desenhavam uma linha reta na emenda). */
.secao-beneficios.secao-tema
  background-color: var(--tema-noite-topo)
  background-image: linear-gradient(180deg, var(--tema-noite-topo) 0, transparent 140px), radial-gradient(circle at 12% 18%, rgba(255,210,63,.16), rgba(255,210,63,0) 28%), radial-gradient(circle at 88% 14%, rgba(34,211,238,.14), rgba(34,211,238,0) 28%), linear-gradient(180deg, var(--tema-noite-topo) 0%, #3a2a9a 55%, #5b2a8e 100%)

  /* A onda de cima é da mesma cor do fundo e só servia pra emendar com o
     Passo a passo. Por cima do degradê e dos brilhos ela vira uma "segunda
     onda" aparente, então sai: quem faz a emenda é a onda do Passo a passo. */
  .onda-divisoria.top
    display: none

.enfeites-beneficios
  position: absolute
  inset: 0
  z-index: 1
  pointer-events: none
  overflow: hidden

/* Fogo de artifício: raios e pontinhos que abrem do centro e somem. O centro
   fica em --top/--left (a margem negativa desconta metade do tamanho). */
.fogo
  position: absolute
  top: var(--top)
  left: var(--left)
  width: var(--tam)
  height: var(--tam)
  margin: calc(var(--tam) / -2) 0 0 calc(var(--tam) / -2)
  overflow: visible
  opacity: 0
  animation: fogo-estourar 3.4s ease-out infinite
  animation-delay: var(--atraso)

  line
    stroke-width: 3.5
    stroke-linecap: round

@keyframes fogo-estourar
  0%
    transform: scale(.15)
    opacity: 0
  12%
    opacity: 1
  45%
    transform: scale(1)
    opacity: 1
  75%
    transform: scale(1.12)
    opacity: 0
  100%
    transform: scale(1.12)
    opacity: 0

/* Estrelinha de quatro pontas piscando no céu. */
.estrelinha
  position: absolute
  top: var(--top)
  left: var(--left)
  width: var(--tam)
  height: var(--tam)
  background: #fff6c2
  clip-path: polygon(50% 0, 61% 39%, 100% 50%, 61% 61%, 50% 100%, 39% 61%, 0 50%, 39% 39%)
  animation: estrela-piscar 2.4s ease-in-out infinite
  animation-delay: var(--atraso)

@keyframes estrela-piscar
  0%, 100%
    opacity: .25
    transform: scale(.7)
  50%
    opacity: 1
    transform: scale(1.15)

.eyebrow--tema
  color: #ffd23f
  opacity: 1 !important

  :deep(svg)
    vertical-align: -2px
    margin-right: 4px

/* Cada benefício ganha uma cor: o ícone vira bolinha colorida com brilho e,
   no hover, o card acende na mesma cor. */
.secao-tema
  .card-beneficio:nth-child(1)
    --cor-tema: #00c2c7

  .card-beneficio:nth-child(2)
    --cor-tema: #ff9a00

  .card-beneficio:nth-child(3)
    --cor-tema: #ff3b3b

  .card-beneficio:nth-child(4)
    --cor-tema: #2ecc71

  .card-beneficio:nth-child(5)
    --cor-tema: #a45cff

  .card-beneficio:nth-child(6)
    --cor-tema: #ffd23f

  .icon-box
    background-color: var(--cor-tema)
    background-image: radial-gradient(circle at 32% 28%, rgba(255,255,255,.55) 0 10%, rgba(255,255,255,0) 34%)
    border-color: rgba(255,255,255,.35)
    box-shadow: 0 8px 18px rgba(0,0,0,.18)

  /* no amarelo o ícone branco some: vai azul-marinho */
  .card-beneficio:nth-child(6) .icon-box
    color: #052a54

  .card-beneficio:hover
    border-color: var(--cor-tema)
    box-shadow: 0 18px 55px rgba(0,0,0,.25), 0 0 34px -8px var(--cor-tema)

    .icon-box
      background-color: var(--cor-tema)
      background-image: radial-gradient(circle at 32% 28%, rgba(255,255,255,.55) 0 10%, rgba(255,255,255,0) 34%)
      border-color: rgba(255,255,255,.5)

  .dots .dot.active
    background: linear-gradient(90deg, #ffd23f, #ff6b6b, #d8b4fe)

/* No celular não tem hover: quem acende é o card em destaque no carrossel.
   Os fogos sobem pro alto (acima do título) e diminuem; os de trás dos cards
   e parte das estrelas saem. */
@media (max-width: 899px)
  .secao-tema .card-beneficio.is-active
    border-color: var(--cor-tema)

  .fogo
    top: 6%
    width: calc(var(--tam) * .6)
    height: calc(var(--tam) * .6)
    margin: calc(var(--tam) * -.3) 0 0 calc(var(--tam) * -.3)

  .fogo:not(.fogo--mobile),
  .estrelinha:not(.estrelinha--mobile)
    display: none

@media (prefers-reduced-motion: reduce)
  .fogo
    animation: none
    opacity: .7

  .estrelinha
    animation: none
    opacity: .8
</style>