<!-- components/pages/index/SectionDepoimentos.vue -->
<template>
  <section
    id="depoimentos"
    ref="secEl"
    class="secao-depoimentos"
    aria-labelledby="depoimentos-titulo"
  >
    <!-- Enfeites de Natal (estrelas, flocos e presentes): só com o tema ligado. -->
    <div v-if="temaAtivo" class="enfeites" aria-hidden="true">
      <img
        v-for="e in enfeites"
        :key="e.id"
        class="enfeite"
        :class="`enfeite--${e.id}`"
        :src="e.src"
        :width="e.tamanho"
        :height="e.tamanho"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>

    <div class="container">
      <header class="cabecalho" data-reveal>
        <h2 id="depoimentos-titulo" class="titulo">
          Depoimentos dos pais <span class="destaque">felizes</span>
        </h2>

        <p class="subtitulo">
          Brinquedo alugado! Mais de 3 mil festas realizadas com alegria e segurança.
        </p>

        <!-- Média calculada só com os depoimentos abaixo (não é nota de plataforma). -->
        <p class="media">
          <strong class="media__valor">{{ mediaTexto }}</strong>
          <span class="estrelas estrelas--media" :style="{ '--preenchimento': preenchimento(media) }" aria-hidden="true">
            <span class="estrelas__vazias">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
            </span>
            <span class="estrelas__cheias">
              <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
            </span>
          </span>
          <span class="sr-only">de 5 estrelas,</span>
          <span class="media__texto">média dos {{ depoimentos.length }} depoimentos</span>
        </p>
      </header>

      <!-- Desktop: grade 3x2. Celular: fileira com rolagem lateral (scroll-snap). -->
      <div ref="trilhaEl" class="grade-depoimentos" @scroll.passive="aoRolar">
        <article
          v-for="(d, i) in depoimentos"
          :id="d.id"
          :key="d.id"
          :ref="(el) => guardarCartao(el, i)"
          class="cartao"
          :style="{
            '--cor': d.cor,
            '--cor-avatar-texto': d.corTexto || 'var(--cor-branco)',
            '--aspas-opacidade': d.opacidadeAspas ?? 0.3,
            '--atraso': `${(i % 3) * 90}ms`
          }"
          :aria-labelledby="`${d.id}-titulo`"
          data-reveal
        >
          <span class="cartao__aspas" aria-hidden="true">”</span>

          <div class="cartao__conteudo">
            <div class="cartao__nota">
              <span class="estrelas" :style="{ '--preenchimento': preenchimento(notaNumero(d.nota)) }" aria-hidden="true">
                <span class="estrelas__vazias">
                  <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
                </span>
                <span class="estrelas__cheias">
                  <svg v-for="n in 5" :key="n" viewBox="0 0 24 24"><path :d="ESTRELA" /></svg>
                </span>
              </span>
              <strong>{{ d.nota }}</strong>
              <span class="sr-only">de 5 estrelas</span>
            </div>

            <h3 :id="`${d.id}-titulo`" class="cartao__titulo">{{ d.titulo }}</h3>
            <p class="cartao__texto">“{{ d.texto }}”</p>

            <footer class="cartao__rodape">
              <div class="cartao__autor">
                <span class="avatar" aria-hidden="true">
                  {{ d.nome.charAt(0) }}
                  <img
                    v-if="temaAtivo"
                    class="avatar__gorro"
                    src="/images/natal/depoimentos-gorro-noel.svg"
                    width="38"
                    height="32"
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </span>

                <span class="cartao__quem">
                  <strong class="cartao__nome">{{ d.nome }}</strong>
                  <span class="cartao__local">
                    <SvgIcone nome="localizacao" :tamanho="14" />
                    <span>{{ d.cidade }}</span>
                  </span>
                </span>
              </div>

              <button
                type="button"
                class="curtir"
                :class="{ 'is-curtido': curtidos[d.id] }"
                :aria-pressed="curtidos[d.id] ? 'true' : 'false'"
                :aria-label="`Curtir o depoimento de ${d.nome}`"
                @click="alternarCurtida(d.id)"
              >
                <SvgIcone nome="coracao" :tamanho="18" />
              </button>
            </footer>
          </div>
        </article>
      </div>

      <!-- Bolinhas da fileira: só aparecem no celular. -->
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
        ></button>
      </div>

      <div class="cta" data-reveal>
        <a
          id="botao-whatsapp"
          class="botao-whats"
          :href="linkCta"
          target="_blank"
          rel="noopener noreferrer"
          @click="aoClicarCta"
        >
          <SvgIcone nome="whatsapp" :tamanho="20" />
          <span>Quero fazer meu orçamento no WhatsApp</span>
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import { WHATS_NUMERO } from '~/helpers/seo.js'

