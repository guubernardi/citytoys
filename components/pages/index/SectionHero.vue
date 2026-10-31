<template>
  <section
    class="hero"
    :class="{ 'is-loaded': carregado, 'hero--tema': temaAtivo }"
    id="inicio"
    aria-label="Seção principal"
  >
    <!-- Fundo: no Natal, a arte com os infláveis enfeitados e o foguete de gorro;
         fora da campanha, a foto de sempre. É <img> (e não background) pra entrar
         cedo na fila de download: é o maior elemento da dobra (LCP). -->
    <img
      class="fundo-hero"
      :class="{ 'fundo-hero--padrao': !temaAtivo }"
      :src="fundo.src"
      :srcset="fundo.srcset"
      :sizes="fundo.srcset ? '(max-aspect-ratio: 1/1) 190vh, 100vw' : undefined"
      :width="fundo.largura"
      :height="fundo.altura"
      alt=""
      loading="eager"
      fetchpriority="high"
      decoding="async"
    />
    <div class="sombra-topo" aria-hidden="true"></div>

    <!-- Pontinhos de luz no céu: só no Natal. -->
    <div v-if="temaAtivo" class="pontos-luz" aria-hidden="true">
      <span
        v-for="(p, i) in pontosLuz"
        :key="`ponto-${i}`"
        class="ponto-luz"
        :style="{ '--x': `${p.x}%`, '--y': `${p.y}%`, '--tam': `${p.tam}px`, '--atraso': `${-i * 0.7}s` }"
      ></span>
    </div>

    <div class="conteudo-hero" id="hero-conteudo">
      <span class="selo-hero" id="hero-selo">
        <SvgIcone nome="localizacao" :tamanho="16" />
        Aluguel de brinquedos infláveis · Rio de Janeiro
      </span>

      <!-- Na campanha o título vira "Feliz Natal": etiqueta amarela + letras de
           inflável com gorro no "N". É texto de verdade (não imagem): nítido,
           legível pelo Google e quebra certinho no celular. -->
      <h1 v-if="temaAtivo" class="titulo-hero titulo-natal" id="hero-titulo">
        <!-- O {{ ' ' }} garante "Feliz Natal" com espaço pro Google e leitores de
             tela; dentro de flex, o espaço sozinho não ocupa lugar na tela. -->
        <span class="titulo-natal__tag">{{ copy.tituloTag }}</span>{{ ' ' }}
        <span class="titulo-natal__palavra">
          <span
            v-for="(l, i) in letrasDestaque"
            :key="`letra-${i}`"
            class="letra-natal"
            :data-letra="l.letra"
            :style="{ '--de': l.de, '--ate': l.ate, '--giro': `${l.giro}deg` }"
          ><span class="letra-natal__face">{{ l.letra }}</span></span>

          <img class="gorro-natal" src="/images/natal/hero-gorro.svg" alt="" width="150" height="125" />
          <img class="brilho-titulo brilho-titulo--dourado" src="/images/natal/hero-brilho-dourado.svg" alt="" width="42" height="42" />
          <img class="brilho-titulo brilho-titulo--branco" src="/images/natal/hero-brilho-branco.svg" alt="" width="28" height="28" />
          <img class="brilho-titulo brilho-titulo--esquerda" src="/images/natal/hero-brilho-branco.svg" alt="" width="28" height="28" />
        </span>
      </h1>

      <h1 v-else class="titulo-hero titulo-padrao" id="hero-titulo">
        A diversão
        <span class="destaque">decola aqui</span>
      </h1>

      <!-- O texto inteiro fica no fluxo (transparente) reservando a altura final;
           a versão "digitando" corre por cima. Assim nada pula de lugar enquanto
           a frase aparece, e o texto completo segue lá pro Google e pra leitor de tela. -->
      <p class="subtitulo-hero" id="hero-subtitulo">
        <span class="subtitulo-hero__texto">{{ textoCompleto }}</span>
        <span class="subtitulo-hero__digitado" aria-hidden="true">{{ textoDigitado }}<span class="cursor-digitando"></span></span>
      </p>

      <div class="acoes-hero" id="hero-acoes">
        <a
          class="botao botao-orcamento"
          id="hero-cta-whats"
          :href="linkOrcamento"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Fazer orçamento no WhatsApp"
          @click="aoClicarOrcamento"
        >
          <SvgIcone nome="whatsapp" :tamanho="20" />
          Fazer orçamento
        </a>

        <NuxtLink class="botao botao-combo" id="hero-cta-combo" to="/montar-combo">
          <SvgIcone nome="foguete" :tamanho="20" />
          Monte seu combo
        </NuxtLink>
      </div>

      <ul class="provas-hero" id="hero-provas" aria-label="Diferenciais">
        <li v-for="p in provas" :key="p.texto">
          <span class="provas-hero__icone" :class="`provas-hero__icone--${p.cor}`" aria-hidden="true">
            <img v-if="p.imagem" :src="p.imagem" alt="" width="14" height="14" />
            <SvgIcone v-else :nome="p.icone" :tamanho="14" />
          </span>
          {{ p.texto }}
        </li>
      </ul>
    </div>

    <!-- Curva da base: o hero "desce" no meio e entra no branco da seção seguinte. -->
    <div class="curva-hero" aria-hidden="true">
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
        <path d="M0 0C480 80 960 80 1440 0V60H0V0Z" fill="#ffffff" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

