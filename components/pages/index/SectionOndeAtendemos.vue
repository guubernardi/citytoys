<!-- components/pages/index/SectionOndeAtendemos.vue -->
<template>
  <section
    id="onde-atendemos"
    ref="secEl"
    class="secao-onde-atendemos"
    aria-labelledby="onde-atendemos-titulo"
  >
    <div class="container">
      <div class="cartao-bairros">
        <div class="texto" data-reveal>
          <p class="olho">
            <SvgIcone nome="localizacao" :tamanho="15" />
            <span>Onde atendemos</span>
          </p>

          <h2 id="onde-atendemos-titulo" class="titulo">
            Levamos a festa até o<br class="quebra-desktop" /> seu bairro
          </h2>

          <p class="descricao">
            Atendemos o Rio de Janeiro e regiões próximas. Alguns bairros onde a City Toys já fez festa:
          </p>

          <ul class="bairros">
            <li v-for="b in bairros" :key="b.nome" class="bairro">
              <img
                src="/images/icone-pino-vermelho.svg"
                width="14"
                height="14"
                alt=""
                loading="lazy"
                decoding="async"
              />
              {{ b.nome }}
            </li>
            <li class="bairro bairro--mais">e regiões próximas</li>
          </ul>

          <a
            class="botao-whats"
            :href="linkWhatsBairro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SvgIcone nome="whatsapp" :tamanho="20" />
            <span>Confirmar meu bairro no WhatsApp</span>
          </a>
        </div>

        <!-- Mapa ilustrativo: as posições dos pinos e rótulos vêm do Figma
             (cartão de 520px) e estão em % do palco, então escalam juntas. -->
        <div class="mapa-cartao" data-reveal>
          <p class="selo-rj">
            <img
              src="/images/icone-brilho-dourado.svg"
              width="14"
              height="14"
              alt=""
              loading="lazy"
              decoding="async"
            />
            Rio de Janeiro e regiões próximas
          </p>

          <div class="mapa-palco" role="img" :aria-label="descricaoMapa">
            <img
              class="mapa-palco__mapa"
              src="/images/mapa-rio-bairros.svg"
              width="459"
              height="246"
              alt=""
              loading="lazy"
              decoding="async"
            />

            <img
              v-for="b in bairros"
              :key="`pino-${b.nome}`"
              class="mapa-palco__pino"
              src="/images/mapa-pino.svg"
              width="23"
              height="23"
              alt=""
              loading="lazy"
              decoding="async"
              :style="{ left: `${b.pino.x}%`, top: `${b.pino.y}%` }"
            />

            <span
              v-for="b in bairros"
              :key="`rotulo-${b.nome}`"
              class="mapa-palco__rotulo"
              aria-hidden="true"
              :style="{ left: `${b.rotulo.x}%`, top: `${b.rotulo.y}%` }"
            >
              {{ b.nome }}
            </span>
          </div>

          <ul class="mapa-legenda">
            <li>
              <span class="mapa-legenda__cor mapa-legenda__cor--festa" aria-hidden="true"></span>
              Bairros onde já fizemos festa
            </li>
            <li>
              <span class="mapa-legenda__cor mapa-legenda__cor--outros" aria-hidden="true"></span>
              Outros bairros: confirme no WhatsApp
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { WHATS_NUMERO } from '~/helpers/seo.js'

type Ponto = { x: number; y: number }
type Bairro = { nome: string; pino: Ponto; rotulo: Ponto }

