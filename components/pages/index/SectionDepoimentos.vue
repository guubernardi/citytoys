<!-- components/pages/index/SectionDepoimentos.vue -->
<template>
  <!-- âncora do link "Depoimentos" do menu -->
  <div id="depoimentos" aria-hidden="true"></div>

  <section
    ref="secEl"
    id="secao-depoimentos"
    class="secao-depoimentos"
    :class="{ 'secao-tema': temaAtivo }"
    aria-labelledby="depoimentos-titulo"
  >
    <!-- Rabiscos de fundo: se desenham quando a seção aparece e depois flutuam. -->
    <div class="rabiscos" aria-hidden="true">
      <svg
        v-for="r in rabiscos"
        :key="r.id"
        class="rabisco"
        :class="[`rabisco--${r.id}`, { 'rabisco--mobile': r.mobile }]"
        :viewBox="r.viewBox"
        data-reveal
      >
        <path :d="r.d" pathLength="1" />
      </svg>
    </div>

    <div class="container">
      <header class="cabecalho-depoimentos revelar" data-reveal>
        <p class="kicker-depoimentos" :class="{ 'kicker-depoimentos--tema': temaAtivo }">
          <SvgIcone v-if="temaAtivo" nome="presente" :tamanho="15" />
          O que os pais dizem
        </p>

        <h2 class="titulo-secao" id="depoimentos-titulo">
          Depoimentos dos pais
          <LetrasColoridas v-if="temaAtivo" texto="felizes" fundo="claro" />
          <template v-else>felizes</template>
        </h2>

        <p class="subtitulo-secao">
          Brinquedo alugado! Mais de 3 mil festas realizadas com alegria e segurança.
        </p>

        <!-- Média calculada só com os depoimentos abaixo (não é nota de plataforma). -->
        <p class="resumo-nota">
          <strong class="resumo-nota__valor">{{ mediaTexto }}</strong>
          <span class="estrelas estrelas--resumo" :style="{ '--preenchimento': preenchimento(media) }" aria-hidden="true">
            <span class="estrelas__vazias">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
            </span>
            <span class="estrelas__cheias">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
            </span>
          </span>
          <span class="resumo-nota__texto">média dos {{ depoimentos.length }} depoimentos</span>
        </p>
      </header>

      <div
        class="carrossel"
        :class="{ 'is-pausado': pausado, 'is-autoplay': autoplayLigado }"
        role="region"
        aria-roledescription="carrossel"
        aria-label="Depoimentos de clientes"
        @pointerenter="aoEntrarPonteiro"
        @pointerleave="aoSairPonteiro"
        @focusin="aoFocar"
        @focusout="foco = false"
        @keydown.left.prevent="anterior"
        @keydown.right.prevent="proximo"
      >
        <div
          ref="trilhaEl"
          class="trilha"
          tabindex="0"
          :aria-live="autoplayLigado && !pausado ? 'off' : 'polite'"
          @scroll="aoRolar"
        >
          <article
            v-for="(d, i) in depoimentos"
            :key="d.id"
            :ref="(el) => guardarCartao(el, i)"
            :id="d.id"
            class="depo"
            :class="{ 'is-ativo': i === ativo }"
            :style="{ '--cor': d.cor, '--cor-texto': d.corTexto || '#ffffff' }"
            role="group"
            aria-roledescription="depoimento"
            :aria-label="`${i + 1} de ${depoimentos.length}`"
            @click="i !== ativo && irPara(i)"
          >
            <svg class="depo__aspas" viewBox="0 0 24 24" aria-hidden="true">
              <path :d="ASPAS" pathLength="1" />
            </svg>

            <div class="depo__nota" :aria-label="`Nota ${d.nota} de 5`">
              <span class="estrelas" :style="{ '--preenchimento': preenchimento(notaNumero(d.nota)) }" aria-hidden="true">
                <span class="estrelas__vazias">
                  <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
                </span>
                <span class="estrelas__cheias">
                  <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
                </span>
              </span>
              <strong>{{ d.nota }}</strong>
            </div>

            <h3 class="depo__titulo">{{ d.titulo }}</h3>
            <p class="depo__texto">“{{ d.texto }}”</p>

            <footer class="depo__autor">
              <span class="depo__avatar" aria-hidden="true">
                <svg class="depo__anel" viewBox="0 0 60 60"><circle cx="30" cy="30" r="28" /></svg>
                {{ d.nome.charAt(0) }}
              </span>

              <span class="depo__quem">
                <strong>{{ d.nome }}</strong>
                <span class="depo__cidade">
                  <SvgIcone nome="localizacao" :tamanho="14" />
                  {{ d.cidade }}
                </span>
              </span>

              <span class="depo__icone" aria-hidden="true">
                <SvgIcone :nome="d.icone" :tamanho="22" />
              </span>
            </footer>
          </article>
        </div>

        <div class="controles">
          <button type="button" class="seta" aria-label="Depoimento anterior" @click="anterior">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
          </button>

          <div class="pontos">
            <button
              v-for="(d, i) in depoimentos"
              :key="`ponto-${d.id}`"
              type="button"
              class="ponto"
              :class="{ 'is-ativo': i === ativo }"
              :aria-label="`Ver depoimento ${i + 1} de ${depoimentos.length}`"
              :aria-current="i === ativo ? 'true' : undefined"
              @click="irPara(i)"
            >
              <!-- A barrinha enche no tempo da troca automática; quando termina,
                   passa pro próximo. Pausa junto com o carrossel. -->
              <span
                v-if="autoplayLigado && i === ativo"
                :key="`progresso-${ativo}`"
                class="ponto__progresso"
                @animationend="proximo"
              ></span>
            </button>
          </div>

          <button type="button" class="seta" aria-label="Próximo depoimento" @click="proximo">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </div>
      </div>

      <div class="cta-depoimentos revelar" data-reveal>
        <a
          id="botao-whatsapp"
          class="botao-whats"
          :href="whatsLink"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Abrir WhatsApp para fazer orçamento"
        >
          <SvgIcone nome="whatsapp" :tamanho="22" />
          <span>Quero fazer meu orçamento no WhatsApp</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import LetrasColoridas from '~/components/global/tema/LetrasColoridas.vue'

