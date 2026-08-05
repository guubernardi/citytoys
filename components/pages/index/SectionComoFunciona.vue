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
        <p class="kicker-funciona">Passo a passo</p>
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
              <div v-if="s.temChat" class="chat-mockup" aria-hidden="true">
                <div class="chat-top">
                  <span class="chat-avatar">
                    <img src="/images/logo-citytoys.svg" alt="" />
                  </span>
                  <div class="chat-id">
                    <span class="chat-nome">City Toys</span>
                    <span class="chat-status">online</span>
                  </div>
                </div>

                <div class="chat-body">
                  <div class="bolha bolha-out">
                    Oi! Tem Castelinho pro dia 12? 🎉
                    <span class="bolha-hora">09:41 ✓✓</span>
                  </div>
                  <div class="bolha bolha-in">Temos sim! Já reservei a data pra você 🎈</div>
                  <div class="bolha bolha-out">
                    Perfeito, muito obrigada! 🥳
                    <span class="bolha-hora">09:42 ✓✓</span>
                  </div>
                </div>
              </div>

              <div v-else-if="s.temCaminhao" class="caminhao-scene" aria-hidden="true">
                <div class="road">
                  <span class="dash"></span>
                </div>

                <img class="caminhao" src="/images/caminhao-citytoys.webp" alt="" loading="lazy" decoding="async" />
              </div>

              <img
                v-else
                :src="s.imageSrc"
                :alt="s.imageAlt"
                loading="lazy"
                decoding="async"
                itemprop="image"
              />
            </div>
          </div>

          <span class="passo-agua" aria-hidden="true"></span>
        </article>
      </div>
    </div>

    <div class="onda-transicao" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path
          class="onda-fill"
          d="M0,40 C420,120 1020,120 1440,40 L1440,120 L0,120 Z"
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
  temChat?: boolean
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
    temChat: true
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
  background: #eaf1fb
  overflow: hidden
  padding: 76px 0
  padding-bottom: calc(80px + 100px)
  font-family: var(--fonte)

  .container
    position: relative
    z-index: 2
    max-width: var(--largura-max)
    margin: 0 auto
    padding: 0 var(--container-px)

.cabecalho-funciona
  text-align: left
  max-width: 860px
  margin: 0 auto 26px

.kicker-funciona
  text-align: center
  text-transform: uppercase
  font-weight: 900
  font-size: 13px
  letter-spacing: .6px
  color: #2b74eb
  margin: 0 0 8px

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
  display: flex
  align-items: center
  gap: 22px
  padding: 26px 30px
  border-radius: 24px
  background: #fff
  border: 1px solid #e3ebf5
  border-left-width: 5px
  box-shadow: 0 12px 28px rgba(18, 48, 98, .08)

.passo-agua
  display: none

.passo--amarelo
  border-left-color: #ffd23f
  .passo-num
    background: #ffd23f
    color: #052a54

.passo--verde
  border-left-color: #43d38d
  .passo-num
    background: #43d38d

.passo--azul
  border-left-color: #2b74eb
  .passo-num
    background: #2b74eb

.passo-num
  flex: 0 0 auto
  width: 54px
  height: 54px
  display: grid
  place-items: center
  border-radius: 999px
  color: #fff
  font-weight: 1000
  font-size: 1.45rem
  background: #ffd23f

.passo-grid
  flex: 1
  min-width: 0
  display: grid
  grid-template-columns: 1.3fr 0.8fr
  gap: 20px
  align-items: center

.passo-textos
  min-width: 0

.passo-titulo
  font-size: 1.35rem
  font-weight: 900
  color: #15264b

.passo-desc
  margin-top: 6px
  color: rgba(21, 38, 75, 0.78)
  line-height: 1.5
  max-width: 420px

.passo-ilustra
  display: flex
  justify-content: flex-end
  align-items: center

  img
    max-width: 240px
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

/* ---- mockup de conversa (passo 2) ---- */
.chat-mockup
  width: 100%
  max-width: 250px
  border-radius: 26px
  overflow: hidden
  background: #ece5dd
  border: 5px solid #10233d
  box-shadow: 0 16px 30px rgba(10, 40, 90, .2)

.chat-top
  display: flex
  align-items: center
  gap: 8px
  padding: 11px 12px
  background: #128c7e
  color: #fff

.chat-avatar
  width: 34px
  height: 34px
  border-radius: 50%
  background: #fff
  display: grid
  place-items: center
  overflow: hidden

  img
    width: 84%
    height: 84%
    object-fit: contain

.chat-id
  display: flex
  flex-direction: column
  line-height: 1.15

.chat-nome
  font-weight: 800
  font-size: .82rem

.chat-status
  font-size: .64rem
  opacity: .85

.chat-body
  display: flex
  flex-direction: column
  gap: 8px
  padding: 14px 12px
  min-height: 150px

.bolha
  max-width: 84%
  padding: 7px 10px
  border-radius: 12px
  font-size: .74rem
  line-height: 1.35
  color: #111b21
  box-shadow: 0 1px 1px rgba(0, 0, 0, .08)

.bolha-in
  align-self: flex-start
  background: #fff
  border-top-left-radius: 3px

.bolha-out
  align-self: flex-end
  background: #d9fdd3
  border-top-right-radius: 3px

.bolha-hora
  display: block
  text-align: right
  font-size: .56rem
  color: #5b7083
  margin-top: 2px

.caminhao-scene
  position: relative
  width: 100%
  max-width: 320px
  height: 150px
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
    height: 100px

.onda-fill
  fill: #0b4aa2

@media (max-width: 700px)
  .passo
    align-items: flex-start
    gap: 16px
    padding: 22px 20px

  .passo-grid
    grid-template-columns: 1fr
    gap: 16px

  .passo-num
    width: 46px
    height: 46px
    font-size: 1.25rem

  .passo-ilustra
    justify-content: flex-start

  .passo-ilustra img
    max-width: 200px

  .caminhao-scene
    max-width: 100%
</style>
