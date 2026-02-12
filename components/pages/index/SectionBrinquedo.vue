<template>
  <section
    ref="secEl"
    class="secao-brinquedos"
    id="brinquedos"
    aria-label="Brinquedos para alugar no Rio de Janeiro"
    data-anim="section-in"
  >
    <div class="container">
      <header class="cabecalho-secao" id="brinquedos-cabecalho" data-anim="fade-up">
        <p class="mini-texto" id="brinquedos-kicker">
          <span class="pontinho">•</span> A Diversão Decola Aqui! <span class="pontinho">•</span>
        </p>

        <h2 class="titulo-secao" id="brinquedos-titulo">Veja nossos brinquedos mais alugados</h2>
        <p class="subtitulo-secao" id="brinquedos-subtitulo">Escolha uma categoria ou veja todos 😄</p>

        <div
          class="chips-categorias"
          id="brinquedos-filtros"
          role="tablist"
          aria-label="Categorias de brinquedos"
          data-anim="fade-up"
        >
          <button
            v-for="c in categorias"
            :key="c.id"
            class="chip"
            :class="[`chip--${c.id}`, { 'chip-ativo': activeCat === c.id }]"
            type="button"
            role="tab"
            :data-cat="c.id"
            :aria-selected="activeCat === c.id ? 'true' : 'false'"
            aria-controls="brinquedos-grade"
            @click="activeCat = c.id"
          >
            {{ c.label }}
          </button>
        </div>
      </header>

      <div
        class="grade-brinquedos"
        id="brinquedos-grade"
        role="tabpanel"
        aria-label="Lista de brinquedos"
        data-anim="stagger-cards"
      >
        <article
          v-for="(toy, idx) in brinquedosFiltrados"
          :key="toy.id"
          class="card-brinquedo"
          :id="toy.id"
          :data-cat="toy.cat"
          data-anim="card-in"
          data-reveal
          :class="idx % 2 === 0 ? 'reveal-left' : 'reveal-right'"
          itemscope
          itemtype="https://schema.org/Product"
        >
          <meta itemprop="category" :content="toy.schemaCategory" />
          <meta itemprop="brand" content="City Toys" />
          <meta itemprop="areaServed" content="Rio de Janeiro" />

          <div class="etiqueta" :class="toy.etiquetaClass">{{ toy.etiquetaLabel }}</div>

          <div class="miolo-card">
            <div class="textos-card">
              <h3 class="nome-brinquedo" itemprop="name">{{ toy.name }}</h3>
              <div class="separador-card" aria-hidden="true"></div>

              <ul class="infos-brinquedo" aria-label="Informações do brinquedo">
                <li>
                  <span class="icone">
                    <img :src="toy.ageIcon" :alt="toy.ageAlt" loading="lazy" decoding="async" />
                  </span>
                  <span>{{ toy.ageText }}</span>
                </li>

                <li>
                  <span class="icone">
                    <img :src="toy.capIcon" :alt="toy.capAlt" loading="lazy" decoding="async" />
                  </span>
                  <span>{{ toy.capText }}</span>
                </li>
              </ul>
            </div>

            <div class="thumb-brinquedo">
              <img :src="toy.imageSrc" :alt="toy.imageAlt" loading="lazy" decoding="async" itemprop="image" />
            </div>
          </div>

          <a
            class="btn-card-whats"
            :id="`cta-${toy.id}`"
            :href="buildWhatsLink(toy.name)"
            target="_blank"
            rel="noopener"
            :aria-label="`Quero ${toy.name} no WhatsApp`"
            data-anim="cta-pop"
          >
            <img class="icone-whats" src="/images/whatsapp.svg" alt="" aria-hidden="true" />
            Quero esse no WhatsApp
          </a>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type CategoriaId = 'todos' | 'grande' | 'medio' | 'pequeno'

type Toy = {
  id: string
  cat: Exclude<CategoriaId, 'todos'>
  etiquetaLabel: 'Grande' | 'Médio' | 'Pequeno'
  etiquetaClass: 'etiqueta-grande' | 'etiqueta-medio' | 'etiqueta-pequeno'
  name: string
  schemaCategory: string

  ageIcon: string
  ageAlt: string
  ageText: string

  capIcon: string
  capAlt: string
  capText: string

  imageSrc: string
  imageAlt: string
}

const secEl = ref<HTMLElement | null>(null)

const categorias = [
  { id: 'todos' as const, label: 'Todos' },
  { id: 'grande' as const, label: 'Grande' },
  { id: 'medio' as const, label: 'Médio' },
  { id: 'pequeno' as const, label: 'Pequeno' }
]

const activeCat = ref<CategoriaId>('todos')

const idadeIcon = '/images/icone-idade-3+.svg'
const capacidadeIcon = '/images/icone-capacidade.svg'

