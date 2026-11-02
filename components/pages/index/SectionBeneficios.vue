<!-- components/pages/index/SectionBeneficios.vue -->
<!-- "Números e benefícios" (Figma 22:1160). Fundo noite com curvas em cima e
     embaixo, faixa de números e três cards. O layout é o mesmo com ou sem
     tema; no Natal entram flocos e brilhos e o subtítulo fala de fim de ano. -->
<template>
  <section
    ref="secEl"
    class="secao-beneficios"
    :class="{ 'secao-tema': temaAtivo }"
    id="beneficios"
    aria-labelledby="beneficios-titulo"
  >
    <!-- O gelo do Passo a passo desce pelas laterais e a noite sobe em arco. -->
    <svg class="curva curva--topo" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 0H1440V80C960 0 480 0 0 80V0Z" />
    </svg>

    <template v-if="temaAtivo">
      <img
        v-for="(e, i) in enfeites"
        :key="e.id"
        class="enfeite"
        :class="[`enfeite--${e.tipo}`, { 'enfeite--desktop': e.soDesktop }]"
        :src="e.tipo === 'neve' ? '/images/natal/beneficios-neve.svg' : '/images/natal/beneficios-brilho.svg'"
        alt=""
        aria-hidden="true"
        :width="e.tamanho"
        :height="e.tamanho"
        :style="estiloEnfeite(e, i)"
      />
    </template>

    <div class="container">
      <header class="cabecalho-beneficios" data-reveal>
        <p class="olho-beneficios">
          <img v-if="temaAtivo" class="olho-brilho" src="/images/natal/beneficios-brilho.svg" alt="" aria-hidden="true" width="12" height="12" />
          <span>Benefícios</span>
          <img v-if="temaAtivo" class="olho-brilho" src="/images/natal/beneficios-brilho.svg" alt="" aria-hidden="true" width="12" height="12" />
        </p>

        <!-- &nbsp; mantém "City Toys" sempre na mesma linha. -->
        <h2 class="titulo-beneficios" id="beneficios-titulo">
          Por que a City&nbsp;Toys é <span class="titulo-destaque">diferente</span>?
        </h2>
        <p class="subtitulo-beneficios">{{ subtitulo }}</p>
      </header>

      <ul class="numeros" data-reveal aria-label="A City Toys em números">
        <li v-for="n in numeros" :key="n.id" class="numero">
          <span class="numero-valor" :class="{ 'numero-valor--destaque': n.destaque }">
            {{ n.valor }}
            <span v-if="n.estrela" class="numero-estrela" aria-hidden="true">
              <SvgIcone nome="estrela" />
            </span>
          </span>
          <span class="numero-rotulo">{{ n.rotulo }}</span>
        </li>
      </ul>

      <ul class="lista-beneficios">
        <li
          v-for="(b, i) in beneficios"
          :key="b.id"
          class="item-beneficio"
          :style="{ '--atraso': `${i * 120}ms` }"
          data-reveal
        >
          <article class="card-beneficio" :class="`card-beneficio--${b.cor}`">
            <span class="icone-beneficio" aria-hidden="true">
              <img :src="b.icone" alt="" width="26" height="26" />
            </span>
            <h3 class="card-titulo">{{ b.titulo }}</h3>
            <p class="card-texto">{{ b.texto }}</p>
          </article>
        </li>
      </ul>
    </div>

    <!-- A noite desce em arco sobre o fundo neve dos Depoimentos. -->
    <svg class="curva curva--base" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 0C480 80 960 80 1440 0V80H0V0Z" />
    </svg>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

const { temaAtivo } = useTemaSazonal()

const secEl = ref<HTMLElement | null>(null)

const subtitulo = computed(() =>
  temaAtivo.value
    ? 'Os números falam por nós. E a sua festa de fim de ano fica tranquila do começo ao fim.'
    : 'Os números falam por nós. E a sua festa fica tranquila do começo ao fim.'
)

type Numero = { id: string; valor: string; rotulo: string; destaque?: boolean; estrela?: boolean }

// "21" = total de brinquedos do catálogo (array em SectionBrinquedo.vue).
// Ao incluir ou tirar brinquedo de lá, atualize aqui também.
const numeros: Numero[] = [
  { id: 'festas', valor: '+3 mil', rotulo: 'festas realizadas', destaque: true },
  { id: 'nota', valor: '5', rotulo: 'nota média dos pais', estrela: true },
  { id: 'brinquedos', valor: '21', rotulo: 'brinquedos para alugar' },
  { id: 'cobertura', valor: 'Todo o RJ', rotulo: 'entrega e montagem' }
]

type Beneficio = { id: string; titulo: string; texto: string; icone: string; cor: 'vermelho' | 'verde' | 'amarelo' }

