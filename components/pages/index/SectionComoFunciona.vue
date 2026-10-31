<!-- components/pages/index/SectionComoFunciona.vue -->
<!-- "Passo a passo" (Figma: Como funciona, 22:1061). O layout é o mesmo com
     ou sem tema; no Natal os números viram bolas penduradas num varal dourado,
     caem flocos no fundo e as imagens dos passos 1 e 3 ganham versão natalina. -->
<template>
  <section
    ref="secEl"
    class="secao-como-funciona"
    :class="{ 'secao-tema': temaAtivo }"
    id="como-funciona"
    aria-labelledby="como-funciona-titulo"
    itemscope
    itemtype="https://schema.org/HowTo"
  >
    <meta itemprop="name" content="Como alugar brinquedos com a City Toys" />
    <meta
      itemprop="description"
      content="Passo a passo para escolher o brinquedo, agendar no WhatsApp e receber a entrega com montagem no Rio de Janeiro."
    />

    <!-- A seção de cima (branca) desce em arco sobre o fundo gelo. -->
    <svg class="curva-topo" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 0H1440C960 80 480 80 0 0Z" />
    </svg>

    <template v-if="temaAtivo">
      <img
        v-for="f in flocos"
        :key="f.id"
        class="floco"
        :class="{ 'floco--desktop': f.soDesktop }"
        src="/images/natal/passos-neve.svg"
        alt=""
        aria-hidden="true"
        :width="f.tamanho"
        :height="f.tamanho"
        :style="{ left: `${f.esquerda}%`, top: `${f.topo}px`, opacity: f.opacidade }"
      />
    </template>

    <div class="container">
      <header class="cabecalho-funciona" id="como-funciona-cabecalho" data-reveal>
        <p class="olho-funciona">
          <SvgIcone v-if="temaAtivo" class="olho-estrela" nome="estrela" :tamanho="12" />
          Passo a passo
        </p>

        <!-- &nbsp; mantém "City Toys" sempre na mesma linha. -->
        <h2 class="titulo-funciona" id="como-funciona-titulo">
          Alugar com a City&nbsp;Toys é muito <span class="titulo-destaque">fácil</span>!
        </h2>
        <p class="subtitulo-funciona" id="como-funciona-subtitulo">Escolha, agende e a gente cuida do resto</p>
      </header>

      <div class="lista-passos" id="como-funciona-passos" role="list" aria-label="Passos do aluguel">
        <!-- Varal de onde pendem as bolas (só no Natal, só no desktop). -->
        <span v-if="temaAtivo" class="varal" aria-hidden="true"></span>

        <article
          v-for="(s, i) in passos"
          :key="s.id"
          :id="s.id"
          class="passo"
          :class="s.classeCor"
          :style="{ '--atraso': `${i * 120}ms` }"
          data-reveal
          role="listitem"
          itemprop="step"
          itemscope
          itemtype="https://schema.org/HowToStep"
        >
          <meta itemprop="position" :content="String(s.pos)" />

          <span v-if="temaAtivo" class="passo-fio" aria-hidden="true"></span>

          <!-- Número do passo: bola de Natal com o tema, círculo simples sem ele.
               Os dois ocupam o mesmo lugar, então o card não muda. -->
          <div class="passo-marcador" :class="{ 'passo-marcador--simples': !temaAtivo }" aria-hidden="true">
            <img v-if="temaAtivo" class="passo-enfeite" :src="s.enfeiteSrc" alt="" width="68" height="92" />
            <span class="passo-num">{{ s.pos }}</span>
          </div>

          <h3 class="passo-titulo" itemprop="name">{{ s.titulo }}</h3>
          <p class="passo-desc" itemprop="text">{{ s.desc }}</p>

          <div class="passo-midia" :class="`passo-midia--${s.midia}`">
            <img
              v-if="s.midia === 'imagem'"
              class="midia-brinquedo"
              :src="imagemBrinquedo.src"
              :alt="imagemBrinquedo.alt"
              :width="imagemBrinquedo.largura"
              :height="imagemBrinquedo.altura"
              loading="lazy"
              decoding="async"
              itemprop="image"
            />

            <div v-else-if="s.midia === 'conversa'" class="celular" aria-hidden="true">
              <div class="celular-topo">
                <span class="celular-avatar">
                  <img src="/images/logo-citytoys.svg" alt="" width="28" height="19" />
                </span>
                <div class="celular-contato">
                  <span class="celular-nome">City Toys</span>
                  <span class="celular-status">online</span>
                </div>
              </div>

              <div class="celular-mensagens">
                <div
                  v-for="m in conversa"
                  :key="m.id"
                  class="mensagem-linha"
                  :class="`mensagem-linha--${m.lado}`"
                >
                  <div class="mensagem" :class="`mensagem--${m.lado}`">
                    <span class="mensagem-texto">{{ m.texto }}</span>
                    <span class="mensagem-hora">{{ m.hora }}</span>
                  </div>
                </div>
              </div>
            </div>

            <template v-else>
              <span class="caminhao-sombra" aria-hidden="true"></span>
              <img
                class="caminhao"
                :class="{ 'caminhao--padrao': !temaAtivo }"
                :src="imagemCaminhao.src"
                alt=""
                aria-hidden="true"
                :width="imagemCaminhao.largura"
                :height="imagemCaminhao.altura"
                loading="lazy"
                decoding="async"
              />
            </template>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