const brinquedos = ref<Toy[]>([
  // GRANDES
  {
    id: 'toy-area-baby',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Área Baby',
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 0+',
    ageText: 'Até 5 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 6 crianças',
    capText: 'Até 6 crianças',
    imageSrc: '/images/area-baby.png',
    imageAlt: 'Área Baby — brinquedo inflável grande para festas no Rio de Janeiro'
  },
  {
    id: 'toy-castelinho',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Castelinho',
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 2+',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/castelinho.webp',
    imageAlt: 'Castelinho — brinquedo inflável grande para festa infantil no Rio de Janeiro'
  },
  {
    id: 'toy-futebol-sabao-4x8',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Futebol de Sabão 4x8',
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Até 12 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 6 crianças',
    capText: 'Até 6 crianças',
    imageSrc: '/images/futebol-sabao-4x8.webp',
    imageAlt: 'Futebol de Sabão 4x8 — brinquedo inflável grande para eventos no Rio de Janeiro'
  },
  {
    id: 'toy-futebol-sabao-10x5',
    cat: 'grande',
    etiquetaLabel: 'Grande',
    etiquetaClass: 'etiqueta-grande',
    name: 'Futebol de Sabão 10x5',
    schemaCategory: 'Brinquedo inflável - Grande',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 8 crianças',
    capText: 'Até 8 crianças',
    imageSrc: '/images/futebol-sabao-10x5.webp',
    imageAlt: 'Futebol de Sabão 10x5 — brinquedo inflável grande para festa e eventos no Rio de Janeiro'
  },
  {
    id: 'toy-guerra-cotonete',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Guerra de Cotonete',
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 2 crianças',
    capText: 'Até 2 crianças',
    imageSrc: '/images/guerra-cotonete.webp',
    imageAlt: 'Guerra de Cotonete — brinquedo inflável grande para festas no Rio de Janeiro'
  },
  {
    id: 'toy-mini-circuito',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Mini Circuito',
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 2+',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/mini-circuito.webp',
    imageAlt: 'Mini Circuito — brinquedo inflável grande para eventos e festas no Rio de Janeiro'
  },
  {
    id: 'toy-tigrinho',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Tigrinho',
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 1+',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 crianças',
    capText: 'Até 8 crianças',
    imageSrc: '/images/tigrinho.webp',
    imageAlt: 'Tigrinho — brinquedo inflável grande para festas no Rio de Janeiro'
  },
  {
    id: 'toy-toboga-colorex',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Tobogã Colorex',
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Até 10 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 criança',
    capText: 'Até 3 criança',
    imageSrc: '/images/colrex2.webp',
    imageAlt: 'Tobogã Colorex — escorregador inflável grande para eventos no Rio de Janeiro'
  },
  {
    id: 'toy-toboga-gigante',
    cat: 'grande',
    etiquetaLabel: 'Grande',
    etiquetaClass: 'etiqueta-grande',
    name: 'Tobogã Gigante',
    schemaCategory: 'Brinquedo inflável - Grande',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 criança',
    capText: 'Até 4 criança',
    imageSrc: '/images/gigante.webp',
    imageAlt: 'Tobogã Gigante — escorregador inflável grande para festas no Rio de Janeiro'
  },
  {
    id: 'toy-toboga-premium',
    cat: 'medio',
    etiquetaLabel: 'médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Tobogã Premium',
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Até 12 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 criança',
    capText: 'Até 3 criança',
    imageSrc: '/images/premium.webp',
    imageAlt: 'Tobogã Premium — escorregador inflável grande para eventos no Rio de Janeiro'
  },
  {
    id: 'toy-toboagua',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Toboágua',
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 5+',
    ageText: 'Até 15 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 1 criança',
    capText: 'Até 1 criança',
    imageSrc: '/images/toboagua.webp',
    imageAlt: 'Toboágua — brinquedo inflável com água para festas no Rio de Janeiro'
  },
  {
    id: 'toy-touro-mecanico',
    cat: 'grande',
    etiquetaLabel: 'Grande',
    etiquetaClass: 'etiqueta-grande',
    name: 'Touro Mecânico',
    schemaCategory: 'Brinquedo - Grande',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 4+',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 1 criança',
    capText: 'Até 1 criança',
    imageSrc: '/images/touro-mecanico.webp',
    imageAlt: 'Touro Mecânico — atração para festas e eventos no Rio de Janeiro'
  },

  {
    id: 'toy-legolandia',
    cat: 'grande',
    etiquetaLabel: 'Grande',
    etiquetaClass: 'etiqueta-grande',
    name: 'Legolândia',
    schemaCategory: 'Brinquedo - Grande',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 2+',
    ageText: 'Até 10 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 criança',
    capText: 'Até 4 criança',
    imageSrc: '/images/legolandia.webp',
    imageAlt: 'Legolândia — brinquedo médio para festa infantil no Rio de Janeiro'
  },

  // MÉDIOS
  {
    id: 'toy-pula-pula-244',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Pula-Pula 2,44',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 0+',
    ageText: 'Até 7 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 2 criança',
    capText: 'Até 2 criança',
    imageSrc: '/images/pula-pula-244.webp',
    imageAlt: 'Pula-Pula 2,44 — aluguel para festa infantil no Rio de Janeiro'
  },
  {
    id: 'toy-pula-pula-305',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Pula-Pula 3,05',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 0+',
    ageText: 'Até 12 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 criança',
    capText: 'Até 3 criança',
    imageSrc: '/images/pula-pula-244.webp',
    imageAlt: 'Pula-Pula 3,05 — aluguel para festa no Rio de Janeiro'
  },
  {
    id: 'toy-piscina-bolinha',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Piscina de Bolinha',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 0+',
    ageText: 'Até 5 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 criança',
    capText: 'Até 3 criança',
    imageSrc: '/images/piscina-bolinha.webp',
    imageAlt: 'Piscina de Bolinha — brinquedo médio para festa infantil no Rio de Janeiro'
  },
  {
    id: 'toy-piscina-dino',
    cat: 'Pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Piscina Dino',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 0+',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 criança',
    capText: 'Até 3 criança',
    imageSrc: '/images/dino.webp',
    imageAlt: 'Piscina Dino — brinquedo médio para festa no Rio de Janeiro'
  },

  // PEQUENOS
  {
    id: 'toy-toto',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Totó',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: '3+',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 criança',
    capText: 'Até 4 criança',
    imageSrc: '/images/toto.webp',
    imageAlt: 'Totó — brinquedo pequeno para eventos e festas no Rio de Janeiro'
  },
  {
    id: 'toy-air-game',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Air Game',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: '3+',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 2 criança',
    capText: 'Até 2 criança',
    imageSrc: '/images/air-game.webp',
    imageAlt: 'Air Game — brinquedo pequeno para festas no Rio de Janeiro'
  }
])