const beneficios: Beneficio[] = [
  {
    id: 'higienizacao',
    titulo: 'Higienização Total',
    texto: 'Tudo lavado e desinfetado após cada festa. Zero sujeira, zero preocupação.',
    icone: '/images/natal/beneficios-icone-gota.svg',
    cor: 'vermelho'
  },
  {
    id: 'seguranca',
    titulo: 'Segurança Garantida',
    texto: 'Brinquedos revisados antes de cada festa, para a criançada brincar tranquila.',
    icone: '/images/natal/beneficios-icone-escudo.svg',
    cor: 'verde'
  },
  {
    id: 'suporte',
    titulo: 'Suporte de verdade',
    texto: 'Precisou? Você chama no WhatsApp e a gente resolve rápido.',
    icone: '/images/natal/beneficios-icone-fone.svg',
    cor: 'amarelo'
  }
]

// Flocos e brilhos do fundo (só no Natal). Posições do Figma num quadro de
// 1440px: esquerda em % da largura; topo (ou base) em px. Os marcados
// soDesktop somem no celular, onde a seção fica bem mais alta.
type Enfeite = {
  id: string
  tipo: 'neve' | 'brilho'
  esquerda: number
  topo?: number
  base?: number
  tamanho: number
  opacidade: number
  soDesktop?: boolean
}

const enfeites: Enfeite[] = [
  { id: 'neve-1', tipo: 'neve', esquerda: 4.17, topo: 130, tamanho: 38, opacidade: 0.2 },
  { id: 'neve-2', tipo: 'neve', esquerda: 90.97, topo: 110, tamanho: 54, opacidade: 0.16 },
  { id: 'brilho-1', tipo: 'brilho', esquerda: 81.94, topo: 250, tamanho: 22, opacidade: 0.8, soDesktop: true },
  { id: 'brilho-2', tipo: 'brilho', esquerda: 13.89, topo: 300, tamanho: 18, opacidade: 0.7, soDesktop: true },
  { id: 'neve-3', tipo: 'neve', esquerda: 94.44, topo: 520, tamanho: 30, opacidade: 0.18, soDesktop: true },
  { id: 'neve-4', tipo: 'neve', esquerda: 2.78, base: 170, tamanho: 46, opacidade: 0.14 },
  { id: 'brilho-3', tipo: 'brilho', esquerda: 48.61, topo: 110, tamanho: 12, opacidade: 0.6, soDesktop: true },
  { id: 'brilho-4', tipo: 'brilho', esquerda: 89.58, base: 140, tamanho: 16, opacidade: 0.7 }
]

function estiloEnfeite(e: Enfeite, i: number) {
  return {
    left: `${e.esquerda}%`,
    top: e.topo != null ? `${e.topo}px` : undefined,
    bottom: e.base != null ? `${e.base}px` : undefined,
    opacity: e.opacidade,
    '--atraso': `${i * -0.7}s`
  }
}

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
$noite-meio: #1a2f8a
$noite-base: #102766
$amarelo-escuro: #e0a100
$estrela-nota: #ffc531

.secao-beneficios
  position: relative
  overflow: hidden
  padding: 160px 0 170px
  background: linear-gradient(180deg, var(--cor-noite) 0%, $noite-meio 50%, $noite-base 100%)
  color: var(--cor-branco)
  font-family: var(--fonte)

.container
  position: relative
  z-index: 2
  display: flex
  flex-direction: column
  align-items: center
  gap: 22px
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

/* ---- curvas ---- */
.curva
  position: absolute
  left: 0
  z-index: 1
  display: block
  width: 100%
  height: 80px
  pointer-events: none

.curva--topo
  top: 0

  path
    fill: var(--cor-gelo)

.curva--base
  bottom: 0

  path
    fill: var(--cor-neve)

/* ---- flocos e brilhos (tema) ---- */
.enfeite
  position: absolute
  z-index: 0
  display: block
  height: auto
  pointer-events: none

.enfeite--brilho
  animation: brilho-piscar 2.8s ease-in-out infinite
  animation-delay: var(--atraso, 0s)

@keyframes brilho-piscar
  0%, 100%
    transform: scale(1)
  50%
    transform: scale(.7)

/* ---- cabeçalho ---- */
.cabecalho-beneficios
  display: flex
  flex-direction: column
  align-items: center
  gap: 22px
  text-align: center

.olho-beneficios
  display: inline-flex
  align-items: center
  gap: 10px
  margin: 0
  color: var(--cor-dourado)
  font-size: 13.5px
  font-weight: 900
  letter-spacing: .12em
  text-transform: uppercase

.olho-brilho
  display: block
  width: 12px
  height: 12px

.titulo-beneficios
  margin: 0
  color: var(--cor-branco)
  font-size: clamp(1.75rem, 1.1rem + 2.2vw, 2.75rem)
  font-weight: 900
  line-height: 1.2
  text-wrap: balance

.titulo-destaque
  color: var(--cor-dourado)

.subtitulo-beneficios
  max-width: 720px
  margin: 0
  color: rgba(255, 255, 255, .85)
  font-size: clamp(1rem, .9rem + .3vw, 1.0625rem)
  line-height: 1.45

