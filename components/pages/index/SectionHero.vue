<template>
  <section class="hero" id="inicio" aria-label="Seção principal" :class="{ 'is-loaded': loaded }">
    <div class="fundo-hero" aria-hidden="true"></div>
    <div class="scrim-hero" aria-hidden="true"></div>

    <div v-if="temaAtivo" class="enfeites-tema" aria-hidden="true">
      <!-- Varal de ponta a ponta, logo abaixo do menu. -->
      <VaralBandeirinhas class="varal-hero" />

      <!-- Cacho de balões no céu à esquerda (o fundo já tem um à direita). -->
      <div class="cacho">
        <svg class="cacho__fios" viewBox="0 0 120 190">
          <path d="M29,75 Q38,130 59,182" />
          <path d="M59,61 L59,182" />
          <path d="M89,79 Q80,130 59,182" />
        </svg>
        <span class="balao balao--a"></span>
        <span class="balao balao--c"></span>
        <span class="balao balao--b"></span>
      </div>

      <!-- Balões subindo pelas laterais, sem cruzar a coluna do texto. -->
      <span class="balao balao--subindo balao--subindo-1"><span class="balao__fio"></span></span>
      <span class="balao balao--subindo balao--subindo-2"><span class="balao__fio"></span></span>

      <!-- No celular não cabe o cacho: fica um balão solto entre o varal e o selo. -->
      <span class="balao balao--solto"><span class="balao__fio"></span></span>

      <span
        v-for="(c, i) in confetes"
        :key="`confete-${i}`"
        class="confete"
        :class="[`confete--${c.forma}`, { 'confete--mobile': c.mobile }]"
        :style="{
          '--top': `${c.top}%`,
          '--left': `${c.left}%`,
          '--cor': c.cor,
          '--giro': `${c.giro}deg`,
          '--atraso': `${-i * 0.4}s`
        }"
      ></span>
    </div>

    <div class="conteudo-hero" id="hero-conteudo">
      <span class="selo-hero" id="hero-selo">
        <SvgIcone nome="localizacao" :tamanho="16" />
        Aluguel de brinquedos infláveis · Rio de Janeiro
      </span>

      <!-- Na campanha o título vira "Feliz Dia das Crianças" em letras de inflável.
           É texto de verdade (não imagem): nítido, legível pelo Google e quebra
           certinho no celular. -->
      <h1 v-if="temaAtivo" class="titulo-hero titulo-tema" id="hero-titulo">
        <!-- Os {{ ' ' }} garantem "Feliz Dia das Crianças" com espaço pro Google e
             leitores de tela; dentro de flex, espaço sozinho não ocupa lugar na tela. -->
        <span class="titulo-tema__topo">
          <span class="titulo-tema__tag">{{ copy.tituloTag }}</span>{{ ' ' }}
          <span class="titulo-tema__fita">{{ copy.tituloFita }}<svg class="sol" viewBox="0 0 64 64" aria-hidden="true">
              <g class="sol__raios">
                <line v-for="k in 8" :key="k" x1="32" y1="3" x2="32" y2="11" :transform="`rotate(${k * 45} 32 32)`" />
              </g>
              <circle class="sol__corpo" cx="32" cy="32" r="15" />
              <circle class="sol__olho" cx="26.5" cy="29" r="2" />
              <circle class="sol__olho" cx="37.5" cy="29" r="2" />
              <path class="sol__sorriso" d="M25 36 Q32 42 39 36" />
            </svg></span>
        </span>{{ ' ' }}

        <span class="titulo-tema__letras">
          <LetrasColoridas :texto="copy.tituloDestaque" />

          <svg
            v-for="lado in ['esquerda', 'direita']"
            :key="`brilho-${lado}`"
            class="brilho"
            :class="`brilho--${lado}`"
            viewBox="0 0 40 40"
            aria-hidden="true"
          >
            <path d="M8,11 L18,3" />
            <path d="M10,20 L25,20" />
            <path d="M8,29 L18,37" />
          </svg>
        </span>
      </h1>

      <h1 v-else class="titulo-hero" id="hero-titulo">
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
        <li><SvgIcone nome="check" :tamanho="16" /> Higienizado</li>
        <li><SvgIcone nome="check" :tamanho="16" /> Montagem inclusa</li>
        <li><SvgIcone nome="check" :tamanho="16" /> Entrega em todo o RJ</li>
      </ul>
    </div>

    <div class="onda-hero" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,40 C420,120 1020,120 1440,40 L1440,120 L0,120 Z" fill="#ffffff" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import LetrasColoridas from '~/components/global/tema/LetrasColoridas.vue'