const brinquedosFiltrados = computed(() => {
  if (activeCat.value === 'todos') return brinquedos.value
  return brinquedos.value.filter((t) => t.cat === activeCat.value)
})

function buildWhatsLink(nomeBrinquedo: string) {
  const numero = '5521984848699'
  const msg = `Olá, vim pelo site e quero alugar o brinquedo: ${nomeBrinquedo}`
  return `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`
}

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
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('is-inview')
          io?.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px 160px 0px' }
    )
  }

  els.forEach((el) => io!.observe(el))
}

onMounted(async () => {
  await nextTick()
  observeReveals()
})

watch(brinquedosFiltrados, async () => {
  await nextTick()
  observeReveals()
})

onBeforeUnmount(() => {
  io?.disconnect()
  io = null
})
</script>

<style lang="sass" scoped>
$ct-blue: #2b74eb
$ct-teal: #00c2c7
$ct-red: #ff3b3b
$ct-orange: #ff9800
$ct-yellow: #ffd742
$ct-navy: #002f55

.secao-brinquedos
  position: relative
  z-index: 5
  margin-top: -1px
  font-family: var(--fonte)
  padding: 70px 0
  background-image: url("/images/fundo-brinquedo.svg")
  background-repeat: repeat-y
  background-size: 100% auto
  background-position: top center
  background-color: #ffffff

  &::before
    content: ""
    position: absolute
    inset: 0
    background: rgba(255,255,255,.62)
    z-index: 0

.container
  position: relative
  z-index: 1
  max-width: 1100px
  margin: 0 auto
  padding: 0 20px

.cabecalho-secao
  text-align: center
  margin-bottom: 34px

.mini-texto
  font-weight: 900
  color: #5a8bb0
  font-size: 13px
  letter-spacing: .6px
  margin-bottom: 10px
  text-transform: uppercase

.pontinho
  margin: 0 6px

.titulo-secao
  font-size: clamp(26px, 4vw, 38px)
  color: $ct-navy
  font-weight: 1000
  margin-bottom: 10px

.subtitulo-secao
  color: #587992
  font-weight: 800
  font-size: 16px
  margin-bottom: 26px

.chips-categorias
  display: inline-flex
  flex-wrap: wrap
  justify-content: center
  gap: 12px
  padding: 10px
  border-radius: 999px
  background: rgba(255, 255, 255, .80)
  border: 1px solid rgba(0,0,0,.05)
  box-shadow: 0 10px 25px rgba(0, 0, 0, .06)