// Bairros dos depoimentos (mesma lista do BAIRROS_ATENDIDOS em helpers/seo.js,
// na ordem dos chips do Figma). pino/rotulo = canto superior esquerdo, em % do
// palco do mapa (520 x 245,7 no Figma).
const bairros: Bairro[] = [
  { nome: 'Barra da Tijuca', pino: { x: 54.133, y: 70.208 }, rotulo: { x: 46.346, y: 78.144 } },
  { nome: 'Recreio dos Bandeirantes', pino: { x: 40.738, y: 74.652 }, rotulo: { x: 10.192, y: 73.667 } },
  { nome: 'Tijuca', pino: { x: 70.596, y: 51.376 }, rotulo: { x: 67.885, y: 41.514 } },
  { nome: 'Botafogo', pino: { x: 77.085, y: 56.817 }, rotulo: { x: 81.154, y: 49.247 } },
  { nome: 'Copacabana', pino: { x: 76.923, y: 62.003 }, rotulo: { x: 81.154, y: 66.748 } },
  { nome: 'Jacarepaguá', pino: { x: 47.577, y: 52.601 }, rotulo: { x: 41.346, y: 42.735 } }
]

const descricaoMapa = `Mapa do Rio de Janeiro com os bairros onde a City Toys já fez festa: ${bairros
  .map((b) => b.nome)
  .join(', ')}.`

const msgBairro =
  'Olá! Vim pelo site da City Toys 😊\n' +
  'Quero confirmar se vocês atendem o meu bairro.\n\n' +
  'Bairro: ____'
