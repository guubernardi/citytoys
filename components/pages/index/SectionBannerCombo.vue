<template>
  <section
    ref="secEl"
    class="secao-combo"
    :class="{ 'secao-combo--tema': temaAtivo }"
    id="combo-promocional"
    aria-labelledby="combo-titulo"
  >
    <div class="container">
      <div class="banner-combo" data-reveal>
        <!-- Camada de enfeites recortada no formato do banner (o brilho dourado não
             vaza pra fora). A imagem da direita fica fora dela pra poder "saltar"
             por cima da borda de cima. -->
        <div class="banner-combo__decor" aria-hidden="true">
          <span class="banner-combo__brilho"></span>

          <template v-if="temaAtivo">
            <img class="enfeite enfeite--neve-1" src="/images/natal/banner-combo-neve.svg" alt="" width="26" height="26" />
            <img class="enfeite enfeite--neve-2" src="/images/natal/banner-combo-neve.svg" alt="" width="26" height="26" />
            <img class="enfeite enfeite--brilho-1" src="/images/natal/banner-combo-brilho.svg" alt="" width="14" height="14" />
            <img class="enfeite enfeite--brilho-2" src="/images/natal/banner-combo-brilho.svg" alt="" width="14" height="14" />
            <img class="enfeite enfeite--brilho-3" src="/images/natal/banner-combo-brilho.svg" alt="" width="14" height="14" />
          </template>
        </div>

        <div class="banner-combo__texto">
          <span class="selo-combo" id="combo-selo">
            <SvgIcone nome="presente" :tamanho="15" />
            Promoção de segunda a quinta
          </span>

          <h2 class="titulo-combo" id="combo-titulo">
            3 brinquedos por
            <span class="titulo-combo__preco">R$ 1.500</span>
          </h2>

          <p class="texto-combo" id="combo-texto">{{ textoCombo }}</p>

          <ul class="categorias-combo" aria-label="Como montar o combo">
            <li v-for="(c, i) in categorias" :key="c.id">
              <span class="categorias-combo__numero" :class="`categorias-combo__numero--${c.id}`" aria-hidden="true">{{ i + 1 }}</span>
              {{ c.rotulo }}
            </li>
          </ul>

          <div class="acoes-combo">
            <NuxtLink class="botao-combo" id="combo-cta" to="/montar-combo">
              <SvgIcone nome="foguete" :tamanho="19" />
              Montar meu combo
            </NuxtLink>
            <p class="nota-combo">Válido para festas de segunda a quinta</p>
          </div>
        </div>

        <img
          class="banner-combo__imagem"
          :class="{ 'banner-combo__imagem--padrao': !temaAtivo }"
          :src="imagem.src"
          :alt="imagem.alt"
          :width="imagem.largura"
          :height="imagem.altura"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

// Banner da promoção do combo (1 Grande + 1 Médio + 1 Pequeno por preço fixo,
// de segunda a quinta). O layout vale o ano todo; no Natal entram a pilha de
// presentes, os flocos e brilhos e a frase de "festa de fim de ano". Fora da
// campanha a imagem vira o foguete da marca.
const { temaAtivo } = useTemaSazonal()

const secEl = ref<HTMLElement | null>(null)

const categorias = [
  { id: 'grande', rotulo: 'Grande' },
  { id: 'medio', rotulo: 'Médio' },
  { id: 'pequeno', rotulo: 'Pequeno' }
]

const textoCombo = computed(() =>
  temaAtivo.value
    ? 'Escolha 1 Grande, 1 Médio e 1 Pequeno e monte o combo da sua festa de fim de ano. Preço fixo, sem surpresa.'
    : 'Escolha 1 Grande, 1 Médio e 1 Pequeno e monte o combo da sua festa. Preço fixo, sem surpresa.'
)

const imagem = computed(() =>
  temaAtivo.value
    ? {
        src: '/images/natal/banner-combo-presentes.webp',
        alt: 'Pilha de presentes de Natal com um castelo inflável saindo da caixa',
        largura: 544,
        altura: 885
      }
    : {
        src: '/images/natal/banner-combo-foguete.webp',
        alt: 'Foguete da City Toys',
        largura: 597,
        altura: 900
      }
)