import VaralBandeirinhas from '~/components/global/tema/VaralBandeirinhas.vue'

// O título da página é definido em pages/index.vue — um componente de seção
// não deve sobrescrever o <title> do documento.

const loaded = ref(false)

// Na temporada de Dia das Crianças o hero troca o título e a frase digitada,
// e ganha bandeirinhas, confetes e balões por cima do fundo de sempre.
const { temaAtivo, copy } = useTemaSazonal()

// Confetes em posições fixas, nas laterais e em volta do título, nunca em
// cima do texto. No celular o texto ocupa a largura toda, então lá ficam só
// os marcados como "mobile": todos na faixa livre entre o varal e o selo.
type Confete = { top: number; left: number; cor: string; giro: number; forma: 'fita' | 'bolinha' | 'estrela'; mobile?: boolean }

const confetes: Confete[] = [
  { top: 33, left: 12, cor: '#ffd23f', giro: 20, forma: 'estrela' },
  { top: 38, left: 21, cor: '#ff3b3b', giro: -30, forma: 'fita' },
  { top: 50, left: 14, cor: '#2b74eb', giro: 0, forma: 'bolinha' },
  { top: 61, left: 23, cor: '#2ecc71', giro: 45, forma: 'fita' },
  { top: 30, left: 27, cor: '#ff9a00', giro: -15, forma: 'estrela', mobile: true },
  { top: 72, left: 8, cor: '#a45cff', giro: 10, forma: 'estrela' },
  { top: 31, left: 90, cor: '#2ecc71', giro: -20, forma: 'estrela', mobile: true },
  { top: 40, left: 78, cor: '#ffd23f', giro: 35, forma: 'fita' },
  { top: 52, left: 86, cor: '#ff3b3b', giro: 0, forma: 'bolinha' },
  { top: 62, left: 76, cor: '#2b74eb', giro: -40, forma: 'fita' },
  { top: 26, left: 69, cor: '#ff3b3b', giro: 15, forma: 'estrela', mobile: true },
  { top: 73, left: 92, cor: '#ff9a00', giro: 25, forma: 'fita' }
]

const fullText = computed(() =>
  temaAtivo.value ? copy.subtituloHero : 'Escolha seu brinquedo e prepare a contagem regressiva!'
)

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

  typeWriter(fullText.value)
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

  /* altura da onda de transição (reaproveitada no <svg> abaixo) */
  --onda-h: clamp(56px, 8vw, 110px)

  /* espaço pro menu overlay (topo) e pra faixa da onda (base) */
  padding-top: var(--menu-h, 76px)
  padding-bottom: var(--onda-h)

  /* imagem enquadrada em 100vh na dobra; a onda fica na faixa abaixo (só no scroll) */
  min-height: 100vh
  height: calc(100vh + var(--onda-h))

  display: flex
  align-items: center
  justify-content: center

.fundo-hero
  position: absolute
  /* A caixa sobe meia onda acima do hero (o overflow do hero corta) e desce até
     o fim da faixa da onda: a imagem fica centrada perto da dobra e SEMPRE cobre
     a faixa da onda. O jeito antigo (puxar o background-position pra cima)
     deixava um vão sem imagem embaixo em telas mais altas, que aparecia como
     uma faixa cinza atrás da onda. */
  inset: calc(var(--onda-h) / -2) 0 0 0
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
  padding: clamp(28px, 4vw, 54px) 16px
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
  align-items: center

.botao
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  min-height: 56px
  padding: 0 clamp(28px, 3.5vw, 40px)
  border: none
  border-radius: 999px
  font-family: var(--fonte)
  font-weight: 800
  font-size: clamp(15px, 1.9vw, 18px)
  letter-spacing: .2px
  cursor: pointer
  text-decoration: none
  transition: all 0.4s ease

  &:active
    transform: translateY(0) scale(.98)

.botao-whats
  background: #2b74eb
  color: #ffffff

  &:hover
    background: #ff3b3b

.botao-combo
  background: #ffd23f
  color: #052a54

  &:hover
    background: #2b74eb
    color: #ffffff

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