const linkWhatsBairro = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(msgBairro)}`

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
$mapa-festa: #f26d72
$mapa-outros: #dde8fb
$chip-tracejado: #97a6bb
$chip-tracejado-texto: #5c6b86
$verde-whats-hover: #116a32

.secao-onde-atendemos
  padding: 50px 0 110px
  background: var(--cor-branco)
  color: var(--cor-navy-2)
  font-family: var(--fonte)
  scroll-margin-top: calc(var(--menu-h, 76px) + 10px)

.container
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

.cartao-bairros
  display: flex
  align-items: center
  gap: 56px
  padding: 52px 52px 52px 56px
  border-radius: 32px
  background: var(--cor-gelo)

/* ---- texto ---- */
.texto
  flex: 1 1 0
  min-width: 0
  display: flex
  flex-direction: column
  align-items: flex-start
  gap: 16px

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
  font-size: clamp(1.75rem, 3vw, 2.5rem)
  font-weight: 900
  line-height: 1.1

.descricao
  margin: 0
  color: var(--cor-navy-2)
  font-size: clamp(1rem, 1.4vw, 1.0625rem)
  line-height: 1.5

.bairros
  display: flex
  flex-wrap: wrap
  gap: 10px
  margin: 0
  padding: 0
  list-style: none

.bairro
  display: inline-flex
  align-items: center
  gap: 6px
  padding: 9px 14px
  border: 1px solid var(--cor-borda)
  border-radius: 999px
  background: var(--cor-branco)
  color: var(--cor-navy-2)
  font-size: .90625rem
  font-weight: 700
  line-height: 1.2

  img
    flex: none
    display: block

.bairro--mais
  border: 1.2px dashed $chip-tracejado
  background: transparent
  color: $chip-tracejado-texto

.botao-whats
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  margin-top: 18px
  padding: 15px 28px
  border-radius: 999px
  background: var(--cor-verde-acao)
  color: var(--cor-branco)
  font-size: 1.0625rem
  font-weight: 900
  text-align: center
  text-decoration: none
  filter: drop-shadow(0 8px 10px rgba(21, 128, 61, .22))
  transition: background .2s ease

  :deep(.edusites-icone)
    flex: none

  span
    text-wrap: balance

  &:hover
    background: $verde-whats-hover

  &:focus-visible
    outline: 3px solid rgba(21, 128, 61, .45)
    outline-offset: 3px

/* ---- mapa ---- */
.mapa-cartao
  flex: 0 0 520px
  display: flex
  flex-direction: column
  min-width: 0
  padding: 20px 0 18px
  overflow: hidden
  border-radius: 24px
  background: var(--cor-branco)
  box-shadow: 0 16px 36px rgba(18, 48, 98, .14)

.selo-rj
  align-self: flex-start
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0 20px
  padding: 10px 16px
  border-radius: 999px
  background: var(--cor-navy)
  color: var(--cor-branco)
  font-size: .875rem
  font-weight: 900
  line-height: normal

  img
    flex: none
    display: block

// Palco do mapa: largura toda do cartão, proporção do Figma (520 x 245,7).
// Tamanhos em cqw = proporcionais à largura do palco.
.mapa-palco
  position: relative
  container-type: inline-size
  aspect-ratio: 520 / 245.7
  margin-top: 13px

.mapa-palco__mapa
  position: absolute
  top: 0
  left: 3.0769%
  width: 88.3077%
  height: 100%

.mapa-palco__pino
  position: absolute
  width: 4.4231cqw
  height: 4.4231cqw

.mapa-palco__rotulo
  position: absolute
  padding: .7692cqw 1.7308cqw
  border-radius: 999px
  background: var(--cor-branco)
  box-shadow: 0 3px 10px rgba(18, 48, 98, .18)
  color: var(--cor-navy)
  font-size: max(9px, 2.2115cqw)
  font-weight: 900
  line-height: normal
  white-space: nowrap

.mapa-legenda
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 8px 18px
  margin: 27px 20px 0
  padding: 0
  list-style: none

  li
    display: inline-flex
    align-items: center
    gap: 7px
    color: var(--cor-chip-texto)
    font-size: .78125rem
    font-weight: 700

.mapa-legenda__cor
  flex: none
  width: 12px
  height: 12px
  border-radius: 3px

.mapa-legenda__cor--festa
  background: $mapa-festa

.mapa-legenda__cor--outros
  background: $mapa-outros

/* ---- revelar no scroll ---- */
[data-reveal]
  opacity: 0
  transform: translateY(18px)
  transition: opacity .6s ease, transform .6s cubic-bezier(.2, .8, .2, 1)

.mapa-cartao[data-reveal]
  transition-delay: .12s

.is-inview[data-reveal]
  opacity: 1
  transform: none

/* ---- telas menores ---- */
@media (max-width: 1240px)
  .cartao-bairros
    gap: 36px
    padding: 40px

  .mapa-cartao
    flex-basis: 440px

@media (max-width: 980px)
  .secao-onde-atendemos
    padding: 40px 0 84px

  .cartao-bairros
    flex-direction: column
    align-items: stretch
    gap: 32px

  .quebra-desktop
    display: none

  .mapa-cartao
    flex: none
    align-self: center
    width: 100%
    max-width: 560px

@media (max-width: 640px)
  .secao-onde-atendemos
    padding: 32px 0 72px

  .cartao-bairros
    gap: 28px
    padding: 32px 22px
    border-radius: 24px

  .texto
    gap: 14px

  .bairros
    gap: 8px

  .bairro
    padding: 8px 12px
    font-size: .84375rem

  .botao-whats
    width: 100%
    margin-top: 10px
    padding: 15px 20px
    font-size: 1rem

  .mapa-cartao
    padding: 16px 0 16px
    border-radius: 20px

  .selo-rj
    margin: 0 14px
    padding: 9px 14px
    border-radius: 18px
    font-size: .8125rem

  .mapa-legenda
    margin: 20px 14px 0

@media (max-width: 480px)
  .cartao-bairros
    padding: 28px 16px

  // Mapa estreito demais pros rótulos caberem legíveis sem se encavalarem:
  // ficam só os pinos (os nomes já estão nos chips logo acima).
  .mapa-palco__rotulo
    display: none

  // pino um pouco maior, com o centro do círculo (11,5 x 9,5 de 23) no mesmo lugar
  .mapa-palco__pino
    width: 5.5cqw
    height: 5.5cqw
    margin: -.4447cqw 0 0 -.5385cqw

  .botao-whats
    padding: 14px 16px
    font-size: .95rem

/* ---- menos movimento ---- */
@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    transform: none !important
    transition: none !important

  .botao-whats
    transition: none
</style>
