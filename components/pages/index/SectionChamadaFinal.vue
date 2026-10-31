<!-- components/pages/index/SectionChamadaFinal.vue -->
<template>
  <section
    class="secao-chamada"
    :class="{ 'secao-chamada--natal': temaAtivo }"
    aria-labelledby="chamada-titulo"
  >
    <div class="container">
      <div class="chamada-card">
        <!-- Enfeites de Natal do card: varal de luzes no topo, gorro no canto
             e flocos no fundo. Fora da campanha o card fica limpo. -->
        <template v-if="temaAtivo">
          <div class="chamada-card__varal" aria-hidden="true">
            <img
              src="/images/natal/chamada-final-varal-luzes.svg"
              alt=""
              width="1180"
              height="74"
              loading="lazy"
              decoding="async"
            />
          </div>

          <img
            v-for="n in flocos"
            :key="n.id"
            class="chamada-card__floco"
            :src="n.src"
            :width="n.tamanho"
            :height="n.tamanho"
            :style="{ left: n.x, top: n.y }"
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
          />

          <div class="chamada-card__gorro" aria-hidden="true">
            <img
              src="/images/natal/chamada-final-gorro-noel.svg"
              alt=""
              width="129"
              height="103"
              loading="lazy"
              decoding="async"
            />
          </div>
        </template>

        <div class="chamada-card__texto">
          <p class="chamada-card__olho">
            <SvgIcone nome="calendario" :tamanho="16" />
            {{ textos.olho }}
          </p>

          <h2 id="chamada-titulo" class="chamada-card__titulo">{{ textos.titulo }}</h2>

          <p class="chamada-card__descricao">{{ textos.descricao }}</p>

          <div class="chamada-card__acoes">
            <a
              class="chamada-botao chamada-botao--whats"
              :href="linkWhats"
              target="_blank"
              rel="noopener noreferrer"
              @click="aoClicarWhats"
            >
              <SvgIcone nome="whatsapp" :tamanho="20" />
              Chamar no WhatsApp
            </a>

            <NuxtLink to="/montar-combo" class="chamada-botao chamada-botao--combo">
              <SvgIcone nome="foguete" :tamanho="18" />
              Montar meu combo
            </NuxtLink>
          </div>
        </div>

        <!-- Foto em polaroid inclinada -->
        <figure class="chamada-polaroid">
          <img
            class="chamada-polaroid__foto"
            :src="foto.src"
            :alt="foto.alt"
            width="330"
            height="220"
            loading="lazy"
            decoding="async"
          />
        </figure>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

const { temaAtivo, linkWhatsTema, registrarCliqueTema } = useTemaSazonal()