// Revelação no scroll (mesmo padrão das outras seções).
let io: IntersectionObserver | null = null

function reduzirMovimento() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function observarRevelacoes() {
  const raiz = secEl.value
  if (!raiz) return

  const els = Array.from(raiz.querySelectorAll<HTMLElement>('[data-reveal]')).filter(
    (el) => !el.classList.contains('is-inview')
  )
  if (!els.length) return

  if (reduzirMovimento() || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('is-inview'))
    return
  }

  if (!io) {
    io = new IntersectionObserver(
      (entradas) =>
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return
          entrada.target.classList.add('is-inview')
          io?.unobserve(entrada.target)
        }),
      { threshold: 0.12, rootMargin: '0px 0px 160px 0px' }
    )
  }

  els.forEach((el) => io!.observe(el))
}

onMounted(async () => {
  await nextTick()
  observarRevelacoes()
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<style lang="sass" scoped>
// Tons da arte que não estão nos tokens globais.
$azul-banner: #1a2f8a
$vermelho-claro: #e5343a
$azul-acao: #2b74eb

/* z-index acima da seção de brinquedos (que é z-index 5 com fundo branco): a
   pilha de presentes sobe 90px acima do banner e entra no respiro de baixo
   daquela seção. Sem isso o fundo dela cobre o topo da imagem e deixa um corte reto. */
.secao-combo
  position: relative
  z-index: 6
  padding: 30px 0 120px
  background: #ffffff
  font-family: var(--fonte)

.container
  max-width: calc(1280px + 2 * var(--container-px))
  margin: 0 auto
  padding: 0 var(--container-px)

/* ---- banner ---- */
.banner-combo
  position: relative
  display: flex
  align-items: flex-start
  padding: 56px 64px
  border-radius: 32px
  background: linear-gradient(90deg, var(--cor-noite), $azul-banner)
  filter: drop-shadow(0 24px 25px rgba(10,26,79,.28))

.banner-combo__decor
  position: absolute
  inset: 0
  overflow: hidden
  border-radius: inherit
  pointer-events: none

/* luz dourada atrás da imagem da direita */
.banner-combo__brilho
  position: absolute
  left: 59.4%
  top: -60px
  width: 620px
  height: 520px
  background: radial-gradient(closest-side, rgba(255,210,63,.22), rgba(255,210,63,0))

.enfeite
  position: absolute
  display: block

.enfeite--neve-1
  left: 40px
  top: 30px
  width: 26px
  height: 26px

.enfeite--neve-2
  left: 54.7%
  top: 330px
  width: 22px
  height: 22px

.enfeite--brilho-1
  left: 46.9%
  top: 40px
  width: 14px
  height: 14px

.enfeite--brilho-2
  left: 93.75%
  top: 330px
  width: 16px
  height: 16px

.enfeite--brilho-3
  left: 43.75%
  top: 300px
  width: 10px
  height: 10px
  opacity: .86

/* ---- texto ---- */
.banner-combo__texto
  position: relative
  z-index: 1
  display: flex
  flex-direction: column
  align-items: flex-start
  gap: 18px
  width: min(660px, 58%)

.selo-combo
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 7px 14px
  border-radius: 999px
  background: var(--cor-dourado)
  color: var(--cor-navy)
  font-weight: 900
  font-size: 12.5px
  line-height: 1.36
  letter-spacing: .06em
  text-transform: uppercase

.titulo-combo
  margin: 0
  color: #ffffff
  font-weight: 900
  font-size: clamp(34px, 3.75vw, 54px)
  line-height: 1.04

.titulo-combo__preco
  display: block
  color: var(--cor-dourado)

.texto-combo
  margin: 0
  color: rgba(255,255,255,.86)
  font-weight: 600
  font-size: 17px
  line-height: 1.5

.categorias-combo
  display: flex
  flex-wrap: wrap
  gap: 10px
  margin: 0
  padding: 0
  list-style: none

  li
    display: inline-flex
    align-items: center
    gap: 8px
    padding: 6px 14px 6px 6px
    border: 1px solid rgba(255,255,255,.16)
    border-radius: 999px
    background: rgba(255,255,255,.1)
    color: #ffffff
    font-weight: 900
    font-size: 15px
    line-height: 1.36

.categorias-combo__numero
  display: inline-flex
  align-items: center
  justify-content: center
  width: 26px
  height: 26px
  border-radius: 50%
  color: #ffffff
  font-size: 13px

.categorias-combo__numero--grande
  background: $vermelho-claro

.categorias-combo__numero--medio
  background: var(--cor-verde-acao)

.categorias-combo__numero--pequeno
  background: var(--cor-laranja)
  color: var(--cor-navy)

.acoes-combo
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 16px
  padding-top: 6px

.botao-combo
  display: inline-flex
  align-items: center
  gap: 10px
  padding: 17px 30px
  border-radius: 999px
  background: var(--cor-dourado)
  color: var(--cor-navy)
  font-weight: 800
  font-size: 18px
  line-height: 1.4
  text-decoration: none
  box-shadow: 0 10px 24px rgba(122,90,0,.3)
  transition: background .25s ease, color .25s ease

  /* hover só troca a cor, como o "Monte seu Combo" do menu */
  &:hover
    background: $azul-acao
    color: #ffffff

  &:focus-visible
    outline: 3px solid #ffffff
    outline-offset: 3px

.nota-combo
  margin: 0
  color: rgba(255,255,255,.7)
  font-weight: 700
  font-size: 14.5px

/* ---- imagem da direita (passa por cima da borda de cima) ---- */
.banner-combo__imagem
  position: absolute
  right: 90px
  top: -90px
  z-index: 1
  width: 289px
  height: 470px
  object-fit: contain
  pointer-events: none

/* o foguete (fora da campanha) não tem a nuvem de confete: fica um pouco menor
   e centrado na altura do banner */
.banner-combo__imagem--padrao
  top: -40px
  height: 420px

/* ---- revelação no scroll ---- */
[data-reveal]
  opacity: 0
  transform: translateY(24px)
  transition: opacity .6s ease, transform .6s ease

.is-inview[data-reveal]
  opacity: 1
  transform: none

@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    transform: none !important
    transition: none !important

/* ---- responsivo ---- */
@media (max-width: 1100px)
  .banner-combo__imagem
    right: 48px
    width: 250px
    height: 406px
    top: -70px

  .banner-combo__imagem--padrao
    top: -30px
    height: 370px

@media (max-width: 980px)
  .banner-combo
    padding: 44px 40px

  .banner-combo__texto
    width: min(560px, 62%)

  .banner-combo__imagem
    right: 24px
    width: 210px
    height: 342px
    top: -56px

  .banner-combo__imagem--padrao
    top: -20px
    height: 310px

/* No celular a imagem sobe pro topo, centrada, saltando pra fora do banner,
   e o texto vem embaixo ocupando a largura toda. */
@media (max-width: 768px)
  .secao-combo
    padding: 90px 0 80px

  .banner-combo
    flex-direction: column
    align-items: center
    padding: 0 28px 36px
    border-radius: 28px
    text-align: center

  .banner-combo__imagem,
  .banner-combo__imagem--padrao
    position: relative
    order: -1
    right: auto
    top: auto
    width: auto
    height: 230px
    margin: -80px auto 12px

  .banner-combo__texto
    width: 100%
    align-items: center

  .categorias-combo,
  .acoes-combo
    justify-content: center

  .banner-combo__brilho
    left: 50%
    top: -200px
    transform: translateX(-50%)

  /* empilhado, os enfeites do meio cairiam em cima do texto: ficam só os dos cantos */
  .enfeite--neve-2,
  .enfeite--brilho-2,
  .enfeite--brilho-3
    display: none

  .enfeite--brilho-1
    left: auto
    right: 28px
    top: 28px

@media (max-width: 520px)
  .banner-combo
    padding: 0 20px 30px

  .selo-combo
    font-size: 11px
    letter-spacing: .04em

  .titulo-combo
    font-size: 32px

  .texto-combo
    font-size: 15.5px

  .acoes-combo
    flex-direction: column
    gap: 12px

  .botao-combo
    width: 100%
    justify-content: center
    padding: 16px 24px
    font-size: 17px

  .nota-combo
    font-size: 13.5px
</style>