/* ---- faixa de números ---- */
.numeros
  display: grid
  grid-template-columns: repeat(4, minmax(0, 1fr))
  align-items: center
  width: 100%
  margin: 0
  padding: 34px 0
  list-style: none
  border: 1px solid rgba(255, 255, 255, .14)
  border-radius: 28px
  background: rgba(255, 255, 255, .07)
  backdrop-filter: blur(10px)
  -webkit-backdrop-filter: blur(10px)

.numero
  position: relative
  display: flex
  flex-direction: column
  align-items: center
  gap: 4px
  padding: 0 12px
  text-align: center

  /* divisória vertical (70px) entre um número e outro */
  & + .numero::before
    content: ""
    position: absolute
    top: 50%
    left: 0
    width: 1px
    height: 70px
    background: rgba(255, 255, 255, .16)
    transform: translateY(-50%)

.numero-valor
  display: inline-flex
  align-items: center
  gap: 8px
  color: var(--cor-branco)
  font-size: clamp(2rem, 1.2rem + 1.9vw, 2.875rem)
  font-weight: 900
  line-height: 1.2
  white-space: nowrap

.numero-valor--destaque
  color: var(--cor-dourado)

/* sem :tamanho o ícone mede 1em: acompanha o número em qualquer tela
   (26px de estrela para 46px de número, como no Figma) */
.numero-estrela
  display: inline-flex
  color: $estrela-nota
  font-size: .56em

.numero-rotulo
  color: rgba(255, 255, 255, .8)
  font-size: 15.5px
  font-weight: 600
  line-height: 1.35

/* ---- cards de benefício ---- */
.lista-beneficios
  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 25px
  width: 100%
  margin: 0
  padding: 16px 0 0
  list-style: none

.item-beneficio
  display: flex

.card-beneficio
  display: flex
  flex: 1
  flex-direction: column
  align-items: center
  gap: 12px
  padding: 32px 28px
  border: 1px solid rgba(255, 255, 255, .16)
  border-radius: 24px
  background: rgba(255, 255, 255, .08)
  backdrop-filter: blur(10px)
  -webkit-backdrop-filter: blur(10px)
  text-align: center
  transition: background .28s ease, border-color .28s ease

.icone-beneficio
  display: grid
  place-items: center
  width: 60px
  height: 60px
  border-radius: 50%
  background: linear-gradient(180deg, #ff7a7a, var(--cor-vermelho))
  box-shadow: 0 8px 18px rgba(0, 0, 0, .25)

  img
    display: block
    width: 26px
    height: 26px

.card-beneficio--verde .icone-beneficio
  background: linear-gradient(180deg, #5ee59a, var(--cor-verde-acao))

.card-beneficio--amarelo .icone-beneficio
  background: linear-gradient(180deg, #ffe27a, $amarelo-escuro)

.card-titulo
  margin: 0
  color: var(--cor-branco)
  font-size: 20px
  font-weight: 900
  line-height: 1.3

.card-texto
  margin: 0
  color: rgba(255, 255, 255, .82)
  font-size: 15.5px
  line-height: 1.5
  text-wrap: pretty

// hover do projeto: só o fundo muda, sem deslocar o card
@media (hover: hover)
  .card-beneficio:hover
    border-color: rgba(255, 255, 255, .28)
    background: rgba(255, 255, 255, .14)

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
  .secao-beneficios
    padding: 112px 0 124px

  .curva
    height: 48px

  /* números em 2x2: divisória vertical só no meio, horizontal entre linhas */
  .numeros
    grid-template-columns: repeat(2, minmax(0, 1fr))
    row-gap: 32px
    padding: 28px 0

  .numero:nth-child(3)::before
    display: none

  .numero:nth-child(n + 3)::after
    content: ""
    position: absolute
    top: -16px
    left: 0
    right: 0
    height: 1px
    background: rgba(255, 255, 255, .16)

@media (max-width: 768px)
  .lista-beneficios
    grid-template-columns: minmax(0, 1fr)
    gap: 16px
    max-width: 520px

  .enfeite--desktop
    display: none

@media (max-width: 520px)
  .secao-beneficios
    padding: 88px 0 100px

  /* flocos menores e mais pra borda: no celular o título ocupa a largura toda */
  .enfeite--neve
    transform: scale(.6)
    transform-origin: center

  .curva
    height: 32px

  .container
    gap: 18px

  .cabecalho-beneficios
    gap: 16px

  .numeros
    padding: 22px 0
    border-radius: 22px

  .numero
    padding: 0 8px

  .numero-valor
    gap: 6px
    font-size: 1.625rem

  .numero-rotulo
    font-size: 13.5px

  .card-beneficio
    padding: 26px 20px

  .card-titulo
    font-size: 18px

  .card-texto
    font-size: 15px

@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    transform: none !important
    transition: none !important

  .enfeite--brilho
    animation: none

  .card-beneficio,
  .icone-beneficio
    transition: none
</style>