.chip
  border: 0
  cursor: pointer
  padding: 10px 22px
  border-radius: 999px
  font-weight: 1000
  font-size: 14px
  letter-spacing: .2px
  transition: transform .18s ease, box-shadow .18s ease, filter .18s ease, opacity .18s ease
  user-select: none
  outline: none
  color: $ct-navy
  background: rgba(0,0,0,.06)

  &:hover
    transform: translateY(-2px)
    filter: saturate(1.05)

  &:focus-visible
    box-shadow: 0 0 0 4px rgba(43, 116, 235, .25)

/* cores por categoria */
.chip--todos
  background: rgba(0,0,0,.06)
  color: $ct-navy

.chip--grande
  background: $ct-teal
  color: #ffffff
  box-shadow: 0 10px 18px rgba(0, 194, 199, .25)

.chip--medio
  background: $ct-red
  color: #ffffff
  box-shadow: 0 10px 18px rgba(255, 59, 59, .20)

.chip--pequeno
  background: $ct-orange
  color: #ffffff
  box-shadow: 0 10px 18px rgba(255, 152, 0, .22)

.chip-ativo
  transform: translateY(-2px) scale(1.02)
  box-shadow: 0 16px 30px rgba(0,0,0,.12) !important
  filter: brightness(1.02) saturate(1.06)

.grade-brinquedos
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr))
  gap: 40px
  margin-top: 34px

.card-brinquedo
  background: #fff
  border-radius: 30px
  padding: 30px
  position: relative
  box-shadow: 0 15px 30px rgba(0, 0, 0, .08), 0 12px 0px #d9e8ff

  --rx: 0px
  --ry: 0px
  transform: translateX(var(--rx)) translateY(var(--ry))
  opacity: 1
  will-change: transform, opacity
  transition: transform .55s ease, opacity .55s ease, box-shadow .3s ease

  &:hover
    --ry: -8px
    box-shadow: 0 20px 40px rgba(0, 0, 0, .12), 0 16px 0px #d1e2ff

[data-reveal]
  opacity: 0
  --rx: -26px

.reveal-right[data-reveal]
  --rx: 26px

.is-inview[data-reveal]
  opacity: 1
  --rx: 0px

@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    --rx: 0px !important
    transition: none !important

.etiqueta
  position: absolute
  top: -15px
  left: -10px
  color: #fff
  padding: 10px 30px
  font-weight: 900
  font-size: 1rem
  border-radius: 20px 20px 20px 0
  box-shadow: 4px 4px 10px rgba(0, 0, 0, .15)
  z-index: 2

/* ✅ nomes de classe agora batem com a categoria */
.etiqueta-grande
  background: #00C4C9

.etiqueta-medio
  background: #FF3B3B

.etiqueta-pequeno
  background: #FF9A00

.miolo-card
  display: grid
  grid-template-columns: 1.4fr 1fr
  gap: 20px
  margin-bottom: 30px
  align-items: start

.textos-card
  padding-top: 35px

.nome-brinquedo
  font-size: 1.6rem
  font-weight: 1000
  color: $ct-navy
  margin-bottom: 15px
  line-height: 1.2

.separador-card
  height: 2px
  background: #eef2f7
  margin-bottom: 15px
  width: 100%
  border-radius: 2px

.infos-brinquedo
  list-style: none
  padding: 0
  margin: 0

  li
    display: flex
    align-items: center
    gap: 12px
    color: #555
    font-weight: 800
    font-size: 1rem
    margin-bottom: 10px

  .icone
    display: flex
    align-items: center
    gap: 12px

    img
      width: 20px
      height: 20px

.thumb-brinquedo
  display: flex
  justify-content: center
  align-items: center
  position: relative

  img
    max-width: 115%
    height: auto
    display: block
    filter: drop-shadow(0 15px 20px rgba(40, 100, 150, .25))
    transform: translate(10px, -25px)
    border-radius: 30px

.btn-card-whats
  display: flex
  align-items: center
  justify-content: center
  gap: 12px
  width: 100%
  padding: 16px
  background: #00a884
  color: #fff
  font-weight: 900
  font-size: 1.1rem
  text-decoration: none
  border-radius: 50px
  box-shadow: 0 6px 15px rgba(0, 168, 132, .25)
  transition: all .2s ease

  &:hover
    background: #009676
    transform: translateY(-3px)
    box-shadow: 0 10px 20px rgba(0, 168, 132, .35)

.icone-whats
  width: 22px
  height: 22px
  display: inline-block

@media (max-width: 640px)
  .chips-categorias
    padding: 10px
    border-radius: 24px

  .chip
    width: 100%
    max-width: 260px

  .card-brinquedo
    padding: 22px
    border-radius: 24px

  .miolo-card
    grid-template-columns: 1fr
    gap: 12px

  .textos-card
    padding-top: 26px

  .thumb-brinquedo img
    max-width: 100%
    transform: translate(0, -10px)

  .btn-card-whats
    font-size: 1rem
</style>
