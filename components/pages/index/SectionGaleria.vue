<!-- components/pages/index/SectionGaleria.vue -->
<template>
  <section id="festas" ref="secEl" class="secao-festas" aria-labelledby="festas-titulo">
    <div class="container">
      <header class="cabecalho" data-reveal>
        <p class="olho">
          <SvgIcone nome="instagram" :tamanho="15" />
          <span>@city_toysbrinquedos</span>
        </p>

        <h2 id="festas-titulo" class="titulo">
          Festas que <span class="destaque">já fizemos</span>
        </h2>

        <p class="subtitulo">
          Um pouco da diversão que levamos para as festas do Rio. Tem muito mais no nosso Instagram.
        </p>
      </header>

      <!-- A 1ª foto é a grande da esquerda; as outras 4 formam o 2x2 da direita.
           As fotos podem ter qualquer proporção: o recorte é feito com object-fit. -->
      <ul class="grade-fotos" data-reveal>
        <li
          v-for="(foto, i) in fotosFestas"
          :key="foto.src"
          class="foto"
          :class="{ 'foto--destaque': i === 0 }"
        >
          <img
            :src="foto.src"
            :alt="foto.alt"
            :width="foto.largura"
            :height="foto.altura"
            loading="lazy"
            decoding="async"
          />
          <span v-if="foto.legenda" class="legenda">
            <SvgIcone nome="localizacao" :tamanho="15" />
            {{ foto.legenda }}
          </span>
        </li>
      </ul>

      <div class="cta" data-reveal>
        <a class="botao-instagram" :href="INSTAGRAM_URL" target="_blank" rel="noopener noreferrer">
          <SvgIcone nome="instagram" :tamanho="18" />
          <span>Ver mais no Instagram</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { INSTAGRAM_URL } from '~/helpers/seo.js'

type FotoFesta = {
  src: string
  alt: string
  largura: number
  altura: number
  legenda?: string
}

// Fotos de festas reais do Instagram da City Toys. Pra trocar, é só mexer aqui:
// a 1ª vira a foto grande (com a legenda), as 4 seguintes vão pro 2x2.
const fotosFestas: FotoFesta[] = [
  {
    src: '/images/festas/festa-futebol-sabao-gramado.webp',
    alt: 'Futebol de Sabão inflável montado em gramado com coqueiros numa festa da City Toys',
    largura: 1100,
    altura: 999,
    legenda: 'Futebol de Sabão'
  },
  {
    src: '/images/festas/festa-futebol-sabao-criancas.webp',
    alt: 'Crianças brincando no Futebol de Sabão inflável da City Toys',
    largura: 769,
    altura: 703
  },
  {
    src: '/images/festas/festa-toboga-gigante.webp',
    alt: 'Tobogã inflável gigante montado em festa ao ar livre',
    largura: 769,
    altura: 703
  },
  {
    src: '/images/festas/festa-salao-de-festas.webp',
    alt: 'Brinquedo inflável com escorregador montado em salão de festas',
    largura: 769,
    altura: 703
  },
  {
    src: '/images/festas/festa-brinquedos-gramado.webp',
    alt: 'Tobogã gigante e Futebol de Sabão infláveis montados em gramado',
    largura: 769,
    altura: 703
  }
]

/* ---- revelar no scroll (padrão do projeto) ---- */

const secEl = ref<HTMLElement | null>(null)
let io: IntersectionObserver | null = null

function reduceMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function observeReveals() {
  const root = secEl.value
  if (!root) return
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
    (el) => !el.classList.contains('is-inview')
  )
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
.secao-festas
  padding: 110px 0 60px
  background: var(--cor-branco)
  color: var(--cor-navy)
  font-family: var(--fonte)
  scroll-margin-top: calc(var(--menu-h, 76px) + 10px)

.container
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

/* ---- cabeçalho ---- */
.cabecalho
  display: flex
  flex-direction: column
  align-items: center
  gap: 14px
  text-align: center

.olho
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0
  color: var(--cor-vermelho)
  font-size: .8125rem
  font-weight: 900
  letter-spacing: 1.3px
  text-transform: uppercase