const { temaAtivo, copy } = useTemaSazonal()

type Midia = 'imagem' | 'conversa' | 'caminhao'

type Passo = {
  id: string
  pos: number
  classeCor: string
  enfeiteSrc: string
  titulo: string
  desc: string
  midia: Midia
}

const secEl = ref<HTMLElement | null>(null)

const passos = computed<Passo[]>(() => [
  {
    id: 'passo-1-escolha',
    pos: 1,
    classeCor: 'passo--um',
    enfeiteSrc: '/images/natal/passos-bola-vermelha.svg',
    titulo: 'Escolha o brinquedo',
    desc: temaAtivo.value
      ? 'Veja as opções e escolha o ideal para a sua festa de fim de ano.'
      : 'Veja as opções e escolha o ideal para a sua festa.',
    midia: 'imagem'
  },
  {
    id: 'passo-2-agende',
    pos: 2,
    classeCor: 'passo--dois',
    enfeiteSrc: '/images/natal/passos-bola-verde.svg',
    titulo: 'Agende a data',
    desc: 'Confirmamos a disponibilidade rapidinho pelo WhatsApp.',
    midia: 'conversa'
  },
  {
    id: 'passo-3-entrega',
    pos: 3,
    classeCor: 'passo--tres',
    enfeiteSrc: '/images/natal/passos-bola-dourada.svg',
    titulo: 'Entregamos e montamos',
    desc: 'Levamos, montamos e retiramos tudo no horário combinado.',
    midia: 'caminhao'
  }
])

// Passo 1: o mesmo inflável de astronauta, com gorro e pisca-pisca no Natal.
const imagemBrinquedo = computed(() =>
  temaAtivo.value
    ? {
        src: '/images/natal/passos-brinquedo.webp',
        largura: 960,
        altura: 644,
        alt: 'Brinquedo inflável de astronauta com escorregador, decorado para o Natal com gorro e pisca-pisca'
      }
    : {
        src: '/images/natal/passos-brinquedo-padrao.webp',
        largura: 960,
        altura: 640,
        alt: 'Brinquedo inflável de astronauta com escorregador da City Toys'
      }
)

// Passo 3: caminhão com gorro de Papai Noel e presentes no Natal. A versão
// padrão é o caminhão de sempre recortado rente ao desenho.
const imagemCaminhao = computed(() =>
  temaAtivo.value
    ? { src: '/images/natal/passos-caminhao.webp', largura: 600, altura: 358 }
    : { src: '/images/natal/passos-caminhao-padrao.webp', largura: 600, altura: 291 }
)