// O título da página é definido em pages/index.vue: um componente de seção
// não deve sobrescrever o <title> do documento.

const carregado = ref(false)

// O layout do hero é o mesmo o ano todo. No Natal entram o fundo natalino, o
// título "Feliz Natal" com gorro, os brilhos e a frase de fim de ano.
const { temaAtivo, copy, linkWhatsTema, registrarCliqueTema } = useTemaSazonal()

// A arte de Natal do Figma só existe em 1376x768. A versão de 2560 passou por
// upscale com IA (EDSR 2x) pra não borrar em tela grande; telas menores ficam
// com a de 1376, mais leve. No celular o hero é mais alto que largo e a imagem
// cobre pela altura, por isso o sizes pede ~190vh em tela em pé.
const fundo = computed(() =>
  temaAtivo.value
    ? {
        src: '/images/natal/hero-fundo.webp',
        srcset: '/images/natal/hero-fundo.webp 1376w, /images/natal/hero-fundo-2560.webp 2560w',
        largura: 1376,
        altura: 768
      }
    : { src: '/images/fundo-hero.webp', srcset: undefined, largura: 1672, altura: 941 }
)

// Pontinhos de luz no céu, nas posições da arte (em % do hero).
const pontosLuz = [
  { x: 90.3, y: 20.5, tam: 8 },
  { x: 16, y: 31.3, tam: 6 },
  { x: 86.8, y: 36.1, tam: 4 },
  { x: 4.2, y: 24.1, tam: 6 }
]

// Letras de inflável: cada uma com seu degradê (claro em cima, forte embaixo)
// e uma inclinação diferente, como na arte. As cores repetem se a palavra crescer.
const CORES_LETRAS = [
  { de: '#ff8a8a', ate: '#e5343a' },
  { de: '#7ef0ad', ate: '#1e9e57' },
  { de: '#fff3b0', ate: '#ffc531' },
  { de: '#9fd0ff', ate: '#2b74eb' }
]
const GIROS_LETRAS = [6, -4, 3, -5, 4]

const letrasDestaque = computed(() =>
  Array.from(copy.tituloDestaque).map((letra, i) => ({
    letra,
    ...CORES_LETRAS[i % CORES_LETRAS.length],
    giro: GIROS_LETRAS[i % GIROS_LETRAS.length]
  }))
)

const LINK_ORCAMENTO_PADRAO =
  'https://wa.me/5521984848699?text=Oi%21%20Quero%20um%20or%C3%A7amento%20%F0%9F%98%8A%0AData%3A%20____%0ABairro%3A%20____%0ABrinquedo%3A%20____'

// Na campanha o orçamento sai com a mensagem de Natal (o lead já chega identificado).
const linkOrcamento = computed(() => (temaAtivo.value ? linkWhatsTema.value : LINK_ORCAMENTO_PADRAO))

function aoClicarOrcamento() {
  if (temaAtivo.value) registrarCliqueTema('hero-orcamento')
}

type Prova = { texto: string; cor: 'dourado' | 'vermelho' | 'verde' | 'azul'; icone?: string; imagem?: string }