/* ---- onda de transição pra seção de brinquedos ---- */
.onda-hero
  position: absolute
  left: 0
  right: 0
  bottom: -1px
  z-index: 2
  line-height: 0
  pointer-events: none

  svg
    display: block
    width: 100%
    height: var(--onda-h)

/* ---- enfeites do tema sazonal (Dia das Crianças) ---- */
/* Ficam atrás do conteúdo (z-index 2 < 3) pra não disputar leitura com o texto. */
.enfeites-tema
  position: absolute
  inset: 0
  z-index: 2
  pointer-events: none
  overflow: hidden

/* ---- balões ---- */
/* Tamanho em "em": cada grupo ajusta o font-size e o balão inteiro escala junto. */
.balao
  position: absolute
  width: 4.6em
  height: 5.6em
  border-radius: 50% 50% 47% 47% / 55% 55% 45% 45%
  /* brilho em cima à esquerda + sombra embaixo à direita = volume de balão */
  background: radial-gradient(circle at 32% 26%, rgba(255,255,255,.7) 0 9%, rgba(255,255,255,0) 30%), radial-gradient(circle at 68% 78%, rgba(0,0,0,.2), rgba(0,0,0,0) 55%), var(--cor)
  box-shadow: 0 10px 20px rgba(3,20,54,.18)

  /* nó */
  &::after
    content: ""
    position: absolute
    top: 100%
    left: 50%
    width: .9em
    height: .55em
    margin: -.1em 0 0 -.45em
    background: var(--cor)
    clip-path: polygon(50% 0, 100% 100%, 0 100%)

.balao__fio
  position: absolute
  top: calc(100% + .4em)
  left: 50%
  width: 1px
  height: 4em
  background: rgba(255,255,255,.75)

/* Cacho de três balões com os fios se juntando embaixo. */
.cacho
  position: absolute
  top: 23%
  left: 3%
  width: 12em
  height: 19em
  font-size: clamp(8px, .6vw, 12px)
  transform-origin: 50% 100%
  animation: cacho-balancar 6s ease-in-out infinite

.cacho__fios
  position: absolute
  inset: 0
  width: 100%
  height: 100%
  overflow: visible

  path
    fill: none
    stroke: rgba(255,255,255,.8)
    stroke-width: 1.2