type Mensagem = { id: string; lado: 'enviada' | 'recebida'; texto: string; hora: string }

// Passo 2: conversa de exemplo. A do Natal vem do composable (não promete data).
const conversa = computed<Mensagem[]>(() => {
  const textos = temaAtivo.value
    ? copy.chatPassoAPasso
    : {
        pergunta: 'Oi! Tem Castelinho pro dia 12? 🎉',
        resposta: 'Temos sim! Já reservei a data pra você 🎈',
        confirmacao: 'Perfeito, muito obrigada! 🥳'
      }

  return [
    { id: 'pergunta', lado: 'enviada', texto: textos.pergunta, hora: '09:41 ✓✓' },
    { id: 'resposta', lado: 'recebida', texto: textos.resposta, hora: '09:41' },
    { id: 'confirmacao', lado: 'enviada', texto: textos.confirmacao, hora: '09:42 ✓✓' }
  ]
})

// Flocos do fundo (só no Natal). Posições do Figma num quadro de 1440px:
// esquerda em % da largura, topo em px. Os de baixo somem no celular.
type Floco = { id: string; esquerda: number; topo: number; tamanho: number; opacidade: number; soDesktop?: boolean }

const flocos: Floco[] = [
  { id: 'floco-1', esquerda: 6.25, topo: 150, tamanho: 34, opacidade: 0.16 },
  { id: 'floco-2', esquerda: 90.28, topo: 130, tamanho: 44, opacidade: 0.14 },
  { id: 'floco-3', esquerda: 4.17, topo: 640, tamanho: 26, opacidade: 0.14, soDesktop: true },
  { id: 'floco-4', esquerda: 94.44, topo: 600, tamanho: 30, opacidade: 0.16, soDesktop: true }
]

let io: IntersectionObserver | null = null

function reduceMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function observeReveals() {
  const root = secEl.value
  if (!root) return

  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))
    .filter((el) => !el.classList.contains('is-inview'))
  if (!els.length) return

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-inview'))
    return
  }

  if (!io) {
    io = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-inview')
          io?.unobserve(entry.target)
        }),
      { threshold: 0.12, rootMargin: '0px 0px 160px 0px' }
    )
  }

  els.forEach((el) => io!.observe(el))
}