type Depoimento = {
  id: string
  nota: string
  titulo: string
  texto: string
  nome: string
  cidade: string
  cor: string
  corTexto?: string
  opacidadeAspas?: number
}

type Enfeite = {
  id: string
  src: string
  tamanho: number
}

const { temaAtivo, linkWhatsTema, registrarCliqueTema } = useTemaSazonal()

const secEl = ref<HTMLElement | null>(null)
const trilhaEl = ref<HTMLElement | null>(null)

const ESTRELA = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z'

const whatsMsg = 'Olá! Vim pelo site da City Toys, e quero fazer um orçamento 🎉'
const whatsLink = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(whatsMsg)}`

// Na campanha o botão leva a mensagem de Natal (lead já chega identificado).
const linkCta = computed(() => (temaAtivo.value ? linkWhatsTema.value : whatsLink))

function aoClicarCta() {
  if (temaAtivo.value) registrarCliqueTema('depoimentos')
}

// Depoimentos reais dos clientes: texto, nome e bairro não mudam.
// Cores da faixa/avatar seguem o Figma (verde, vermelho, amarelo, azul, verde, vermelho).
const depoimentos: Depoimento[] = [
  {
    id: 'depoimento-camila',
    nota: '4,9',
    titulo: 'Tudo perfeito!',
    texto: 'A criançada se divertiu bastante. Chegaram no horário certinho e montaram tudo rapidinho.',
    nome: 'Camila S.',
    cidade: 'Barra da Tijuca (RJ)',
    cor: 'var(--cor-verde-acao)'
  },
  {
    id: 'depoimento-fabiana',
    nota: '5,0',
    titulo: 'Muito atenciosos!',
    texto: 'A festa foi um sucesso. Com certeza alugaremos novamente!',
    nome: 'Fabiana M.',
    cidade: 'Recreio dos Bandeirantes (RJ)',
    cor: 'var(--cor-vermelho)'
  },
  {
    id: 'depoimento-dani',
    nota: '4,9',
    titulo: 'Atendimento e brinquedos nota 10!',
    texto: 'Vale muito a pena. Meu filho amou!',
    nome: 'Dani A.',
    cidade: 'Tijuca (RJ)',
    cor: 'var(--cor-dourado)',
    corTexto: 'var(--cor-navy)',
    opacidadeAspas: 0.6
  },
  {
    id: 'depoimento-ricardo',
    nota: '5,0',
    titulo: 'A experiência foi excelente!',
    texto: 'Recomendo muito a City Toys, equipe super profissional.',
    nome: 'Ricardo T.',
    cidade: 'Botafogo (RJ)',
    cor: '#2b74eb'
  },
  {
    id: 'depoimento-livia',
    nota: '5,0',
    titulo: 'Excelente serviço!',
    texto: 'Tudo limpo, seguro e de qualidade. Crianças amaram o tobogã!',
    nome: 'Lívia F.',
    cidade: 'Copacabana (RJ)',
    cor: 'var(--cor-verde-acao)'
  },
  {
    id: 'depoimento-andre',
    nota: '5,0',
    titulo: 'Festa de 6 anos do meu filho foi incrível!',
    texto: 'Os infláveis fizeram sucesso.',
    nome: 'André R.',
    cidade: 'Jacarepaguá (RJ)',
    cor: 'var(--cor-vermelho)'
  }
]

// Enfeites do Figma. A posição de cada um fica no CSS (.enfeite--<id>), que
// também esconde os que encostariam no texto em telas menores.
const enfeites: Enfeite[] = [
  { id: 'estrela-1', src: '/images/natal/depoimentos-estrela.svg', tamanho: 16 },
  { id: 'neve-1', src: '/images/natal/depoimentos-neve.svg', tamanho: 18 },
  { id: 'estrela-2', src: '/images/natal/depoimentos-estrela.svg', tamanho: 14 },
  { id: 'neve-2', src: '/images/natal/depoimentos-neve.svg', tamanho: 22 },
  { id: 'presente-1', src: '/images/natal/depoimentos-presente.svg', tamanho: 16 },
  { id: 'neve-3', src: '/images/natal/depoimentos-neve.svg', tamanho: 20 },
  { id: 'estrela-3', src: '/images/natal/depoimentos-estrela.svg', tamanho: 16 },
  { id: 'presente-2', src: '/images/natal/depoimentos-presente.svg', tamanho: 18 },
  { id: 'neve-4', src: '/images/natal/depoimentos-neve.svg', tamanho: 18 }
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

/* ---- curtir (só visual, não salva nada) ---- */

const curtidos = ref<Record<string, boolean>>({})

function alternarCurtida(id: string) {
  curtidos.value = { ...curtidos.value, [id]: !curtidos.value[id] }
}

/* ---- fileira do celular: bolinhas acompanham a rolagem ---- */

const cartoes: (HTMLElement | null)[] = []
function guardarCartao(el: Element | ComponentPublicInstance | null, i: number) {
  cartoes[i] = el as HTMLElement | null
}

const ativo = ref(0)
let quadroRolagem = 0

function aoRolar() {
  if (quadroRolagem) return
  quadroRolagem = requestAnimationFrame(() => {
    quadroRolagem = 0
    const trilha = trilhaEl.value
    if (!trilha) return

    const inicio = trilha.scrollLeft
    let maisPerto = 0
    let menorDistancia = Infinity

    cartoes.forEach((c, i) => {
      if (!c) return
      const distancia = Math.abs(c.offsetLeft - trilha.offsetLeft - inicio)
      if (distancia < menorDistancia) {
        menorDistancia = distancia
        maisPerto = i
      }
    })

    // no fim da rolagem o último cartão pode não encostar na esquerda
    if (inicio + trilha.clientWidth >= trilha.scrollWidth - 4) maisPerto = cartoes.length - 1
    ativo.value = maisPerto
  })
}

function irPara(i: number) {
  const trilha = trilhaEl.value
  const cartao = cartoes[i]
  if (!trilha || !cartao) return

  const recuo = parseFloat(getComputedStyle(trilha).scrollPaddingLeft) || 0
  trilha.scrollTo({
    left: cartao.offsetLeft - trilha.offsetLeft - recuo,
    behavior: reduceMotion() ? 'auto' : 'smooth'
  })
  ativo.value = i
}

/* ---- revelar no scroll (padrão do projeto) ---- */

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
  if (quadroRolagem) cancelAnimationFrame(quadroRolagem)
})
</script>

<style lang="sass" scoped>
$verde-curtir: #e3f7ec
$verde-curtir-hover: #cdeedb
$verde-whats-hover: #116a32
$sombra-cartao: 0 26px 60px rgba(18, 48, 98, .14)

.secao-depoimentos
  position: relative
  overflow: hidden
  padding: 110px 0
  background: var(--cor-neve)
  color: var(--cor-navy-2)
  font-family: var(--fonte)
  // o menu fixo não cobre o título quando se chega por #depoimentos
  scroll-margin-top: calc(var(--menu-h, 76px) + 10px)

.container
  position: relative
  z-index: 2
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

.sr-only
  position: absolute
  width: 1px
  height: 1px
  margin: -1px
  padding: 0
  overflow: hidden
  clip: rect(0, 0, 0, 0)
  white-space: nowrap
  border: 0

/* ---- enfeites de Natal ---- */
.enfeites
  position: absolute
  inset: 0
  z-index: 1
  pointer-events: none

.enfeite
  position: absolute
  display: block
  animation: enfeite-flutuar 6s ease-in-out infinite

  &:nth-child(2n)
    animation-delay: -2s

  &:nth-child(3n)
    animation-delay: -4s

// posições do Figma (quadro de 1440px): x em % da largura, y em px
.enfeite--estrela-1
  left: 4.86%
  top: 90px

.enfeite--neve-1
  left: 15.28%
  top: 40px

.enfeite--estrela-2
  left: 77.78%
  top: 60px

.enfeite--neve-2
  left: 87.5%
  top: 150px

.enfeite--presente-1
  left: 95.14%
  top: 40px

.enfeite--neve-3
  left: 2.78%
  top: 330px

.enfeite--estrela-3
  left: 96.53%
  top: 330px

.enfeite--presente-2
  left: 8.33%
  bottom: 110px

.enfeite--neve-4
  left: 91.67%
  bottom: 90px

@keyframes enfeite-flutuar
  0%, 100%
    transform: translateY(0) rotate(0deg)
  50%
    transform: translateY(-6px) rotate(8deg)

/* ---- cabeçalho ---- */
.cabecalho
  display: flex
  flex-direction: column
  align-items: center
  gap: 22px
  text-align: center

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

.media
  display: inline-flex
  flex-wrap: wrap
  align-items: center
  justify-content: center
  gap: 6px 10px
  margin: 0
  padding: 9px 18px
  border-radius: 999px
  background: var(--cor-branco)
  box-shadow: 0 6px 18px rgba(18, 48, 98, .08)

.media__valor
  color: var(--cor-navy-2)
  font-size: 1.0625rem
  font-weight: 900

.media__texto
  color: var(--cor-texto-suave)
  font-size: .90625rem
  font-weight: 700

/* ---- estrelas: fileira cinza + fileira amarela cortada no tamanho da nota ---- */
.estrelas
  position: relative
  display: inline-flex

.estrelas__vazias,
.estrelas__cheias
  display: flex
  gap: 4px

  svg
    flex: none
    width: 18px
    height: 18px

.estrelas--media
  .estrelas__vazias,
  .estrelas__cheias
    gap: 3px

  svg
    width: 16px
    height: 16px

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
    fill: #ffc531

/* ---- grade de cartões ---- */
.grade-depoimentos
  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  align-items: start
  gap: 24px
  margin-top: 40px

.cartao
  position: relative
  display: flex
  flex-direction: column
  overflow: hidden
  border: 1px solid var(--cor-borda)
  border-radius: 28px
  background: var(--cor-branco)
  box-shadow: $sombra-cartao

  // faixa de cor no topo
  &::before
    content: ""
    flex: none
    height: 6px
    background: var(--cor)

.cartao__aspas
  position: absolute
  top: 3px
  left: calc(100% - 82px)
  color: var(--cor)
  opacity: var(--aspas-opacidade)
  font-size: 96px
  font-weight: 900
  line-height: normal
  pointer-events: none
  user-select: none

.cartao__conteudo
  position: relative
  flex: 1
  display: flex
  flex-direction: column
  gap: 14px
  padding: 26px 34px 30px

.cartao__nota
  display: flex
  align-items: center
  gap: 4px

  strong
    color: var(--cor-navy-2)
    font-size: 1.0625rem
    font-weight: 900

.cartao__titulo
  margin: 0
  color: var(--cor-navy-2)
  font-size: clamp(1.25rem, 1.9vw, 1.5rem)
  font-weight: 900
  line-height: 1.2

.cartao__texto
  margin: 0
  color: var(--cor-navy-2)
  font-size: clamp(1rem, 1.3vw, 1.0625rem)
  line-height: 1.55

.cartao__rodape
  display: flex
  align-items: center
  justify-content: space-between
  gap: 12px
  margin-top: auto
  padding-top: 8px

.cartao__autor
  display: flex
  align-items: center
  gap: 12px
  min-width: 0

.avatar
  position: relative
  flex: none
  display: grid
  place-items: center
  width: 46px
  height: 46px
  border-radius: 50%
  background: var(--cor)
  color: var(--cor-avatar-texto)
  font-size: 1.25rem
  font-weight: 900

// gorro de Papai Noel por cima do avatar (só no tema)
.avatar__gorro
  position: absolute
  top: -23.06px
  left: -4.73px
  width: 38px
  height: 31.667px
  transform: rotate(-14deg)
  pointer-events: none

.cartao__quem
  display: flex
  flex-direction: column
  gap: 2px
  min-width: 0

.cartao__nome
  color: var(--cor-navy-2)
  font-size: 1rem
  font-weight: 900

.cartao__local
  display: flex
  align-items: center
  gap: 4px
  color: var(--cor-chip-texto)
  font-size: .875rem
  line-height: 1.3

  :deep(.edusites-icone)
    flex: none

.curtir
  flex: none
  display: grid
  place-items: center
  width: 42px
  height: 42px
  padding: 0
  border: 0
  border-radius: 12px
  background: $verde-curtir
  color: var(--cor-verde)
  cursor: pointer
  transition: background .2s ease, color .2s ease

  &:hover
    background: $verde-curtir-hover

  &:focus-visible
    outline: 3px solid rgba(30, 158, 87, .45)
    outline-offset: 2px

  &.is-curtido
    background: var(--cor-verde)
    color: var(--cor-branco)

    :deep(.edusites-icone)
      animation: coracao-pulo .45s ease

@keyframes coracao-pulo
  0%
    transform: scale(1)
  40%
    transform: scale(1.35)
  100%
    transform: scale(1)

/* ---- bolinhas (só celular) ---- */
.pontos
  display: none

/* ---- CTA ---- */
.cta
  display: flex
  justify-content: center
  margin-top: 22px

.botao-whats
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  padding: 17px 34px
  border-radius: 999px
  background: var(--cor-verde-acao)
  color: var(--cor-branco)
  font-size: 1.0625rem
  font-weight: 900
  text-align: center
  text-decoration: none
  filter: drop-shadow(0 8px 10px rgba(21, 128, 61, .25))
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

/* ---- revelar no scroll ---- */
[data-reveal]
  opacity: 0
  transform: translateY(18px)
  transition: opacity .6s ease var(--atraso, 0ms), transform .6s cubic-bezier(.2, .8, .2, 1) var(--atraso, 0ms)

.is-inview[data-reveal]
  opacity: 1
  transform: none

/* ---- telas menores ---- */
@media (max-width: 1240px)
  .cartao__conteudo
    padding: 24px 26px 28px

  .cartao__aspas
    left: calc(100% - 70px)

@media (max-width: 980px)
  .secao-depoimentos
    padding: 84px 0

  .grade-depoimentos
    grid-template-columns: repeat(2, minmax(0, 1fr))

  .enfeite--neve-3,
  .enfeite--estrela-3
    display: none

// Celular: fileira com rolagem lateral. A fileira vai de ponta a ponta da tela
// (margem negativa do tamanho do respiro do container), sem rolar a página.
@media (max-width: 640px)
  .secao-depoimentos
    padding: 64px 0 72px

  .cabecalho
    gap: 16px

  // no celular só ficam os enfeites que não encostam no título nem no botão
  .enfeite--estrela-1,
  .enfeite--estrela-2,
  .enfeite--neve-2
    display: none

  .enfeite--neve-1
    top: 22px

  .enfeite--presente-1
    top: 22px
    left: auto
    right: 6%

  .enfeite--presente-2
    bottom: 26px

  .enfeite--neve-4
    bottom: 30px
    left: auto
    right: 8%

  .media
    border-radius: 20px

  .grade-depoimentos
    display: flex
    align-items: stretch
    gap: 14px
    margin: 22px calc(var(--container-px) * -1) 0
    padding: 18px var(--container-px) 36px
    overflow-x: auto
    scroll-snap-type: x mandatory
    scroll-padding-inline: var(--container-px)
    scrollbar-width: none
    -webkit-overflow-scrolling: touch

    &::-webkit-scrollbar
      display: none

  .cartao
    flex: 0 0 86%
    scroll-snap-align: start
    box-shadow: 0 10px 24px rgba(18, 48, 98, .10)

  // na fileira os cartões já entram visíveis (fora da tela na horizontal o
  // IntersectionObserver só dispararia quando a pessoa arrastasse)
  .cartao[data-reveal]
    opacity: 1
    transform: none

  .cartao__conteudo
    gap: 12px
    padding: 22px 22px 24px

  .cartao__aspas
    left: calc(100% - 62px)
    font-size: 80px

  .pontos
    display: flex
    justify-content: center
    gap: 8px
    margin-top: 2px

  .ponto
    width: 9px
    height: 9px
    padding: 0
    border: 0
    border-radius: 999px
    background: rgba(21, 38, 75, .18)
    cursor: pointer
    transition: width .3s ease, background .3s ease

    &.is-ativo
      width: 28px
      background: var(--cor-verde-acao)

    &:focus-visible
      outline: 3px solid rgba(21, 128, 61, .45)
      outline-offset: 2px

  .cta
    margin-top: 26px

  .botao-whats
    width: 100%
    padding: 16px 22px
    font-size: 1rem

@media (max-width: 480px)
  .botao-whats
    padding: 15px 18px
    font-size: .95rem

/* ---- menos movimento: tudo aparece pronto e parado ---- */
@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    transform: none !important
    transition: none !important

  .enfeite,
  .curtir.is-curtido :deep(.edusites-icone)
    animation: none

  .curtir,
  .botao-whats,
  .ponto
    transition: none
</style>