type Depoimento = {
  id: string
  icone: string
  nota: string
  titulo: string
  texto: string
  nome: string
  cidade: string
  cor: string
  corTexto?: string
}

type Rabisco = { id: string; viewBox: string; d: string; mobile?: boolean }

const { temaAtivo } = useTemaSazonal()

const secEl = ref<HTMLElement | null>(null)
const trilhaEl = ref<HTMLElement | null>(null)

const ESTRELA = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'
const ASPAS =
  'M4.6 17.3C3.6 16.2 3 15 3 13c0-3.5 2.5-6.6 6-8.2l.9 1.4c-3.3 1.8-4 4.1-4.2 5.6.5-.3 1.2-.4 1.9-.3 1.8.2 3.2 1.6 3.2 3.5a3.5 3.5 0 01-3.5 3.5c-1.1 0-2.1-.5-2.7-1.2zm10 0C13.6 16.2 13 15 13 13c0-3.5 2.5-6.6 6-8.2l.9 1.4c-3.3 1.8-4 4.1-4.2 5.6.5-.3 1.2-.4 1.9-.3 1.8.2 3.2 1.6 3.2 3.5a3.5 3.5 0 01-3.5 3.5c-1.1 0-2.1-.5-2.7-1.2z'

const WHATS_NUMERO = '5521984848699'
const whatsMsg = 'Olá! Vim pelo site da City Toys, e quero fazer um orçamento 🎉'
const whatsLink = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(whatsMsg)}`

// Depoimentos reais dos clientes: texto, nome e bairro não mudam.
const depoimentos: Depoimento[] = [
  {
    id: 'depoimento-camila',
    icone: 'coracao',
    nota: '4,9',
    titulo: 'Tudo perfeito!',
    texto: 'A criançada se divertiu bastante. Chegaram no horário certinho e montaram tudo rapidinho.',
    nome: 'Camila S.',
    cidade: 'Barra da Tijuca (RJ)',
    cor: '#2fb67c'
  },
  {
    id: 'depoimento-fabiana',
    icone: 'balao-ar',
    nota: '5,0',
    titulo: 'Muito atenciosos!',
    texto: 'A festa foi um sucesso. Com certeza alugaremos novamente!',
    nome: 'Fabiana M.',
    cidade: 'Recreio dos Bandeirantes (RJ)',
    cor: '#f7c223',
    corTexto: '#052a54'
  },
  {
    id: 'depoimento-dani',
    icone: 'presente',
    nota: '4,9',
    titulo: 'Atendimento e brinquedos nota 10!',
    texto: 'Vale muito a pena. Meu filho amou!',
    nome: 'Dani A.',
    cidade: 'Tijuca (RJ)',
    cor: '#d14369'
  },
  {
    id: 'depoimento-ricardo',
    icone: 'estrela',
    nota: '5,0',
    titulo: 'A experiência foi excelente!',
    texto: 'Recomendo muito a City Toys, equipe super profissional.',
    nome: 'Ricardo T.',
    cidade: 'Botafogo (RJ)',
    cor: '#2b74eb'
  },
  {
    id: 'depoimento-livia',
    icone: 'arco-iris',
    nota: '5,0',
    titulo: 'Excelente serviço!',
    texto: 'Tudo limpo, seguro e de qualidade. Crianças amaram o tobogã!',
    nome: 'Lívia F.',
    cidade: 'Copacabana (RJ)',
    cor: '#ff8f2d'
  },
  {
    id: 'depoimento-andre',
    icone: 'bolo',
    nota: '5,0',
    titulo: 'Festa de 6 anos do meu filho foi incrível!',
    texto: 'Os infláveis fizeram sucesso.',
    nome: 'André R.',
    cidade: 'Jacarepaguá (RJ)',
    cor: '#8b5cf6'
  }
]

// Rabiscos em traço (desenhados com stroke-dashoffset + pathLength="1").
const rabiscos: Rabisco[] = [
  {
    id: 'coracao',
    viewBox: '0 0 24 24',
    d: 'M12 20.5s-7.2-4.4-9.3-8.6C1 8.4 3.1 4.5 7 4.5c2 0 3.4 1 5 2.9 1.6-1.9 3-2.9 5-2.9 3.9 0 6 3.9 4.3 7.4-2.1 4.2-9.3 8.6-9.3 8.6z',
    mobile: true
  },
  { id: 'estrela', viewBox: '0 0 24 24', d: ESTRELA, mobile: true },
  { id: 'rabisco', viewBox: '0 0 40 16', d: 'M2 10c4-8 7 8 11 0s7 8 11 0 7 8 11 0 3 3 3 3' },
  {
    id: 'fala',
    viewBox: '0 0 24 24',
    d: 'M5 4.5h14a2.5 2.5 0 012.5 2.5v8a2.5 2.5 0 01-2.5 2.5h-8l-4.5 3.5v-3.5H5A2.5 2.5 0 012.5 15V7A2.5 2.5 0 015 4.5z'
  },
  {
    id: 'balao',
    viewBox: '0 0 24 30',
    d: 'M12 2.5c-4.4 0-7.5 3.5-7.5 8s3.6 8.5 7.5 8.5 7.5-4 7.5-8.5-3.1-8-7.5-8zM12 19l-1.4 2h2.8L12 19M12 21c-1.6 2 1.6 3.5 0 5.5s1.2 2.5 0 3.5'
  }
]

function notaNumero(nota: string) {
  return Number(nota.replace(',', '.'))
}

// Quanto das 5 estrelas fica cheio: 4,9 enche 98%.
function preenchimento(nota: number) {
  return `${(nota / 5) * 100}%`
}

const media = depoimentos.reduce((soma, d) => soma + notaNumero(d.nota), 0) / depoimentos.length
// toFixed em vez de toLocaleString: sai igual no servidor e no navegador.
const mediaTexto = media.toFixed(2).replace('.', ',')

/* ---- carrossel ---- */

const cartoes: (HTMLElement | null)[] = []
function guardarCartao(el: Element | ComponentPublicInstance | null, i: number) {
  cartoes[i] = el as HTMLElement | null
}

const ativo = ref(0)
const hover = ref(false)
const foco = ref(false)
const visivel = ref(false)
const autoplayLigado = ref(false) // liga no onMounted, se a pessoa não pediu menos movimento
let reduzMovimento = false

// Pausa com o mouse em cima, com foco dentro (teclado) ou fora da tela.
const pausado = computed(() => hover.value || foco.value || !visivel.value)

// Só mouse pausa no hover: no toque o "pointerleave" nem sempre chega e o
// carrossel ficaria parado pra sempre depois do primeiro toque.
function aoEntrarPonteiro(e: PointerEvent) {
  if (e.pointerType === 'mouse') hover.value = true
}
function aoSairPonteiro(e: PointerEvent) {
  if (e.pointerType === 'mouse') hover.value = false
}

// Só foco de teclado pausa. Clicar numa seta com o mouse também foca o botão,
// e aí a troca automática não voltaria nunca mais.
function aoFocar(e: FocusEvent) {
  const alvo = e.target as HTMLElement | null
  foco.value = !!alvo?.matches?.(':focus-visible')
}

function centralizar(i: number, suave = true) {
  const trilha = trilhaEl.value
  const cartao = cartoes[i]
  if (!trilha || !cartao) return

  const esquerda = cartao.offsetLeft - (trilha.clientWidth - cartao.offsetWidth) / 2
  trilha.scrollTo({ left: Math.max(0, esquerda), behavior: suave && !reduzMovimento ? 'smooth' : 'auto' })
}

function irPara(i: number) {
  const total = depoimentos.length
  ativo.value = (i + total) % total
  centralizar(ativo.value)
}

const proximo = () => irPara(ativo.value + 1)
const anterior = () => irPara(ativo.value - 1)

// Quando a pessoa arrasta com o dedo, descobre qual cartão parou no centro.
let tRolagem: number | null = null
function aoRolar() {
  if (tRolagem) window.clearTimeout(tRolagem)

  tRolagem = window.setTimeout(() => {
    const trilha = trilhaEl.value
    if (!trilha) return

    const centro = trilha.scrollLeft + trilha.clientWidth / 2
    let maisPerto = ativo.value
    let menorDistancia = Infinity

    cartoes.forEach((c, i) => {
      if (!c) return
      const distancia = Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro)
      if (distancia < menorDistancia) {
        menorDistancia = distancia
        maisPerto = i
      }
    })

    ativo.value = maisPerto
  }, 90)
}

function aoRedimensionar() {
  centralizar(ativo.value, false)
}

/* ---- revelar no scroll ---- */

let ioRevelar: IntersectionObserver | null = null
let ioVisivel: IntersectionObserver | null = null

onMounted(() => {
  const root = secEl.value
  if (!root) return

  reduzMovimento = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
  autoplayLigado.value = !reduzMovimento

  const itens = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))

  if (reduzMovimento || !('IntersectionObserver' in window)) {
    itens.forEach((el) => el.classList.add('is-inview'))
    visivel.value = true
  } else {
    ioRevelar = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-inview')
          ioRevelar?.unobserve(entry.target)
        }),
      { threshold: 0.12, rootMargin: '0px 0px 160px 0px' }
    )
    itens.forEach((el) => ioRevelar?.observe(el))

    // A troca automática só anda com a seção na tela.
    ioVisivel = new IntersectionObserver(([entry]) => (visivel.value = !!entry?.isIntersecting), {
      threshold: 0.35
    })
    ioVisivel.observe(root)
  }

  window.addEventListener('resize', aoRedimensionar, { passive: true })
})

onBeforeUnmount(() => {
  ioRevelar?.disconnect()
  ioVisivel?.disconnect()
  ioRevelar = null
  ioVisivel = null
  if (tRolagem) window.clearTimeout(tRolagem)
  window.removeEventListener('resize', aoRedimensionar)
})
</script>

<style lang="sass" scoped>
$bg: #f7fbff
$texto: #122042
$suave: rgba(18, 32, 66, .72)

/* O fundo precisa continuar #f7fbff: é a cor das ondas dos Benefícios (em
   cima) e do FAQ (embaixo). */
.secao-depoimentos
  position: relative
  background: $bg
  color: $texto
  padding: 84px 0 96px
  overflow: hidden
  font-family: var(--fonte)

  .container
    position: relative
    z-index: 2
    max-width: var(--largura-max)
    margin: 0 auto
    padding: 0 var(--container-px)

/* ---- cabeçalho ---- */
.cabecalho-depoimentos
  text-align: center
  max-width: 820px
  margin: 0 auto 10px

.kicker-depoimentos
  margin: 0 0 8px
  color: #2b74eb
  font-size: 13px
  font-weight: 900
  letter-spacing: .6px
  text-transform: uppercase

.titulo-secao
  margin: 0
  font-size: clamp(1.8rem, 3vw, 2.6rem)
  font-weight: 900
  letter-spacing: -0.02em
  line-height: 1.15

.subtitulo-secao
  margin: 10px 0 0
  color: $suave
  font-size: 1.02rem
  line-height: 1.6

.resumo-nota
  display: inline-flex
  flex-wrap: wrap
  align-items: center
  justify-content: center
  gap: 8px 10px
  margin: 18px 0 0
  padding: 8px 18px
  border-radius: 999px
  background: #ffffff
  border: 1px solid #e6edf6
  box-shadow: 0 8px 20px rgba(18,48,98,.06)

.resumo-nota__valor
  font-size: 1.1rem
  font-weight: 900

.resumo-nota__texto
  color: $suave
  font-size: .92rem
  font-weight: 700

/* ---- estrelas: fileira cinza + fileira amarela cortada no tamanho da nota ---- */
.estrelas
  position: relative
  display: inline-flex

.estrelas__vazias,
.estrelas__cheias
  display: flex
  gap: 3px

  svg
    flex: none
    width: 18px
    height: 18px

.estrelas__vazias path
  fill: #e3e8f0

.estrelas__cheias
  position: absolute
  top: 0
  bottom: 0
  left: 0
  overflow: hidden
  width: var(--preenchimento)

  path
    fill: #ffc83a

/* ---- carrossel ---- */
.carrossel
  --largura-cartao: min(640px, 82vw)
  --vao: 24px
  position: relative
  margin-top: 6px

.trilha
  position: relative
  display: flex
  gap: var(--vao)
  overflow-x: auto
  scroll-snap-type: x mandatory
  /* sobra dos lados = metade do que falta pro cartão ocupar tudo: o 1º e o
     último também conseguem parar no centro */
  padding: 26px calc((100% - var(--largura-cartao)) / 2) 34px
  scrollbar-width: none
  -webkit-overflow-scrolling: touch
  border-radius: 28px
  outline: none

  &::-webkit-scrollbar
    display: none

  &:focus-visible
    box-shadow: 0 0 0 3px rgba(43,116,235,.35)

@media (min-width: 760px)
  /* os vizinhos somem suavemente nas bordas */
  .trilha
    mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)
    -webkit-mask-image: linear-gradient(90deg, transparent 0, #000 8%, #000 92%, transparent 100%)

/* ---- cartão ---- */
.depo
  position: relative
  flex: 0 0 var(--largura-cartao)
  scroll-snap-align: center
  display: flex
  flex-direction: column
  gap: 12px
  padding: 34px 34px 26px
  border-radius: 28px
  background: #ffffff
  border: 1px solid #e6edf6
  box-shadow: 0 14px 34px rgba(18,48,98,.08)
  overflow: hidden
  cursor: pointer
  transform: scale(.9)
  transition: transform .55s cubic-bezier(.2,.8,.2,1), box-shadow .55s ease

  /* faixa de cor no topo */
  &::before
    content: ""
    position: absolute
    top: 0
    left: 0
    right: 0
    height: 6px
    background: var(--cor)

  /* Véu dos vizinhos: esmaece o conteúdo mas o cartão continua sólido. Com
     opacity no cartão inteiro, o confete do fundo aparecia através dele. */
  &::after
    content: ""
    position: absolute
    inset: 0
    z-index: 3
    background: rgba(247,251,255,.62)
    pointer-events: none
    transition: opacity .55s ease

  &.is-ativo
    cursor: default
    transform: scale(1)
    box-shadow: 0 26px 60px rgba(18,48,98,.16)

    &::after
      opacity: 0

/* aspas que se desenham quando o cartão vira destaque */
.depo__aspas
  position: absolute
  top: 22px
  right: 26px
  width: 64px
  height: 64px
  overflow: visible

  path
    fill: var(--cor)
    fill-opacity: 0
    stroke: var(--cor)
    stroke-width: .6
    stroke-dasharray: 1
    stroke-dashoffset: 1
    transition: stroke-dashoffset .3s ease, fill-opacity .3s ease

.depo.is-ativo .depo__aspas path
  stroke-dashoffset: 0
  fill-opacity: .16
  transition: stroke-dashoffset 1.2s ease .15s, fill-opacity .6s ease 1.1s

.depo__nota
  display: flex
  align-items: center
  gap: 10px

  strong
    font-size: 1.05rem
    font-weight: 900

/* nos cartões as estrelas enchem quando o cartão vira destaque */
.depo .estrelas__cheias
  width: 0
  transition: width .3s ease

.depo.is-ativo .estrelas__cheias
  width: var(--preenchimento)
  transition: width .9s cubic-bezier(.2,.8,.2,1) .25s

.depo .estrelas svg
  width: 20px
  height: 20px

.depo__titulo
  margin: 4px 0 0
  padding-right: 70px
  font-size: clamp(1.2rem, 1.8vw, 1.45rem)
  font-weight: 900
  letter-spacing: -0.01em
  line-height: 1.2

.depo__texto
  flex: 1
  margin: 0
  color: $suave
  font-size: 1.05rem
  line-height: 1.65

.depo__autor
  display: flex
  align-items: center
  gap: 14px
  margin-top: 8px
  padding-top: 18px
  border-top: 1px dashed #e3e9f2

/* inicial num círculo da cor do depoimento, com um anel pontilhado girando */
.depo__avatar
  position: relative
  flex: none
  display: grid
  place-items: center
  width: 50px
  height: 50px
  border-radius: 50%
  background: var(--cor)
  color: var(--cor-texto)
  font-size: 1.25rem
  font-weight: 900

.depo__anel
  position: absolute
  inset: -6px
  width: calc(100% + 12px)
  height: calc(100% + 12px)
  animation: anel-girar 14s linear infinite

  circle
    fill: none
    stroke: var(--cor)
    stroke-width: 1.6
    stroke-dasharray: 3 5
    stroke-linecap: round
    opacity: .6

@keyframes anel-girar
  to
    transform: rotate(360deg)

.depo__quem
  display: flex
  flex-direction: column
  min-width: 0

  strong
    font-weight: 900

.depo__cidade
  display: inline-flex
  align-items: center
  gap: 4px
  color: rgba(18,32,66,.62)
  font-size: .92rem

.depo__icone
  flex: none
  display: grid
  place-items: center
  width: 44px
  height: 44px
  margin-left: auto
  border-radius: 14px
  background: #f4f7fb
  background: color-mix(in srgb, var(--cor) 14%, #ffffff)
  color: var(--cor)

.depo.is-ativo .depo__icone
  animation: icone-balancar 3s ease-in-out infinite

@keyframes icone-balancar
  0%, 100%
    transform: rotate(-8deg)
  50%
    transform: rotate(8deg) scale(1.06)

/* ---- setas e bolinhas ---- */
.controles
  display: flex
  align-items: center
  justify-content: center
  gap: 14px

.seta
  display: grid
  place-items: center
  width: 46px
  height: 46px
  border: 0
  border-radius: 50%
  background: #ffffff
  color: $texto
  box-shadow: 0 8px 20px rgba(18,48,98,.10)
  cursor: pointer
  transition: transform .2s ease, background .2s ease, color .2s ease

  svg
    width: 20px
    height: 20px

  path
    fill: none
    stroke: currentColor
    stroke-width: 2.4
    stroke-linecap: round
    stroke-linejoin: round

  &:hover
    background: #2b74eb
    color: #ffffff
    transform: scale(1.08)

  &:focus-visible
    outline: 3px solid rgba(43,116,235,.45)
    outline-offset: 2px

.pontos
  display: flex
  align-items: center
  gap: 8px

.ponto
  position: relative
  width: 10px
  height: 10px
  padding: 0
  border: 0
  border-radius: 999px
  background: rgba(18,32,66,.18)
  overflow: hidden
  cursor: pointer
  transition: width .35s ease, background .35s ease

  &.is-ativo
    width: 38px
    background: #2b74eb

  &:focus-visible
    outline: 3px solid rgba(43,116,235,.45)
    outline-offset: 2px

/* com troca automática, a bolinha ativa vira barrinha de progresso */
.carrossel.is-autoplay .ponto.is-ativo
  background: rgba(43,116,235,.22)

.ponto__progresso
  position: absolute
  inset: 0
  background: #2b74eb
  transform: scaleX(0)
  transform-origin: left
  animation: progresso-depoimento 7s linear forwards

.carrossel.is-pausado .ponto__progresso
  animation-play-state: paused

@keyframes progresso-depoimento
  to
    transform: scaleX(1)

/* ---- CTA ---- */
.cta-depoimentos
  display: flex
  justify-content: center
  margin-top: 30px

.botao-whats
  display: inline-flex
  align-items: center
  gap: 10px
  padding: 15px 28px
  border-radius: 999px
  background: #43d38d
  color: #ffffff
  font-weight: 900
  text-decoration: none
  box-shadow: 0 12px 26px rgba(67,211,141,.28)
  transition: background .2s ease, transform .25s ease, box-shadow .25s ease

  &:hover
    background: #ff3b3b
    box-shadow: 0 14px 30px rgba(255,59,59,.28)
    transform: translateY(-3px)

    :deep(svg)
      animation: icone-balancar .6s ease-in-out 2

/* ---- rabiscos de fundo ---- */
.rabiscos
  position: absolute
  inset: 0
  z-index: 1
  pointer-events: none

.rabisco
  position: absolute
  width: var(--tam, 52px)
  height: auto
  overflow: visible
  opacity: .6
  animation: rabisco-flutuar 7s ease-in-out infinite

  path
    fill: none
    stroke: var(--cor)
    stroke-width: 1.6
    stroke-linecap: round
    stroke-linejoin: round
    stroke-dasharray: 1
    stroke-dashoffset: 1
    transition: stroke-dashoffset 1.8s ease .2s

  &.is-inview path
    stroke-dashoffset: 0

.rabisco--coracao
  --cor: #ff6fae
  top: 9%
  left: 7%

.rabisco--estrela
  --cor: #f7c223
  top: 7%
  right: 9%
  animation-delay: -2s

.rabisco--rabisco
  --cor: #2b74eb
  --tam: 70px
  top: 24%
  right: 15%
  animation-delay: -4s

.rabisco--fala
  --cor: #2fb67c
  bottom: 10%
  left: 6%
  animation-delay: -1s

.rabisco--balao
  --cor: #8b5cf6
  --tam: 44px
  bottom: 8%
  right: 7%
  animation-delay: -3s

@keyframes rabisco-flutuar
  0%, 100%
    transform: translateY(0) rotate(-4deg)
  50%
    transform: translateY(-10px) rotate(4deg)

/* ---- revelar no scroll ---- */
.revelar
  opacity: 0
  transform: translateY(16px)
  transition: opacity .6s ease, transform .6s ease

  &.is-inview
    opacity: 1
    transform: none

/* ---- celular ---- */
@media (max-width: 759px)
  .carrossel
    --largura-cartao: 84vw
    --vao: 14px

  .depo
    padding: 28px 22px 22px
    transform: scale(.94)

  /* no celular o selo da média quebra em duas linhas: pílula muito redonda fica estranha */
  .resumo-nota
    border-radius: 20px

  .depo__aspas
    top: 18px
    right: 18px
    width: 48px
    height: 48px

  .depo__titulo
    padding-right: 50px

  .depo__texto
    font-size: 1rem

  .botao-whats
    justify-content: center
    width: 100%
    text-align: center

  .rabisco
    --tam: 34px

  .rabisco:not(.rabisco--mobile)
    display: none

  .rabisco--coracao
    top: 3%
    left: 5%

  .rabisco--estrela
    top: 3%
    right: 6%

/* ---- tema sazonal (Dia das Crianças) ---- */
/* Tudo abaixo depende da classe .secao-tema, que entra e sai com a campanha
   (composables/useTemaSazonal.ts). */
.secao-tema
  background-image: var(--tema-confete-fundo)
  background-size: 240px 240px

/* respiro liso atrás do cabeçalho: confete só em volta, nunca atrás do texto */
.secao-tema .cabecalho-depoimentos
  background: radial-gradient(ellipse 70% 90% at center, #f7fbff 62%, rgba(247,251,255,0) 100%)

.kicker-depoimentos--tema
  color: #d62f35

  :deep(svg)
    vertical-align: -2px
    margin-right: 4px

.secao-tema .ponto.is-ativo .ponto__progresso
  background: linear-gradient(90deg, #ffd23f, #ff6b6b, #a45cff)

/* ---- menos movimento: tudo aparece pronto e parado ---- */
@media (prefers-reduced-motion: reduce)
  .revelar
    opacity: 1
    transform: none
    transition: none

  .depo,
  .depo::after,
  .depo__aspas path,
  .depo .estrelas__cheias
    transition: none

  .rabisco,
  .depo__anel,
  .depo.is-ativo .depo__icone
    animation: none

  .rabisco path
    stroke-dashoffset: 0
    transition: none
</style>