onMounted(async () => {
  await nextTick()
  observeReveals()
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<style lang="sass" scoped>
// Cores do Figma que não viraram token global
$dourado-varal: #c9a227
$borda-verde: #43d38d
$borda-azul: #2b74eb
$sombra-card: rgba(18, 48, 98, .08)

.secao-como-funciona
  position: relative
  overflow: hidden
  padding: 120px 0 110px
  background: var(--cor-gelo)
  color: var(--cor-navy-2)
  font-family: var(--fonte)

.container
  position: relative
  z-index: 2
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

/* ---- curva do topo ---- */
.curva-topo
  position: absolute
  top: 0
  left: 0
  z-index: 1
  display: block
  width: 100%
  height: 60px
  pointer-events: none

  path
    fill: var(--cor-branco)

/* ---- flocos (tema) ---- */
.floco
  position: absolute
  z-index: 0
  display: block
  height: auto
  pointer-events: none

/* ---- cabeçalho ---- */
.cabecalho-funciona
  display: flex
  flex-direction: column
  align-items: center
  gap: 14px
  text-align: center

.olho-funciona
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0
  color: var(--cor-vermelho)
  font-size: 13px
  font-weight: 900
  letter-spacing: .1em
  text-transform: uppercase

.titulo-funciona
  margin: 0
  color: var(--cor-navy-2)
  font-size: clamp(1.75rem, 1.1rem + 2.2vw, 2.75rem)
  font-weight: 900
  line-height: 1.2
  text-wrap: balance

.titulo-destaque
  color: var(--cor-vermelho)

.subtitulo-funciona
  margin: 0
  color: var(--cor-navy-2)
  font-size: clamp(1rem, .9rem + .3vw, 1.0625rem)
  line-height: 1.4

/* ---- passos ---- */
.lista-passos
  position: relative
  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 24px
  padding-top: 84px

.varal
  position: absolute
  top: 16px
  left: 0
  right: 0
  height: 2.5px
  border-radius: 999px
  background: $dourado-varal

.passo
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  gap: 10px
  padding: 66px 26px 26px
  border: 1.6px solid var(--cor-dourado)
  border-radius: 24px
  background: var(--cor-branco)
  filter: drop-shadow(0 12px 14px $sombra-card)
  text-align: center

.passo--dois
  border-color: $borda-verde

.passo--tres
  border-color: $borda-azul

/* fio que liga a bola ao varal */
.passo-fio
  position: absolute
  top: -85.6px
  left: calc(50% - 1px)
  width: 2px
  height: 16px
  background: $dourado-varal

/* Bola de Natal (68x92, a esfera ocupa y 24..88). O número fica no centro da
   esfera. Sem tema, a esfera vira um círculo simples no mesmo lugar. */
.passo-marcador
  position: absolute
  top: -71.6px
  left: calc(50% - 34px)
  width: 68px
  height: 92px
  filter: drop-shadow(0 10px 9px rgba(18, 48, 98, .2))
  transform-origin: 50% 5px

.passo-enfeite
  position: absolute
  inset: 0
  display: block
  width: 68px
  height: 92px

.passo-num
  position: absolute
  top: 24px
  left: 2px
  display: grid
  place-items: center
  width: 64px
  height: 64px
  color: var(--cor-branco)
  font-size: 28px
  font-weight: 900
  line-height: 1
  text-shadow: 0 2px 4px rgba(0, 0, 0, .25)

.passo-marcador--simples .passo-num
  border-radius: 50%
  background: radial-gradient(circle at 35% 32%, #ff8a8a 0, #c81e2b 80%)
  box-shadow: inset 0 -4px 10px rgba(0, 0, 0, .12)

.passo--dois .passo-marcador--simples .passo-num
  background: radial-gradient(circle at 35% 32%, #7ef0ad 0, #167a43 80%)

.passo--tres .passo-marcador--simples .passo-num
  background: radial-gradient(circle at 35% 32%, #ffe27a 0, #d49a00 80%)

.passo-titulo
  margin: 0
  color: var(--cor-navy-2)
  font-size: 22px
  font-weight: 900
  line-height: 1.3

.passo-desc
  max-width: 340px
  margin: 0
  color: var(--cor-navy-2)
  font-size: 16px
  line-height: 1.5
  text-wrap: pretty

/* ---- área de imagem dos passos (200px de altura) ---- */
.passo-midia
  position: relative
  overflow: hidden
  width: 100%
  height: 200px
  margin-top: auto
  border-radius: 18px

/* A foto do Natal é opaca e cobre o fundo; a padrão é recortada (PNG com
   transparência) e fica sobre o mesmo degradê do caminhão. */
.passo-midia--imagem
  background: linear-gradient(180deg, var(--cor-gelo), var(--cor-branco))

.midia-brinquedo
  display: block
  width: 100%
  height: 100%
  object-fit: cover

.passo-midia--conversa
  background: #e4ecf6

.passo-midia--caminhao
  background: linear-gradient(180deg, var(--cor-gelo), var(--cor-branco))

/* ---- celular com a conversa (passo 2) ---- */
.celular
  position: absolute
  top: 16px
  left: 0
  right: 0
  overflow: hidden
  width: 236px
  max-width: calc(100% - 24px)
  margin: 0 auto
  border: 5px solid var(--cor-navy)
  border-radius: 26px
  background: #efe7de
  box-shadow: 0 14px 30px rgba(18, 48, 98, .18)
  text-align: left

.celular-topo
  display: flex
  align-items: center
  gap: 10px
  padding: 10px 14px
  background: #0b7a6b

.celular-avatar
  display: grid
  place-items: center
  flex: 0 0 auto
  width: 34px
  height: 34px
  border-radius: 50%
  background: var(--cor-branco)

  img
    display: block
    width: 28px
    height: auto

.celular-contato
  display: flex
  flex-direction: column
  line-height: 1.3

.celular-nome
  color: var(--cor-branco)
  font-size: 13px
  font-weight: 800

.celular-status
  color: rgba(255, 255, 255, .8)
  font-size: 10.5px

.celular-mensagens
  display: flex
  flex-direction: column
  gap: 8px
  padding: 12px

.mensagem-linha
  display: flex

.mensagem-linha--enviada
  justify-content: flex-end

.mensagem
  display: flex
  flex-direction: column
  gap: 2px
  max-width: 170px
  padding: 7px 10px
  border-radius: 12px
  box-shadow: 0 1px 2px rgba(0, 0, 0, .08)

.mensagem--enviada
  background: #d9fdd3

.mensagem--recebida
  background: var(--cor-branco)

.mensagem-texto
  color: #111b21
  font-size: 11.5px
  line-height: 1.35

.mensagem-hora
  color: #5b7083
  font-size: 9px
  text-align: right

/* ---- caminhão (passo 3) ---- */
.caminhao-sombra
  position: absolute
  top: 184px
  left: 0
  right: 0
  width: 230px
  max-width: calc(100% - 40px)
  height: 14px
  margin: 0 auto
  border-radius: 50%
  background: rgba(18, 48, 98, .12)
  filter: blur(3px)

.caminhao
  position: absolute
  top: 21px
  left: 0
  right: 0
  display: block
  width: 280px
  max-width: calc(100% - 24px)
  height: 167px
  margin: 0 auto
  object-fit: contain
  object-position: center bottom
  animation: caminhao-motor 2.4s ease-in-out infinite

@keyframes caminhao-motor
  0%, 100%
    transform: translateY(0)
  50%
    transform: translateY(-2px)

/* ---- tema: bolas balançando no varal ---- */
.secao-tema .passo-marcador
  animation: bola-balanco 4s ease-in-out infinite

.secao-tema .passo--dois .passo-marcador
  animation-delay: -1.3s

.secao-tema .passo--tres .passo-marcador
  animation-delay: -2.6s

@keyframes bola-balanco
  0%, 100%
    transform: rotate(-3deg)
  50%
    transform: rotate(3deg)

/* ---- revelar no scroll ---- */
[data-reveal]
  opacity: 0
  transform: translateY(24px)
  transition: opacity .6s ease, transform .6s ease
  transition-delay: var(--atraso, 0ms)

.is-inview[data-reveal]
  opacity: 1
  transform: none

/* ---- responsivo ---- */
@media (max-width: 980px)
  .secao-como-funciona
    padding: 96px 0 88px

  .curva-topo
    height: 44px

  .lista-passos
    grid-template-columns: minmax(0, 1fr)
    row-gap: 72px
    max-width: 520px
    margin: 0 auto
    padding-top: 64px

  /* No celular cada card pende do seu próprio trecho de varal. */
  .varal
    display: none

  .secao-tema .lista-passos
    row-gap: 104px
    padding-top: 84px

  .secao-tema .passo::before
    content: ""
    position: absolute
    top: -68px
    left: 0
    right: 0
    height: 2.5px
    border-radius: 999px
    background: $dourado-varal

@media (max-width: 520px)
  .secao-como-funciona
    padding: 72px 0 72px

  .curva-topo
    height: 32px

  .passo
    padding: 62px 20px 22px

  .passo-titulo
    font-size: 20px

  .passo-desc
    font-size: 15px

@media (max-width: 768px)
  .floco--desktop
    display: none

  .floco
    transform: scale(.7)

@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    transform: none !important
    transition: none !important

  .caminhao,
  .secao-tema .passo-marcador
    animation: none
</style>
