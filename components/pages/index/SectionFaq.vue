<!-- components/pages/index/SectionFaq.vue -->
<template>
  <section
    ref="secEl"
    class="secao-faq"
    :class="{ 'secao-tema': temaAtivo }"
    id="faq"
    aria-labelledby="faq-titulo"
    itemscope
    itemtype="https://schema.org/FAQPage"
  >
    <!-- onda de transição Depoimentos -> FAQ (cor clara do Depoimentos descendo) -->
    <div class="onda-faq-topo" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,0 L1440,0 L1440,40 C1020,120 420,120 0,40 Z" fill="#f7fbff" />
      </svg>
    </div>

    <div class="container faq-grade">
      <!-- Coluna da esquerda: título, ilustração e WhatsApp. No desktop fica
           parada enquanto a lista rola. -->
      <aside class="faq-lateral revelar" data-reveal>
        <p class="faq-kicker" :class="{ 'faq-kicker--tema': temaAtivo }">
          <SvgIcone v-if="temaAtivo" nome="presente" :tamanho="15" />
          Tire suas dúvidas
        </p>

        <h2 class="faq-titulo" id="faq-titulo">
          Perguntas
          <LetrasColoridas v-if="temaAtivo" texto="frequentes" fundo="claro" />
          <template v-else>frequentes</template>
        </h2>

        <p class="faq-subtitulo">
          As dúvidas que mais chegam pra gente. Não achou a sua? Chama no WhatsApp que a gente responde rapidinho.
        </p>

        <!-- Balão com "?" se desenhando e a resposta "digitando..." no WhatsApp. -->
        <svg class="faq-ilustra" viewBox="0 0 240 200" aria-hidden="true">
          <g class="faq-ilustra__pergunta">
            <path
              class="faq-ilustra__balao"
              pathLength="1"
              d="M46 22h112a24 24 0 0124 24v52a24 24 0 01-24 24H92l-26 22v-22H46a24 24 0 01-24-24V46a24 24 0 0124-24z"
            />
            <text class="faq-ilustra__interrogacao" x="102" y="94" text-anchor="middle">?</text>
          </g>

          <g class="faq-ilustra__resposta">
            <path
              d="M150 118h52a18 18 0 0118 18v14a18 18 0 01-18 18h-8v14l-16-14h-28a18 18 0 01-18-18v-14a18 18 0 0118-18z"
            />
            <circle class="faq-ilustra__ponto" cx="160" cy="143" r="5" />
            <circle class="faq-ilustra__ponto" cx="176" cy="143" r="5" />
            <circle class="faq-ilustra__ponto" cx="192" cy="143" r="5" />
          </g>

          <path class="faq-ilustra__brilho" d="M22 150l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
          <path class="faq-ilustra__brilho" d="M206 30l2.5 5.5 5.5 2.5-5.5 2.5-2.5 5.5-2.5-5.5-5.5-2.5 5.5-2.5z" />
          <path class="faq-ilustra__brilho" d="M118 170l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" />
        </svg>

        <a class="faq-whats" :href="whatsLink" target="_blank" rel="noopener noreferrer">
          <SvgIcone nome="whatsapp" :tamanho="22" />
          Tirar dúvida no WhatsApp
        </a>
      </aside>

      <!-- Coluna da direita: acordeão (botão dentro do título, padrão acessível). -->
      <!-- O "aparecer ao rolar" fica na lista, não em cada pergunta: o Vue
           reescreve a classe da pergunta quando ela abre e apagaria o is-inview. -->
      <div class="faq-lista" data-reveal>
        <article
          v-for="(f, i) in faqs"
          :key="f.id"
          class="faq-item"
          :class="{ 'is-aberto': abertoId === f.id }"
          :style="{ '--cor': corDoIcone(f.icon), '--atraso': `${i * 70}ms` }"
          itemprop="mainEntity"
          itemscope
          itemtype="https://schema.org/Question"
        >
          <h3 class="faq-item__titulo">
            <button
              class="faq-item__botao"
              type="button"
              :id="`faq-btn-${f.id}`"
              :aria-expanded="abertoId === f.id ? 'true' : 'false'"
              :aria-controls="`faq-painel-${f.id}`"
              @click="alternar(f.id)"
            >
              <span class="faq-item__icone" aria-hidden="true">
                <SvgIcone :nome="iconeLib(f.icon)" :tamanho="22" />
              </span>

              <span class="faq-item__pergunta" itemprop="name">{{ f.q }}</span>

              <!-- "+" que vira "−": o traço de pé encolhe quando abre -->
              <span class="faq-item__mais" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M6 12h12" />
                  <path class="faq-item__mais-pe" d="M12 6v12" />
                </svg>
              </span>
            </button>
          </h3>

          <!-- A resposta abre deslizando (grid 0fr -> 1fr) e continua no HTML
               fechada: o Google lê todas as respostas. -->
          <div
            class="faq-item__resposta"
            :id="`faq-painel-${f.id}`"
            role="region"
            :aria-labelledby="`faq-btn-${f.id}`"
            :aria-hidden="abertoId === f.id ? 'false' : 'true'"
          >
            <div class="faq-item__resposta-dentro" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
              <p itemprop="text">{{ f.a }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>

    <!-- onda de transição FAQ -> rodapé (azul do rodapé subindo pelas bordas) -->
    <div class="onda-faq-base" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,40 C420,120 1020,120 1440,40 L1440,120 L0,120 Z" fill="#052a54" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import LetrasColoridas from '~/components/global/tema/LetrasColoridas.vue'

type FAQIcon = 'calendar' | 'pin' | 'spray' | 'truck'
type FAQ = { id: string; q: string; a: string; icon: FAQIcon }

const WHATS_NUMERO = '5521984848699'
const whatsLink = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(
  'Olá! Vim pelo site da City Toys e tenho uma dúvida 🙂'
)}`

const faqsBase: FAQ[] = [
  {
    id: 'periodo',
    icon: 'calendar',
    q: 'Período de Locação',
    a: 'O nosso período de locação é de 4 horas, com a possibilidade de adicionar horas extras, caso necessário. Para mais informações, é só chamar a gente no WhatsApp, que explicamos direitinho.'
  },
  {
    id: 'area',
    icon: 'pin',
    q: 'Área Atendida',
    a: 'Atendemos o Rio de Janeiro e regiões próximas. Confirma seu bairro no WhatsApp e a gente te passa certinho.'
  },
  {
    id: 'higiene',
    icon: 'spray',
    q: 'Os brinquedos são higienizados?',
    a: 'Sim! Fazemos limpeza e desinfecção completa após cada locação. Segurança e cuidado em primeiro lugar.'
  },
  {
    id: 'frete',
    icon: 'truck',
    q: 'Cobram frete?',
    a: 'Depende da localização. Algumas regiões têm taxa e outras não. Me chama no WhatsApp que calculamos rapidinho.'
  }
]

// Na temporada de Dia das Crianças a dúvida da data entra em primeiro lugar:
// é a pergunta que mais chega pelo WhatsApp nessa época do ano.
const { temaAtivo, copy } = useTemaSazonal()

const faqs = computed<FAQ[]>(() => {
  if (!temaAtivo.value) return faqsBase

  return [{ id: 'dia-das-criancas', icon: 'calendar', q: copy.faqPergunta, a: copy.faqResposta }, ...faqsBase]
})

function iconeLib(icon: FAQIcon) {
  switch (icon) {
    case 'calendar':
      return 'calendario'
    case 'pin':
      return 'localizacao'
    case 'spray':
      return 'gota'
    default:
      return 'caminhao'
  }
}

// Cada categoria de dúvida tem sua cor (ícone, faixa lateral e "+").
function corDoIcone(icon: FAQIcon) {
  switch (icon) {
    case 'calendar':
      return '#2b74eb'
    case 'pin':
      return '#ff3b3b'
    case 'spray':
      return '#00a8ad'
    default:
      return '#ff9800'
  }
}

// A primeira pergunta já começa aberta; clicar na aberta fecha.
const abertoId = ref<string>(faqs.value[0]?.id || '')
function alternar(id: string) {
  abertoId.value = abertoId.value === id ? '' : id
}

/* ---- revelar no scroll ---- */

const secEl = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

function reduzMovimento() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

onMounted(() => {
  const root = secEl.value
  if (!root) return

  const itens = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'))

  if (reduzMovimento() || !('IntersectionObserver' in window)) {
    itens.forEach((el) => el.classList.add('is-inview'))
    return
  }

  io = new IntersectionObserver(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-inview')
        io?.unobserve(entry.target)
      }),
    { threshold: 0.12, rootMargin: '0px 0px 160px 0px' }
  )

  itens.forEach((el) => io?.observe(el))
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<style lang="sass" scoped>
$texto: #122042
$suave: rgba(18, 32, 66, .74)
$bg: #fff4d6

.secao-faq
  position: relative
  padding: 140px 0 150px
  font-family: var(--fonte)
  color: $texto
  /* clip corta igual ao hidden, mas não desliga o position: sticky da coluna
     da esquerda (hidden fica de reserva pra navegador antigo) */
  overflow: hidden
  overflow: clip
  scroll-margin-top: 90px
  background: $bg

/* ---- ondas ---- */
.onda-faq-topo,
.onda-faq-base
  position: absolute
  left: 0
  width: 100%
  line-height: 0
  z-index: 1
  pointer-events: none

  svg
    display: block
    width: 100%
    height: 90px

.onda-faq-topo
  top: -1px

.onda-faq-base
  bottom: -1px

/* ---- grade de duas colunas ---- */
.container
  position: relative
  z-index: 2
  max-width: 1160px
  margin: 0 auto
  padding: 0 var(--container-px)

.faq-grade
  display: grid
  grid-template-columns: minmax(0, .9fr) minmax(0, 1.3fr)
  gap: 56px
  align-items: start

/* ---- coluna da esquerda ---- */
.faq-lateral
  position: sticky
  top: calc(var(--menu-h, 76px) + 24px)

.faq-kicker
  margin: 0 0 8px
  color: #ff3b3b
  font-size: 13px
  font-weight: 900
  letter-spacing: .6px
  text-transform: uppercase

.faq-titulo
  margin: 0
  font-size: clamp(2rem, 3.4vw, 2.9rem)
  font-weight: 900
  letter-spacing: -0.02em
  line-height: 1.08

.faq-subtitulo
  margin: 14px 0 0
  max-width: 400px
  color: $suave
  font-size: 1.02rem
  line-height: 1.6

.faq-whats
  display: inline-flex
  align-items: center
  gap: 10px
  margin-top: 6px
  padding: 14px 24px
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

/* ---- ilustração ---- */
.faq-ilustra
  display: block
  width: min(260px, 70%)
  height: auto
  margin: 22px 0 18px
  overflow: visible

/* balão da pergunta: o contorno se desenha e depois o fundo aparece */
.faq-ilustra__balao
  fill: #ffffff
  fill-opacity: 0
  stroke: #2b74eb
  stroke-width: 3
  stroke-linejoin: round
  stroke-dasharray: 1
  stroke-dashoffset: 1
  transition: stroke-dashoffset 1.4s ease .2s, fill-opacity .6s ease 1.3s

.faq-lateral.is-inview .faq-ilustra__balao
  stroke-dashoffset: 0
  fill-opacity: 1

.faq-ilustra__interrogacao
  fill: #ff3b3b
  font-family: var(--fonte)
  font-size: 64px
  font-weight: 800
  opacity: 0
  transform-box: fill-box
  transform-origin: 50% 100%
  transition: opacity .4s ease 1.4s

.faq-lateral.is-inview .faq-ilustra__interrogacao
  opacity: 1
  animation: interrogacao-pular 2.4s ease-in-out 1.8s infinite

@keyframes interrogacao-pular
  0%, 60%, 100%
    transform: translateY(0) rotate(0deg)
  20%
    transform: translateY(-10px) rotate(-8deg)
  40%
    transform: translateY(0) rotate(6deg)

/* resposta no WhatsApp com "digitando..." */
.faq-ilustra__resposta
  opacity: 0
  transform: translateY(10px)
  transform-box: fill-box
  transition: opacity .5s ease 1.9s, transform .5s ease 1.9s

  path
    fill: #43d38d

.faq-lateral.is-inview .faq-ilustra__resposta
  opacity: 1
  transform: none

.faq-ilustra__ponto
  fill: #ffffff
  transform-box: fill-box
  transform-origin: center
  animation: ponto-digitando 1.2s ease-in-out infinite

  &:nth-of-type(2)
    animation-delay: .15s

  &:nth-of-type(3)
    animation-delay: .3s

@keyframes ponto-digitando
  0%, 60%, 100%
    transform: translateY(0)
    opacity: .6
  30%
    transform: translateY(-5px)
    opacity: 1

.faq-ilustra__brilho
  fill: #ffc83a
  transform-box: fill-box
  transform-origin: center
  animation: brilho-piscar 2s ease-in-out infinite

  &:nth-of-type(2)
    animation-delay: -.7s

  &:nth-of-type(3)
    animation-delay: -1.3s

@keyframes brilho-piscar
  0%, 100%
    opacity: .3
    transform: scale(.7)
  50%
    opacity: 1
    transform: scale(1.1)

/* ---- acordeão ---- */
.faq-lista
  display: flex
  flex-direction: column
  gap: 14px

.faq-item
  position: relative
  border-radius: 20px
  background: #ffffff
  border: 1px solid #f1e6c8
  box-shadow: 0 10px 26px rgba(120,84,0,.07)
  overflow: hidden
  transition: border-color .3s ease, box-shadow .3s ease

  /* faixa colorida na lateral quando abre */
  &::before
    content: ""
    position: absolute
    top: 0
    bottom: 0
    left: 0
    width: 5px
    background: var(--cor)
    transform: scaleY(0)
    transition: transform .35s ease

  &.is-aberto
    border-color: color-mix(in srgb, var(--cor) 35%, #ffffff)
    box-shadow: 0 18px 40px rgba(120,84,0,.12)

    &::before
      transform: scaleY(1)

.faq-item__titulo
  margin: 0

.faq-item__botao
  display: flex
  align-items: center
  gap: 16px
  width: 100%
  padding: 18px 20px
  border: 0
  background: transparent
  color: $texto
  font-family: inherit
  text-align: left
  cursor: pointer

  &:focus-visible
    outline: 3px solid color-mix(in srgb, var(--cor) 45%, #ffffff)
    outline-offset: -3px
    border-radius: 20px

  &:hover .faq-item__mais
    transform: scale(1.08)

.faq-item__icone
  flex: none
  display: grid
  place-items: center
  width: 46px
  height: 46px
  border-radius: 14px
  background: #f4f7fb
  background: color-mix(in srgb, var(--cor) 14%, #ffffff)
  color: var(--cor)
  transition: background .3s ease, color .3s ease

.faq-item.is-aberto .faq-item__icone
  background: var(--cor)
  color: #ffffff
  animation: icone-balancar .6s ease-in-out

@keyframes icone-balancar
  0%, 100%
    transform: rotate(0deg)
  25%
    transform: rotate(-12deg)
  75%
    transform: rotate(10deg)

.faq-item__pergunta
  flex: 1
  font-size: 1.08rem
  font-weight: 900
  line-height: 1.3

.faq-item__mais
  flex: none
  display: grid
  place-items: center
  width: 36px
  height: 36px
  border-radius: 50%
  background: #f6f1e3
  color: $texto
  transition: background .3s ease, color .3s ease, transform .35s ease

  svg
    width: 18px
    height: 18px

  path
    fill: none
    stroke: currentColor
    stroke-width: 2.6
    stroke-linecap: round

.faq-item__mais-pe
  transform-box: fill-box
  transform-origin: center
  transition: transform .35s ease

.faq-item.is-aberto .faq-item__mais
  background: var(--cor)
  color: #ffffff
  transform: rotate(180deg)

  .faq-item__mais-pe
    transform: scaleY(0)

/* resposta abrindo deslizando */
.faq-item__resposta
  display: grid
  grid-template-rows: 0fr
  transition: grid-template-rows .4s ease

.faq-item.is-aberto .faq-item__resposta
  grid-template-rows: 1fr

.faq-item__resposta-dentro
  overflow: hidden

  p
    margin: 0
    padding: 0 24px 22px 82px
    color: $suave
    font-size: 1rem
    line-height: 1.65
    opacity: 0
    transform: translateY(-6px)
    transition: opacity .3s ease, transform .3s ease

.faq-item.is-aberto .faq-item__resposta-dentro p
  opacity: 1
  transform: none
  transition: opacity .35s ease .12s, transform .35s ease .12s

/* ---- revelar no scroll ---- */
.revelar
  opacity: 0
  transform: translateY(16px)
  transition: opacity .6s ease, transform .6s ease

  &.is-inview
    opacity: 1
    transform: none

/* as perguntas entram em sequência quando a lista aparece */
.faq-lista .faq-item
  opacity: 0
  transform: translateY(16px)
  transition: opacity .6s ease var(--atraso), transform .6s ease var(--atraso), border-color .3s ease, box-shadow .3s ease

.faq-lista.is-inview .faq-item
  opacity: 1
  transform: none

/* ---- celular e tablet ---- */
@media (max-width: 900px)
  .secao-faq
    padding: 110px 0 120px

  .faq-grade
    grid-template-columns: 1fr
    gap: 28px

  .faq-lateral
    position: static
    text-align: center

  .faq-subtitulo
    margin-inline: auto

  .faq-ilustra
    width: min(200px, 60%)
    margin: 18px auto 14px

@media (max-width: 520px)
  .faq-item__botao
    gap: 12px
    padding: 16px 14px

  .faq-item__icone
    width: 40px
    height: 40px

  .faq-item__pergunta
    font-size: 1rem

  .faq-item__resposta-dentro p
    padding: 0 16px 18px 16px

  .faq-whats
    justify-content: center
    width: 100%

/* ---- tema sazonal (Dia das Crianças) ---- */
/* Tudo abaixo depende da classe .secao-tema, que entra e sai com a campanha
   (composables/useTemaSazonal.ts). */
.secao-tema
  background-image: var(--tema-confete-fundo)
  background-size: 240px 240px

.faq-kicker--tema
  color: #d62f35

  :deep(svg)
    vertical-align: -2px
    margin-right: 4px

/* ---- menos movimento: tudo aparece pronto e parado ---- */
@media (prefers-reduced-motion: reduce)
  .revelar,
  .faq-lista .faq-item,
  .faq-ilustra__resposta
    opacity: 1
    transform: none
    transition: none

  .faq-ilustra__balao
    stroke-dashoffset: 0
    fill-opacity: 1
    transition: none

  .faq-ilustra__interrogacao
    opacity: 1
    transition: none

  .faq-ilustra__interrogacao,
  .faq-lateral.is-inview .faq-ilustra__interrogacao,
  .faq-ilustra__ponto,
  .faq-ilustra__brilho,
  .faq-item.is-aberto .faq-item__icone
    animation: none

  .faq-item__resposta,
  .faq-item__resposta-dentro p
    transition: none
</style>
