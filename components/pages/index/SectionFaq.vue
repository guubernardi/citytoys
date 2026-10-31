<!-- components/pages/index/SectionFaq.vue -->
<template>
  <section
    ref="secEl"
    class="secao-faq"
    :class="{ 'secao-faq--natal': temaAtivo }"
    id="faq"
    aria-labelledby="faq-titulo"
    itemscope
    itemtype="https://schema.org/FAQPage"
  >
    <!-- Curva do topo: o fundo branco da seção de cima descendo em arco.
         Faz parte do layout, aparece com ou sem tema. -->
    <img
      class="faq-curva"
      src="/images/natal/faq-curva-topo.svg"
      alt=""
      aria-hidden="true"
      width="1440"
      height="60"
      loading="lazy"
      decoding="async"
    />

    <!-- Enfeites soltos no fundo (estrelas, flocos, presentes): só no Natal. -->
    <div v-if="temaAtivo" class="faq-enfeites" aria-hidden="true">
      <img
        v-for="e in enfeites"
        :key="e.id"
        class="faq-enfeite"
        :class="{ 'faq-enfeite--some-mobile': e.someNoMobile }"
        :src="e.src"
        :width="e.tamanho"
        :height="e.tamanho"
        :style="e.posicao"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="container faq-grade">
      <!-- Coluna da esquerda: título, texto e WhatsApp. No desktop fica parada
           enquanto a lista rola. -->
      <aside class="faq-lateral revelar" data-reveal>
        <p class="faq-olho">
          <span class="faq-olho__ponto" aria-hidden="true"></span>
          Tem mais dúvidas?
        </p>

        <h2 class="faq-titulo" id="faq-titulo">
          Perguntas
          <span class="faq-titulo__destaque">frequentes</span>
        </h2>

        <p class="faq-subtitulo">
          As dúvidas que mais chegam pra gente. Não achou a sua? Chama no WhatsApp que a gente responde rapidinho.
        </p>

        <a class="faq-whats" :href="linkWhats" target="_blank" rel="noopener noreferrer">
          <SvgIcone nome="whatsapp" :tamanho="20" />
          Tirar dúvida no WhatsApp
        </a>

        <!-- Bolas de Natal penduradas, balançando de leve: só no Natal. -->
        <div v-if="temaAtivo" class="faq-bolas" aria-hidden="true">
          <img
            v-for="(b, i) in bolas"
            :key="b.src"
            class="faq-bola"
            :src="b.src"
            :width="b.largura"
            :height="b.altura"
            :style="{ '--atraso': `${i * -0.9}s` }"
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
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
          :style="{ '--atraso': `${i * 70}ms` }"
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
              <span class="faq-item__selo" aria-hidden="true">?</span>

              <span class="faq-item__pergunta" itemprop="name">{{ f.pergunta }}</span>

              <!-- "+" que vira "−": o traço de pé encolhe quando abre -->
              <span class="faq-item__alternar" aria-hidden="true">
                <svg viewBox="0 0 26 26">
                  <path d="M5.42 13h15.16" />
                  <path class="faq-item__alternar-pe" d="M13 5.42v15.16" />
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
              <p itemprop="text">{{ f.resposta }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

type Pergunta = { id: string; pergunta: string; resposta: string }

const WHATS_NUMERO = '5521984848699'
const linkWhats = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(
  'Olá! Vim pelo site da City Toys e tenho uma dúvida 🙂'
)}`

// ⚠️ As respostas de "espaço" e "chuva" foram escritas sem promessa (o Figma
// ainda tem "a confirmar com a City Toys"). Confirmar o texto com o cliente.
const perguntasBase: Pergunta[] = [
  {
    id: 'periodo',
    pergunta: 'Quanto tempo dura a locação?',
    resposta:
      'O nosso período de locação é de 4 horas, com a possibilidade de adicionar horas extras, caso necessário. Para mais informações, é só chamar a gente no WhatsApp, que explicamos direitinho.'
  },
  {
    id: 'area',
    pergunta: 'Quais bairros vocês atendem?',
    resposta: 'Atendemos o Rio de Janeiro e regiões próximas. Confirma seu bairro no WhatsApp e a gente te passa certinho.'
  },
  {
    id: 'higiene',
    pergunta: 'Os brinquedos são higienizados?',
    resposta: 'Sim! Fazemos limpeza e desinfecção completa após cada locação. Segurança e cuidado em primeiro lugar.'
  },
  {
    id: 'frete',
    pergunta: 'Vocês cobram frete?',
    resposta: 'Depende da localização. Algumas regiões têm taxa e outras não. Me chama no WhatsApp que calculamos rapidinho.'
  },
  {
    id: 'espaco',
    pergunta: 'Quanto espaço o brinquedo precisa?',
    resposta:
      'Depende do brinquedo, cada um tem uma medida. Me conta no WhatsApp o espaço que você tem e a gente indica o ideal pra sua festa.'
  },
  {
    id: 'chuva',
    pergunta: 'E se chover no dia da festa?',
    resposta:
      'Se a previsão for de chuva, o ideal é montar o brinquedo numa área coberta. Fala com a gente no WhatsApp antes da festa que a gente combina a melhor solução pra você.'
  }
]

// Na temporada a dúvida da data entra em primeiro lugar: é a pergunta que
// mais chega pelo WhatsApp nessa época do ano.
const { temaAtivo, copy } = useTemaSazonal()

const faqs = computed<Pergunta[]>(() => {
  if (!temaAtivo.value) return perguntasBase

  return [{ id: 'tema-sazonal', pergunta: copy.faqPergunta, resposta: copy.faqResposta }, ...perguntasBase]
})

// Enfeites do fundo, nas posições do Figma (frame de 1440 x 964). Os do lado
// direito ficam presos pela direita: assim nunca passam da borda da tela.
const enfeites = [
  { id: 'estrela-1', src: '/images/natal/faq-estrela.svg', tamanho: 16, posicao: { left: '2.1%', top: '18.7%' }, someNoMobile: false },
  { id: 'neve-1', src: '/images/natal/faq-neve.svg', tamanho: 18, posicao: { left: '36.1%', top: '12.4%' }, someNoMobile: true },
  { id: 'presente-1', src: '/images/natal/faq-presente-rosa.svg', tamanho: 18, posicao: { right: '2.2%', top: '17.6%' }, someNoMobile: false },
  { id: 'presente-2', src: '/images/natal/faq-presente-verde.svg', tamanho: 18, posicao: { left: '4.2%', top: '66.4%' }, someNoMobile: true },
  { id: 'estrela-2', src: '/images/natal/faq-estrela-menor.svg', tamanho: 14, posicao: { left: '33.3%', top: '72.6%' }, someNoMobile: true },
  { id: 'neve-2', src: '/images/natal/faq-neve-maior.svg', tamanho: 20, posicao: { right: '1.7%', top: '58.1%' }, someNoMobile: false },
  { id: 'brilho-1', src: '/images/natal/faq-brilho.svg', tamanho: 12, posicao: { left: '20.8%', top: '89.2%' }, someNoMobile: false },
  { id: 'estrela-3', src: '/images/natal/faq-estrela-menor.svg', tamanho: 14, posicao: { right: '8.7%', top: '91.3%' }, someNoMobile: false }
]

const bolas = [
  { src: '/images/natal/faq-bola-vermelha.svg', largura: 56, altura: 96 },
  { src: '/images/natal/faq-bola-verde.svg', largura: 44, altura: 124 },
  { src: '/images/natal/faq-bola-amarela.svg', largura: 64, altura: 118 },
  { src: '/images/natal/faq-bola-azul.svg', largura: 40, altura: 136 }
]

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
// Cores do Figma que não viraram variável global
$borda-item: #f1e3b8
$fundo-selo: #ffe4e4
$sombra-item: rgba(138, 106, 0, .06)
$verde-escuro: #116a32

.secao-faq
  position: relative
  /* isola os z-index daqui: o gorro da chamada final encosta nessa seção */
  isolation: isolate
  width: 100%
  padding: 130px 0
  font-family: var(--fonte)
  color: var(--cor-navy)
  background: var(--cor-creme)
  /* só na horizontal (nada de barra de rolagem) e sem desligar o
     position: sticky da coluna da esquerda */
  overflow-x: clip
  scroll-margin-top: 90px

/* ---- curva do topo ---- */
.faq-curva
  position: absolute
  top: -1px
  left: 0
  z-index: 1
  display: block
  width: 100%
  height: 60px
  pointer-events: none

/* ---- enfeites soltos (Natal) ---- */
.faq-enfeites
  position: absolute
  inset: 0
  z-index: 0
  pointer-events: none

.faq-enfeite
  position: absolute
  display: block
  animation: enfeite-piscar 4s ease-in-out infinite

  &:nth-child(2n)
    animation-delay: -1.6s

  &:nth-child(3n)
    animation-delay: -2.8s

@keyframes enfeite-piscar
  0%, 100%
    opacity: 1
    transform: scale(1)
  50%
    opacity: .55
    transform: scale(.85)

/* ---- grade de duas colunas ---- */
.container
  position: relative
  z-index: 2
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

.faq-grade
  display: grid
  grid-template-columns: 440px minmax(0, 1fr)
  gap: 64px
  align-items: start

/* ---- coluna da esquerda ---- */
.faq-lateral
  position: sticky
  top: calc(var(--menu-h, 76px) + 24px)
  display: flex
  flex-direction: column
  align-items: flex-start
  gap: 18px

.faq-olho
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0
  color: var(--cor-vermelho)
  font-size: 13px
  font-weight: 900
  letter-spacing: 1.3px
  text-transform: uppercase

.faq-olho__ponto
  flex: none
  width: 8px
  height: 8px
  border-radius: 50%
  background: var(--cor-vermelho)

.faq-titulo
  margin: 0
  color: var(--cor-navy)
  font-size: clamp(2.5rem, 4.2vw, 3.5rem)
  font-weight: 900
  line-height: 1

.faq-titulo__destaque
  display: block
  color: var(--cor-vermelho)

.faq-subtitulo
  margin: 0
  color: var(--cor-navy-2)
  font-size: 17px
  line-height: 1.55

.faq-whats
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  padding: 15px 28px
  border-radius: 999px
  background: var(--cor-verde-acao)
  color: var(--cor-branco)
  font-size: 17px
  font-weight: 900
  text-decoration: none
  box-shadow: 0 8px 20px rgba(21, 128, 61, .22)
  transition: background .2s ease

  /* hover só troca a cor (verde um pouco mais escuro), sem mexer o botão */
  &:hover
    background: $verde-escuro

  &:focus-visible
    outline: 3px solid rgba(21, 128, 61, .45)
    outline-offset: 3px

/* ---- bolas de Natal ---- */
.faq-bolas
  display: flex
  align-items: flex-start
  gap: 22px
  padding-top: 26px

.faq-bola
  display: block
  flex: none
  transform-origin: 50% 0
  animation: bola-balancar 4.5s ease-in-out infinite
  animation-delay: var(--atraso, 0s)

@keyframes bola-balancar
  0%, 100%
    transform: rotate(3deg)
  50%
    transform: rotate(-3deg)

/* ---- acordeão ---- */
.faq-lista
  display: flex
  flex-direction: column
  gap: 14px

.faq-item
  position: relative
  border: 1px solid $borda-item
  border-radius: 20px
  background: var(--cor-branco)
  box-shadow: 0 8px 22px $sombra-item
  transition: border-color .3s ease, box-shadow .3s ease

  &.is-aberto
    border-color: rgba(214, 47, 53, .35)
    box-shadow: 0 0 0 .5px rgba(214, 47, 53, .35), 0 8px 22px $sombra-item

.faq-item__titulo
  margin: 0

.faq-item__botao
  display: flex
  align-items: center
  gap: 14px
  width: 100%
  padding: 20px 24px
  border: 0
  border-radius: 20px
  background: transparent
  color: var(--cor-navy)
  font-family: inherit
  text-align: left
  cursor: pointer
  transition: padding .4s ease

  &:focus-visible
    outline: 3px solid rgba(214, 47, 53, .35)
    outline-offset: -3px

  &:hover .faq-item__alternar
    background: var(--cor-borda)

.faq-item__selo
  flex: none
  display: grid
  place-items: center
  width: 34px
  height: 34px
  border-radius: 50%
  background: $fundo-selo
  color: var(--cor-vermelho)
  font-size: 17px
  font-weight: 900
  line-height: 1

.faq-item__pergunta
  flex: 1
  min-width: 0
  font-size: 18px
  font-weight: 900
  line-height: 1.3

.faq-item__alternar
  flex: none
  display: grid
  place-items: center
  width: 34px
  height: 34px
  border-radius: 50%
  background: var(--cor-chip-fundo)
  color: var(--cor-navy)
  transition: background .3s ease, transform .35s ease

  svg
    display: block
    width: 18px
    height: 18px

  path
    fill: none
    stroke: currentColor
    stroke-width: 2.4
    stroke-linecap: round

.faq-item__alternar-pe
  transform-box: fill-box
  transform-origin: center
  transition: transform .35s ease

/* aberta: 12px entre a pergunta e a resposta, como no Figma */
.faq-item.is-aberto .faq-item__botao
  padding-bottom: 12px

.faq-item.is-aberto .faq-item__alternar
  transform: rotate(180deg)

  .faq-item__alternar-pe
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
    /* 24 de respiro lateral + 48 de recuo (selo + espaço) */
    padding: 0 72px 20px
    color: var(--cor-chip-texto)
    font-size: 16px
    line-height: 1.55
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

/* ---- tablet ---- */
@media (max-width: 1100px)
  .faq-grade
    grid-template-columns: 360px minmax(0, 1fr)
    gap: 44px

@media (max-width: 980px)
  .secao-faq
    padding: 100px 0 90px

  .faq-grade
    grid-template-columns: 1fr
    gap: 36px

  .faq-lateral
    position: static
    align-items: center
    text-align: center

  .faq-subtitulo
    max-width: 520px

  .faq-bolas
    padding-top: 8px

  .faq-enfeite--some-mobile
    display: none

/* ---- celular ---- */
@media (max-width: 640px)
  .faq-curva
    height: 32px

  .secao-faq
    padding: 72px 0 72px

  .faq-subtitulo
    font-size: 16px

  .faq-item__botao
    gap: 12px
    padding: 16px

  .faq-item__pergunta
    font-size: 16px

  .faq-item__resposta-dentro p
    padding: 0 16px 18px 62px
    font-size: 15px

@media (max-width: 520px)
  .faq-whats
    width: 100%

  .faq-item__resposta-dentro p
    padding: 0 16px 18px

  .faq-bolas
    gap: 16px

/* ---- menos movimento: tudo aparece pronto e parado ---- */
@media (prefers-reduced-motion: reduce)
  .revelar,
  .faq-lista .faq-item
    opacity: 1
    transform: none
    transition: none

  .faq-enfeite,
  .faq-bola
    animation: none

  .faq-item__resposta,
  .faq-item__resposta-dentro p,
  .faq-item__botao,
  .faq-item__alternar,
  .faq-item__alternar-pe
    transition: none
</style>