const WHATS_NUMERO = '5521984848699'
const linkWhatsPadrao = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(
  'Olá! Vim pelo site da City Toys e quero garantir a data da minha festa 🎉'
)}`

// Copy da chamada: a de Natal fala da agenda de dezembro; fora da campanha
// fica neutra (sem fim de ano, sem dezembro).
const textos = computed(() =>
  temaAtivo.value
    ? {
        olho: 'Agenda de dezembro',
        titulo: 'Garanta sua data de dezembro',
        descricao: 'A agenda das festas de fim de ano fecha cedo. Chama no WhatsApp e confirma a disponibilidade rapidinho.'
      }
    : {
        olho: 'Agenda aberta',
        titulo: 'Garanta a data da sua festa',
        descricao: 'Chama no WhatsApp, conta a data e o bairro da festa e a gente confirma a disponibilidade rapidinho.'
      }
)

const linkWhats = computed(() => (temaAtivo.value ? linkWhatsTema.value : linkWhatsPadrao))

const foto = computed(() =>
  temaAtivo.value
    ? {
        src: '/images/natal/chamada-final-inflavel-natal.webp',
        alt: 'Brinquedo inflável decorado com luzes e gorro de Papai Noel para festa de Natal'
      }
    : {
        src: '/images/castelinho.webp',
        alt: 'Castelinho inflável com escorregador montado para festa infantil no Rio de Janeiro'
      }
)

// Flocos no fundo do card, nas posições do Figma (card de 1280 de largura).
const flocos = [
  { id: 'floco-1', src: '/images/natal/chamada-final-neve-grande.svg', tamanho: 34, x: '87.5%', y: '51%' },
  { id: 'floco-2', src: '/images/natal/chamada-final-neve-pequena.svg', tamanho: 20, x: '50%', y: '70%' },
  { id: 'floco-3', src: '/images/natal/chamada-final-neve-media.svg', tamanho: 24, x: '3.1%', y: '70%' }
]

function aoClicarWhats() {
  if (temaAtivo.value) registrarCliqueTema('chamada-final')
}
</script>

<style lang="sass" scoped>
// Cores do Figma que não viraram variável global
$vermelho-claro: #e5343a
$vermelho-escuro: #b8202c
// fundo do botão branco do WhatsApp no hover: um toque de verde
$verde-claro: #e9f7ee

.secao-chamada
  position: relative
  z-index: 1
  width: 100%
  padding: 10px 0 140px
  background: var(--cor-creme)
  font-family: var(--fonte)
  /* o gorro passa da borda do card: corta só na horizontal (nada de barra de
     rolagem no celular) e deixa ele subir por cima da seção de cima */
  overflow-x: clip

.container
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

/* ---- card ---- */
.chamada-card
  position: relative
  display: flex
  align-items: center
  gap: 40px
  padding: 76px 72px 64px
  border-radius: 36px
  background: linear-gradient(90deg, #{$vermelho-claro} 0%, #{$vermelho-escuro} 100%)
  box-shadow: 0 24px 50px rgba(138, 15, 23, .3)
  color: var(--cor-branco)

/* varal de luzes: ocupa a largura do card (1180 de 1280 no desenho) e diminui
   junto com ele, sempre inteiro, com as pontas presas na borda de cima */
.chamada-card__varal
  position: absolute
  top: -6px
  left: 50px
  right: 50px
  pointer-events: none

  img
    display: block
    width: 100%
    height: auto

.chamada-card__floco
  position: absolute
  display: block
  pointer-events: none

.chamada-card__gorro
  position: absolute
  top: -41px
  left: -51px
  z-index: 2
  width: 110px
  height: 92px
  transform: rotate(18deg)
  pointer-events: none

  img
    position: absolute
    top: 0
    left: -8px
    display: block
    width: 129px
    height: 103px

/* ---- texto ---- */
.chamada-card__texto
  position: relative
  z-index: 1
  flex: 1
  min-width: 0
  display: flex
  flex-direction: column
  align-items: flex-start
  gap: 16px

.chamada-card__olho
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0
  color: var(--cor-dourado)
  font-size: 13px
  font-weight: 900
  letter-spacing: 1.3px
  text-transform: uppercase

.chamada-card__titulo
  margin: 0
  font-size: clamp(2rem, 3.4vw, 3rem)
  font-weight: 900
  line-height: 1.12

.chamada-card__descricao
  margin: 0
  color: rgba(255, 255, 255, .9)
  font-size: 18px
  font-weight: 700
  line-height: 1.5

.chamada-card__acoes
  display: flex
  flex-wrap: wrap
  gap: 14px
  padding-top: 8px

.chamada-botao
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  border-radius: 999px
  font-family: inherit
  font-weight: 900
  text-decoration: none
  white-space: nowrap
  /* hover só troca cor/fundo, o botão não se mexe */
  transition: background .25s ease, border-color .25s ease, color .25s ease

  &:focus-visible
    outline: 3px solid var(--cor-dourado)
    outline-offset: 3px

.chamada-botao--whats
  padding: 17px 30px
  background: var(--cor-branco)
  color: var(--cor-navy)
  font-size: 18px
  box-shadow: 0 10px 24px rgba(90, 10, 16, .3)

  :deep(svg)
    color: var(--cor-verde-acao)

  &:hover
    background: $verde-claro

.chamada-botao--combo
  padding: 16px 28px
  border: 1.6px solid rgba(255, 255, 255, .55)
  color: var(--cor-branco)
  font-size: 17px

  &:hover
    border-color: var(--cor-branco)
    background: rgba(255, 255, 255, .1)

/* ---- polaroid ---- */
.chamada-polaroid
  position: relative
  z-index: 1
  flex: none
  margin: 0 14px 0 0
  padding: 10px 10px 40px
  border-radius: 14px
  background: var(--cor-branco)
  box-shadow: 0 18px 36px rgba(58, 5, 8, .35)
  --giro: 4deg
  transform: rotate(var(--giro))

.chamada-polaroid__foto
  display: block
  width: 330px
  height: 220px
  border-radius: 8px
  object-fit: cover

/* com pouca margem do lado o gorro entra no card na medida certa pra não
   passar da borda da tela (margem lateral = sobra da tela ou o padding) */
@media (max-width: 1440px)
  .chamada-card__gorro
    left: max(-51px, calc(16px - max(var(--container-px), (100vw - 1280px) / 2)))

@media (max-width: 1100px)
  .chamada-card
    padding: 76px 48px 56px

  .chamada-polaroid__foto
    width: 280px
    height: 187px

/* ---- tablet: foto embaixo do texto ---- */
@media (max-width: 980px)
  .secao-chamada
    padding: 10px 0 110px

  .chamada-card
    flex-direction: column
    gap: 36px
    padding: 72px 40px 48px
    text-align: center

  .chamada-card__texto
    align-items: center

  .chamada-card__acoes
    justify-content: center

  .chamada-polaroid
    --giro: 3deg
    margin: 0

  .chamada-polaroid__foto
    width: min(330px, 70vw)
    height: auto
    aspect-ratio: 3 / 2

/* ---- celular ---- */
@media (max-width: 640px)
  .secao-chamada
    padding: 10px 0 90px

  .chamada-card
    padding: 64px 22px 40px
    border-radius: 28px

  /* no celular o varal inteiro ficaria com lâmpadas minúsculas: ele fica num
     tamanho legível, centralizado, e as pontas somem num degradê (sem corte
     seco) */
  .chamada-card__varal
    left: 24px
    right: 24px
    display: flex
    justify-content: center
    overflow: hidden
    -webkit-mask-image: linear-gradient(90deg, transparent, #000 40px, #000 calc(100% - 40px), transparent)
    mask-image: linear-gradient(90deg, transparent, #000 40px, #000 calc(100% - 40px), transparent)

    img
      flex: none
      width: 700px

  .chamada-card__gorro
    top: -32px
    left: -14px
    transform: rotate(18deg) scale(.72)
    transform-origin: 30% 60%

  .chamada-card__descricao
    font-size: 16px

  .chamada-card__floco
    display: none

@media (max-width: 520px)
  .chamada-card__acoes
    flex-direction: column
    align-items: stretch
    width: 100%

  .chamada-botao
    width: 100%
    white-space: normal

  .chamada-botao--whats
    padding: 16px 20px
    font-size: 17px

  .chamada-botao--combo
    padding: 15px 20px

/* ---- menos movimento ---- */
@media (prefers-reduced-motion: reduce)
  .chamada-botao
    transition: none
</style>