const provas: Prova[] = [
  { texto: 'Nota 4,97 dos pais', cor: 'dourado', icone: 'estrela' },
  { texto: '+3 mil festas', cor: 'vermelho', imagem: '/images/natal/hero-icone-festa.svg' },
  { texto: 'Montagem inclusa', cor: 'verde', icone: 'check-limpo' },
  { texto: 'Entrega em todo o RJ', cor: 'azul', icone: 'caminhao-entrega' }
]

const textoCompleto = computed(() =>
  temaAtivo.value ? copy.subtituloHero : 'Escolha seu brinquedo e prepare a contagem regressiva!'
)

const textoDigitado = ref('')

let tmr: number | null = null

function prefereMenosMovimento() {
  if (typeof window === 'undefined') return false
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function digitar(texto: string) {
  if (prefereMenosMovimento()) {
    textoDigitado.value = texto
    return
  }

  textoDigitado.value = ''
  let i = 0

  const tick = () => {
    textoDigitado.value += texto.charAt(i)
    i++

    if (i >= texto.length) {
      tmr = null
      return
    }

    const ch = texto.charAt(i - 1)
    const base = 26
    const variacao = Math.floor(Math.random() * 26)
    const pausa = ch === '!' || ch === '?' || ch === '.' ? 220 : ch === ',' ? 120 : 0

    tmr = window.setTimeout(tick, base + variacao + pausa)
  }

  tmr = window.setTimeout(tick, 180)
}

onMounted(() => {
  requestAnimationFrame(() => {
    carregado.value = true
  })

  digitar(textoCompleto.value)
})

onBeforeUnmount(() => {
  if (tmr) {
    clearTimeout(tmr)
    tmr = null
  }
})
</script>

<style scoped lang="sass">
// Tons da arte que não estão nos tokens globais.
$vermelho-claro: #e5343a
$vermelho-escuro: #b8202c
$azul-acao: #2b74eb

.hero
  position: relative
  isolation: isolate
  overflow: hidden
  font-family: var(--fonte)
  background: var(--cor-noite)

  /* altura da curva da base (reaproveitada no <svg>) */
  --curva-h: clamp(28px, 4.2vw, 60px)

  /* o menu fixo (faixa + barra) fica por cima: o conteúdo começa abaixo dele */
  min-height: 100vh
  min-height: 100svh
  padding: calc(var(--menu-h, 76px) + 24px) 16px calc(var(--curva-h) + 44px)

  display: flex
  align-items: center
  justify-content: center

.fundo-hero
  position: absolute
  inset: 0
  z-index: -2
  width: 100%
  height: 100%
  object-fit: cover
  object-position: center

/* escurece o topo pra o menu ler bem sobre o céu */
.sombra-topo
  position: absolute
  inset: 0
  z-index: -1
  pointer-events: none
  background: linear-gradient(180deg, rgba(6,18,61,.6) 0%, rgba(6,18,61,.15) 22%, rgba(6,18,61,0) 60%)

/* ---- pontinhos de luz (Natal) ---- */
.pontos-luz
  position: absolute
  inset: 0
  z-index: -1
  pointer-events: none

.ponto-luz
  position: absolute
  left: var(--x)
  top: var(--y)
  width: var(--tam)
  height: var(--tam)
  border-radius: 50%
  background: #ffffff
  filter: blur(.3px)
  box-shadow: 0 0 6px rgba(255,255,255,.7)
  animation: ponto-piscar 3.2s ease-in-out infinite
  animation-delay: var(--atraso)

@keyframes ponto-piscar
  0%, 100%
    opacity: 1
  50%
    opacity: .35

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

.hero.is-loaded
  .selo-hero
    opacity: 1
    transform: none
    transition-delay: .05s

  .titulo-hero
    opacity: 1
    transform: none
    transition-delay: .12s

  .subtitulo-hero
    opacity: 1
    transform: none
    transition-delay: .2s

  .acoes-hero
    opacity: 1
    transform: none
    transition-delay: .28s

  .provas-hero
    opacity: 1
    transform: none
    transition-delay: .36s

/* ---- conteúdo ---- */
.conteudo-hero
  position: relative
  z-index: 1
  width: min(1000px, 100%)
  display: flex
  flex-direction: column
  align-items: center
  gap: 20px
  text-align: center

  /* foco escuro e suave atrás do texto, sem apagar a imagem */
  &::before
    content: ""
    position: absolute
    left: 50%
    top: 50%
    z-index: -1
    width: min(1000px, 160vw)
    height: 94%
    transform: translate(-50%, -54%)
    background: radial-gradient(closest-side, rgba(10,20,80,.42), rgba(10,20,80,0))
    pointer-events: none

.selo-hero
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 8px
  padding: 8px 18px
  border: 1px solid rgba(255,255,255,.34)
  border-radius: 999px
  background: rgba(255,255,255,.16)
  backdrop-filter: blur(6px)
  -webkit-backdrop-filter: blur(6px)
  color: #ffffff
  font-weight: 700
  font-size: 14.5px
  line-height: 1.3

.titulo-hero
  margin: 0
  color: #ffffff

/* ---- título padrão (fora da campanha) ---- */
.titulo-padrao
  font-weight: 800
  font-size: clamp(38px, 7vw, 82px)
  line-height: 1.02
  letter-spacing: -0.5px
  text-shadow: 0 6px 26px rgba(3,20,54,.38)

  .destaque
    display: block
    color: var(--cor-dourado)
    text-shadow: 0 4px 18px rgba(0,0,0,.3), 0 2px 2px rgba(120,72,0,.28)

/* ---- título de Natal: "Feliz" + NATAL em letras de inflável ---- */
/* Tudo do título escala a partir de --tam-natal (210px na arte de 1440). */
.titulo-natal
  --tam-natal: clamp(62px, 14.6vw, 210px)
  display: flex
  flex-direction: column
  align-items: center
  font-weight: 900
  line-height: 1

.titulo-natal__tag
  position: relative
  z-index: 2
  display: inline-block
  margin-bottom: calc(var(--tam-natal) * -.05)
  padding: .18em .65em
  border-radius: .35em
  background: var(--cor-dourado)
  color: var(--cor-navy)
  font-size: clamp(18px, 2.36vw, 34px)
  line-height: 1.36
  letter-spacing: .04em
  text-transform: uppercase
  transform: rotate(-5deg)
  box-shadow: 0 6px 16px rgba(3,20,54,.3)

.titulo-natal__palavra
  position: relative
  display: inline-flex
  font-size: var(--tam-natal)
  line-height: 1

.letra-natal
  position: relative
  display: inline-block
  padding: 0 .045em
  text-transform: uppercase
  transform: rotate(var(--giro))

  /* Camada de trás: a mesma letra em azul-marinho, com contorno grosso, volume
     embaixo e sombra. A letra colorida fica por cima. O "/ ''" tira a cópia do
     leitor de tela; navegador antigo ignora essa linha e usa a de cima. */
  &::before
    content: attr(data-letra)
    content: unquote('attr(data-letra) / ""')
    position: absolute
    inset: 0
    padding: inherit
    color: var(--cor-navy)
    -webkit-text-stroke: .1em var(--cor-navy)
    filter: drop-shadow(0 .057em 0 var(--cor-navy)) drop-shadow(0 .07em .1em rgba(3,20,54,.35))

.letra-natal__face
  position: relative
  display: inline-block
  color: var(--ate)
  background: linear-gradient(180deg, var(--de), var(--ate))
  -webkit-background-clip: text
  background-clip: text
  -webkit-text-fill-color: transparent

/* Gorro de Papai Noel encaixado no "N" (medidas em em: acompanha o tamanho da palavra). */
.gorro-natal
  position: absolute
  left: -.094em
  top: -.139em
  z-index: 2
  width: .714em
  height: .595em
  transform: rotate(-16deg)
  pointer-events: none

.brilho-titulo
  position: absolute
  pointer-events: none
  animation: brilho-piscar 2.4s ease-in-out infinite

.brilho-titulo--dourado
  left: calc(100% - .048em)
  top: .086em
  width: .2em
  height: .2em

.brilho-titulo--branco
  left: calc(100% + .124em)
  top: -.01em
  width: .114em
  height: .114em
  animation-delay: -.8s

.brilho-titulo--esquerda
  left: -.333em
  top: .81em
  width: .133em
  height: .133em
  animation-delay: -1.6s

@keyframes brilho-piscar
  0%, 100%
    opacity: 1
    transform: scale(1)
  50%
    opacity: .45
    transform: scale(.78)

/* ---- subtítulo digitado ---- */
.subtitulo-hero
  position: relative
  margin: 0
  max-width: 640px
  color: #ffffff
  font-weight: 600
  font-size: clamp(17px, 1.53vw, 22px)
  line-height: 1.4
  text-shadow: 0 2px 10px rgba(3,20,54,.45)

.subtitulo-hero__texto
  color: transparent
  text-shadow: none

.subtitulo-hero__digitado
  position: absolute
  inset: 0

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

/* ---- botões ---- */
.acoes-hero
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 16px

.botao
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  padding: 17px 32px
  border: 0
  border-radius: 999px
  font-family: var(--fonte)
  font-weight: 800
  font-size: 18px
  line-height: 1.4
  text-decoration: none
  cursor: pointer
  transition: background .25s ease, color .25s ease

  &:focus-visible
    outline: 3px solid #ffffff
    outline-offset: 3px

/* hover só troca a cor (padrão do site: nada de botão subindo ou crescendo) */
// Degradê não anima pra cor sólida (o fundo "pulava" no hover). O degradê
// mora num ::before por cima do vermelho escuro e só some com fade.
.botao-orcamento
  position: relative
  isolation: isolate
  background: $vermelho-escuro
  color: #ffffff
  box-shadow: 0 10px 24px rgba(138,15,23,.35)

  &::before
    content: ''
    position: absolute
    inset: 0
    z-index: -1
    border-radius: inherit
    background: linear-gradient(180deg, $vermelho-claro, $vermelho-escuro)
    transition: opacity .25s ease

  &:hover::before
    opacity: 0

.botao-combo
  background: var(--cor-dourado)
  color: var(--cor-navy)
  box-shadow: 0 10px 24px rgba(122,90,0,.3)

  &:hover
    background: $azul-acao
    color: #ffffff

/* ---- provas sociais ---- */
.provas-hero
  margin: 0
  padding: 10px 22px
  list-style: none
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 10px 26px
  border-radius: 999px
  background: rgba(5,18,61,.38)
  backdrop-filter: blur(7px)
  -webkit-backdrop-filter: blur(7px)

  li
    display: inline-flex
    align-items: center
    gap: 8px
    color: #ffffff
    font-weight: 700
    font-size: 15.5px
    line-height: 1.25
    white-space: nowrap

.provas-hero__icone
  flex: 0 0 auto
  display: inline-flex
  align-items: center
  justify-content: center
  width: 24px
  height: 24px
  border-radius: 50%
  color: #ffffff

  img
    display: block
    width: 14px
    height: 14px

.provas-hero__icone--dourado
  background: var(--cor-dourado)
  color: var(--cor-navy)

.provas-hero__icone--vermelho
  background: $vermelho-claro

.provas-hero__icone--verde
  background: var(--cor-verde-acao)

.provas-hero__icone--azul
  background: $azul-acao

/* ---- curva da base ---- */
.curva-hero
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
    height: var(--curva-h)

/* ---- menos movimento: tudo aparece parado ---- */
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

  .ponto-luz,
  .brilho-titulo,
  .cursor-digitando
    animation: none

/* ---- responsivo ---- */
@media (max-width: 980px)
  .conteudo-hero
    gap: 18px

@media (max-width: 768px)
  .fundo-hero--padrao
    object-position: 50% 42%

  .titulo-padrao
    font-size: clamp(36px, 12vw, 60px)

@media (max-width: 640px)
  .hero
    padding-bottom: calc(var(--curva-h) + 32px)

  .selo-hero
    padding: 7px 14px
    font-size: 12.5px

  .acoes-hero
    width: 100%
    flex-direction: column
    align-items: center
    gap: 12px

  .botao
    width: min(340px, 100%)
    padding: 15px 24px
    font-size: 16.5px

  /* as quatro provas viram uma grade 2x2 num cartão arredondado */
  .provas-hero
    display: grid
    grid-template-columns: repeat(2, minmax(0, 1fr))
    gap: 10px 12px
    width: min(400px, 100%)
    padding: 12px 14px
    border-radius: 20px

    li
      font-size: 13.5px
      white-space: normal
      text-align: left

@media (max-width: 480px)
  .conteudo-hero
    gap: 14px
</style>