.balao--a
  --cor: var(--tema-vermelho, #ff3b3b)
  top: 1.4em
  left: 0
  transform: rotate(-12deg)

.balao--b
  --cor: var(--tema-amarelo, #ffd23f)
  top: 0
  left: 3.6em

.balao--c
  --cor: var(--tema-azul, #2b74eb)
  top: 1.8em
  left: 7.2em
  transform: rotate(12deg)

@keyframes cacho-balancar
  0%, 100%
    transform: translateY(0) rotate(-2deg)
  50%
    transform: translateY(-8px) rotate(2deg)

/* Balões subindo pelas laterais, de baixo até sumir no alto. */
.balao--subindo
  top: 100%
  font-size: clamp(7px, .55vw, 10px)
  animation: balao-subir 18s linear infinite

.balao--subindo-1
  --cor: var(--tema-rosa, #ff6fae)
  left: 1.5%
  animation-delay: -5s

.balao--subindo-2
  --cor: var(--tema-verde, #00c2c7)
  right: 2.5%
  animation-duration: 23s
  animation-delay: -14s

@keyframes balao-subir
  0%
    transform: translate(0, 0)
    opacity: 0
  6%
    opacity: 1
  50%
    transform: translate(18px, -60vh)
  94%
    opacity: 1
  100%
    transform: translate(-6px, -125vh)
    opacity: 0

/* Balão solto: só no celular, onde o cacho não cabe. */
.balao--solto
  --cor: var(--tema-vermelho, #ff3b3b)
  display: none
  top: 25%
  left: 5%
  font-size: 6px
  animation: cacho-balancar 6s ease-in-out infinite

/* No celular (e no tablet em pé) o texto ocupa a largura toda: sai o cacho
   e os balões que sobem, fica só o balão solto longe do texto. */
@media (max-width: 768px)
  .cacho,
  .balao--subindo
    display: none

  .balao--solto
    display: block

/* ---- título da campanha: "Feliz Dia das Crianças" ---- */
.titulo-tema
  display: flex
  flex-direction: column
  align-items: center
  gap: clamp(6px, 1vw, 12px)
  text-shadow: none

.titulo-tema__topo
  display: inline-flex
  align-items: center
  gap: clamp(8px, 1.2vw, 14px)

.titulo-tema__tag
  display: inline-block
  padding: .3em .8em
  border-radius: 8px
  background: #ffd23f
  color: #052a54
  font-size: clamp(14px, 1.9vw, 24px)
  font-weight: 800
  line-height: 1
  text-transform: uppercase
  letter-spacing: .5px
  transform: rotate(-8deg)
  box-shadow: 0 6px 16px rgba(3,20,54,.28)

.titulo-tema__fita
  position: relative
  display: inline-block
  padding: .18em .8em .22em
  border-radius: 12px
  background: linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)
  color: #ffffff
  font-size: clamp(24px, 4.2vw, 50px)
  font-weight: 800
  line-height: 1
  text-transform: uppercase
  letter-spacing: .5px
  text-shadow: 0 2px 0 rgba(0,0,0,.18)
  transform: rotate(-2deg)
  box-shadow: 0 8px 22px rgba(3,20,54,.32)

.titulo-tema__letras
  position: relative
  display: inline-flex
  font-size: clamp(52px, 16vw, 132px)
  font-weight: 800
  line-height: .95
  text-transform: uppercase
  letter-spacing: -1px

/* Sol sorridente no canto da fita "DIA DAS" — em "em" da fita, escala junto. */
/* Mais pra baixo e pra fora do que o "natural": subindo mais, encosta no selo
   em telas de ~1024px e no celular. */
.sol
  position: absolute
  top: -.15em
  right: -1.2em
  width: 1.3em
  height: 1.3em
  overflow: visible

.sol__raios
  stroke: #ffd23f
  stroke-width: 4
  stroke-linecap: round
  transform-box: view-box
  transform-origin: 32px 32px
  animation: sol-girar 14s linear infinite

.sol__corpo
  fill: #ffd23f
  stroke: #ffb300
  stroke-width: 2

.sol__olho
  fill: #7a4200

.sol__sorriso
  fill: none
  stroke: #7a4200
  stroke-width: 2.5
  stroke-linecap: round

@keyframes sol-girar
  to
    transform: rotate(360deg)

/* Brilhos piscando dos dois lados de "CRIANÇAS", como os risquinhos da arte. */
.brilho
  position: absolute
  top: .12em
  width: .5em
  height: .5em
  overflow: visible
  animation: brilho-piscar 1.6s ease-in-out infinite

  path
    fill: none
    stroke: #ffd23f
    stroke-width: 4
    stroke-linecap: round

.brilho--direita
  right: -.62em
  animation-delay: -.8s

.brilho--esquerda
  left: -.62em
  transform: scaleX(-1)

@keyframes brilho-piscar
  0%, 100%
    opacity: .35
  50%
    opacity: 1

/* No celular a palavra quase encosta nas bordas: os brilhos chegam mais perto. */
@media (max-width: 480px)
  .brilho
    width: .4em
    height: .4em

  .brilho--direita
    right: -.46em

  .brilho--esquerda
    left: -.46em

/* ---- varal de bandeirinhas ---- */
/* De ponta a ponta, logo abaixo do menu (no topo ficaria atrás da faixa e do Nav).
   O desenho e a animação moram em VaralBandeirinhas.vue. */
.varal-hero
  position: absolute
  top: calc(var(--menu-h, 76px) - 6px)
  left: 0
  right: 0

/* ---- confetes ---- */
.confete
  position: absolute
  top: var(--top)
  left: var(--left)
  width: 10px
  height: 10px
  background: var(--cor)
  opacity: .9
  transform: rotate(var(--giro))
  animation: confete-flutuar 5s ease-in-out infinite
  animation-delay: var(--atraso)

.confete--fita
  width: 6px
  height: 18px
  border-radius: 3px

.confete--bolinha
  border-radius: 50%

.confete--estrela
  width: 18px
  height: 18px
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)

@keyframes confete-flutuar
  0%, 100%
    transform: translateY(0) rotate(var(--giro))
  50%
    transform: translateY(-10px) rotate(calc(var(--giro) + 30deg))

@media (max-width: 768px)
  .confete:not(.confete--mobile)
    display: none

/* Quem pediu menos movimento vê o tema inteiro, só que parado. */
@media (prefers-reduced-motion: reduce)
  .confete,
  .cacho,
  .balao--solto,
  .sol__raios,
  .brilho
    animation: none

  .balao--subindo
    display: none

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
    gap: 14px
</style>