.titulo
  margin: 0
  color: var(--cor-navy)
  font-size: clamp(1.9rem, 4vw, 2.75rem)
  font-weight: 900
  line-height: 1.15

.destaque
  color: var(--cor-vermelho)

.subtitulo
  margin: 0
  color: var(--cor-texto-suave)
  font-size: clamp(1rem, 1.4vw, 1.0625rem)
  line-height: 1.5

/* ---- grade de fotos: 1 grande + 2x2 ---- */
.grade-fotos
  --altura-linha: clamp(190px, 21.1vw, 270px)
  display: grid
  grid-template-columns: minmax(0, 630fr) minmax(0, 305fr) minmax(0, 305fr)
  grid-template-rows: repeat(2, var(--altura-linha))
  gap: 20px
  margin: 42px 0 0
  padding: 0
  list-style: none

.foto
  position: relative
  overflow: hidden
  isolation: isolate
  border-radius: 22px
  background: var(--cor-gelo)
  box-shadow: 0 10px 24px rgba(18, 48, 98, .08)

  // A foto sangra 2px pra fora da moldura: fotos exportadas do Instagram às
  // vezes vêm com 1px de borda escura, que assim fica escondida pelo recorte
  // arredondado da moldura (overflow hidden + border-radius).
  img
    position: absolute
    top: -2px
    left: -2px
    display: block
    width: calc(100% + 4px)
    height: calc(100% + 4px)
    max-width: none
    object-fit: cover

.foto--destaque
  grid-row: span 2

.legenda
  position: absolute
  left: 18px
  bottom: 21px
  z-index: 1
  display: inline-flex
  align-items: center
  gap: 8px
  max-width: calc(100% - 36px)
  padding: 8px 14px
  border-radius: 999px
  background: rgba(255, 255, 255, .92)
  color: var(--cor-navy)
  font-size: .875rem
  font-weight: 900

  :deep(.edusites-icone)
    flex: none
    color: var(--cor-vermelho)

/* ---- botão ---- */
.cta
  display: flex
  justify-content: center
  margin-top: 38px

.botao-instagram
  display: inline-flex
  align-items: center
  gap: 10px
  padding: 14px 26px
  border: 1.6px solid var(--cor-navy)
  border-radius: 999px
  background: transparent
  color: var(--cor-navy)
  font-size: 1rem
  font-weight: 900
  text-decoration: none
  transition: background .2s ease, color .2s ease

  :deep(.edusites-icone)
    flex: none

  &:hover
    background: var(--cor-navy)
    color: var(--cor-branco)

  &:focus-visible
    outline: 3px solid rgba(5, 42, 84, .35)
    outline-offset: 3px

/* ---- revelar no scroll ---- */
[data-reveal]
  opacity: 0
  transform: translateY(18px)
  transition: opacity .6s ease, transform .6s cubic-bezier(.2, .8, .2, 1)

.is-inview[data-reveal]
  opacity: 1
  transform: none

/* ---- telas menores ---- */
@media (max-width: 980px)
  .secao-festas
    padding: 84px 0 48px

  .grade-fotos
    gap: 14px

// Celular/tablet: foto grande ocupando a largura toda, as outras em 2 colunas.
@media (max-width: 768px)
  .grade-fotos
    grid-template-columns: repeat(2, minmax(0, 1fr))
    grid-template-rows: none
    gap: 12px
    margin-top: 30px

  .foto
    height: clamp(130px, 38vw, 240px)
    border-radius: 18px

  .foto--destaque
    grid-column: 1 / -1
    grid-row: auto
    height: clamp(220px, 64vw, 420px)

  .legenda
    left: 12px
    bottom: 12px
    max-width: calc(100% - 24px)

  .cta
    margin-top: 28px

@media (max-width: 480px)
  .secao-festas
    padding: 64px 0 36px

  .botao-instagram
    justify-content: center
    width: 100%

/* ---- menos movimento ---- */
@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    transform: none !important
    transition: none !important

  .botao-instagram
    transition: none
</style>
