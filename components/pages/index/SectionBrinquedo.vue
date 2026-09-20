<template>
  <section
    ref="secEl"
    class="secao-brinquedos"
    :class="{ 'secao-tema': temaAtivo }"
    id="brinquedos"
    aria-label="Brinquedos para alugar no Rio de Janeiro"
    data-anim="section-in"
  >
    <div class="container">
      <header class="cabecalho-secao" id="brinquedos-cabecalho" data-anim="fade-up">
        <!-- Na campanha: varal curto por cima do título, fazendo a ponte com o hero. -->
        <VaralBandeirinhas v-if="temaAtivo" class="varal-secao" :gomos="2" />

        <p v-if="temaAtivo" class="mini-texto mini-texto--tema" id="brinquedos-kicker">
          <SvgIcone nome="presente" :tamanho="16" />
          {{ copy.seloBrinquedos }}
        </p>
        <p v-else class="mini-texto" id="brinquedos-kicker">
          <span class="pontinho">•</span> Os queridinhos da festa <span class="pontinho">•</span>
        </p>

        <h2 class="titulo-secao" id="brinquedos-titulo">
          Veja nossos
          <LetrasColoridas v-if="temaAtivo" texto="brinquedos" fundo="claro" />
          <template v-else>brinquedos</template>
          mais alugados
        </h2>
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
          v-for="(toy, idx) in brinquedosVisiveis"
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

          <div class="foto-card">
            <img
              :src="toy.imageSrc"
              :alt="toy.imageAlt"
              :width="dimensaoImagem(toy.imageSrc).largura"
              :height="dimensaoImagem(toy.imageSrc).altura"
              loading="lazy"
              decoding="async"
              itemprop="image"
            />
            <span class="etiqueta" :class="toy.etiquetaClass">{{ toy.etiquetaLabel }}</span>
            <span v-if="toy.destaque" class="selo-destaque">
              <SvgIcone :nome="temaAtivo ? 'presente' : 'estrela'" :tamanho="14" />
              {{ temaAtivo ? copy.seloDestaque : 'Mais alugado' }}
            </span>
          </div>

          <div class="corpo-card">
            <h3 class="nome-brinquedo" itemprop="name">{{ toy.name }}</h3>

            <ul class="infos-brinquedo" aria-label="Informações do brinquedo">
              <li>
                <SvgIcone class="icone-info" nome="bebe" :tamanho="18" />
                <span>{{ toy.ageText }}</span>
              </li>

              <li>
                <SvgIcone class="icone-info" nome="usuarios" :tamanho="18" />
                <span>{{ toy.capText }}</span>
              </li>
            </ul>

            <a
              class="btn-card-whats"
              :id="`cta-${toy.id}`"
              :href="buildWhatsLink(toy.name)"
              target="_blank"
              rel="noopener"
              :aria-label="`Quero alugar ${toy.name} no WhatsApp`"
              data-anim="cta-pop"
            >
              <SvgIcone class="icone-whats" nome="whatsapp" :tamanho="22" />
              Quero alugar
            </a>
          </div>
        </article>
      </div>

      <div v-if="temMais && !mostrarTodos" class="ver-todos-wrap">
        <button type="button" class="btn-ver-todos" @click="mostrarTodos = true">
          Ver todos os brinquedos ({{ brinquedosOrdenados.length }})
          <svg v-if="temaAtivo" class="btn-ver-todos__seta" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>

    <div class="onda-brinquedo" aria-hidden="true">
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        <path d="M0,40 C420,120 1020,120 1440,40 L1440,120 L0,120 Z" fill="#eaf1fb" />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { dimensaoImagem } from '~/helpers/dimensoesImagens.js'
import { jsonLdCatalogoBrinquedos, scriptJsonLd } from '~/helpers/seo.js'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import LetrasColoridas from '~/components/global/tema/LetrasColoridas.vue'
import VaralBandeirinhas from '~/components/global/tema/VaralBandeirinhas.vue'

// Na temporada de Dia das Crianças a seção ganha moldura de festa (varal,
// título colorido, confete no fundo). Fotos, etiquetas e o botão do WhatsApp
// ficam iguais: é aqui que a pessoa escolhe o brinquedo.
const { temaAtivo, copy } = useTemaSazonal()

type CategoriaId = 'todos' | 'grande' | 'medio' | 'pequeno'

type Toy = {
  id: string
  cat: Exclude<CategoriaId, 'todos'>
  etiquetaLabel: 'Grande' | 'Médio' | 'Pequeno'
  etiquetaClass: 'etiqueta-grande' | 'etiqueta-medio' | 'etiqueta-pequeno'
  name: string
  schemaCategory: string
  destaque?: boolean

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
  // =========================
  // PEQUENOS
  // =========================
  {
    id: 'toy-area-baby',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Área Baby',
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade recomendada: até 5 anos',
    ageText: 'Até 5 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 6 crianças',
    capText: 'Até 6 crianças',
    imageSrc: '/images/area-baby.png',
    imageAlt: 'Área Baby — brinquedo inflável pequeno para festas no Rio de Janeiro'
  },
  {
    id: 'toy-castelinho',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Castelinho',
    destaque: true,
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade recomendada: até 6 anos',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/castelinho.webp',
    imageAlt: 'Castelinho — brinquedo inflável pequeno para festa infantil no Rio de Janeiro'
  },
  {
    id: 'toy-mini-circuito',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Mini Circuito',
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade recomendada: até 6 anos',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/mini-circuito.webp',
    imageAlt: 'Mini Circuito — brinquedo inflável pequeno para eventos e festas no Rio de Janeiro'
  },
  {
    id: 'toy-tigrinho',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Tigrinho',
    schemaCategory: 'Brinquedo inflável - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade recomendada: até 6 anos',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 crianças',
    capText: 'Até 4 crianças',
    imageSrc: '/images/tigrinho.webp',
    imageAlt: 'Tigrinho — brinquedo inflável pequeno para festas no Rio de Janeiro'
  },
  {
    id: 'toy-pula-pula-244',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Pula-Pula 2,44',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade recomendada: até 7 anos',
    ageText: 'Até 7 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 2 crianças',
    capText: 'Até 2 crianças',
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
    ageAlt: 'Idade recomendada: até 12 anos',
    ageText: 'Até 12 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/pula-pula-3,05.webp',
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
    ageAlt: 'Idade recomendada: até 5 anos',
    ageText: 'Até 5 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/piscina-bolinha.webp',
    imageAlt: 'Piscina de Bolinha — brinquedo pequeno para festa infantil no Rio de Janeiro'
  },
  {
    id: 'toy-piscina-dino',
    cat: 'pequeno', 
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-pequeno',
    name: 'Piscina Dino',
    schemaCategory: 'Brinquedo - Pequeno',
    ageIcon: idadeIcon,
    ageAlt: 'Idade recomendada: até 6 anos',
    ageText: 'Até 6 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/dino.webp',
    imageAlt: 'Piscina Dino — brinquedo pequeno para festa no Rio de Janeiro'
  },
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
    capAlt: 'Capacidade: até 4 crianças',
    capText: 'Até 4 crianças',
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
    capAlt: 'Capacidade: até 2 crianças',
    capText: 'Até 2 crianças',
    imageSrc: '/images/air-game.webp',
    imageAlt: 'Air Game — brinquedo pequeno para festas no Rio de Janeiro'
  },

  // =========================
  // MÉDIOS
  // =========================
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
    imageAlt: 'Futebol de Sabão 4x8 — brinquedo inflável médio para eventos no Rio de Janeiro'
  },
  {
    id: 'toy-ping-pong',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Ping Pong',
    schemaCategory: 'Mesa de jogos - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade: livre',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 crianças',
    capText: 'Até 4 crianças',
    imageSrc: '/images/ping-pong.webp',
    imageAlt: 'Mesa de ping pong com raquetes e bolinhas, para alugar em festas no Rio de Janeiro'
  },
  {
    id: 'toy-sinuca',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Sinuca',
    schemaCategory: 'Mesa de jogos - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade: livre',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 crianças',
    capText: 'Até 4 crianças',
    imageSrc: '/images/sinuca.webp',
    imageAlt: 'Mesa de sinuca com tacos e bolas, para alugar em festas no Rio de Janeiro'
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
    imageAlt: 'Guerra de Cotonete — brinquedo inflável médio para festas no Rio de Janeiro'
  },
  {
    id: 'toy-toboga-colorex',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Tobogã Colorex',
    destaque: true,
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Até 10 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/colorex2.webp',
    imageAlt: 'Tobogã Colorex — escorregador inflável médio para eventos no Rio de Janeiro'
  },
  {
    id: 'toy-toboga-premium',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Tobogã Premium',
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Até 12 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/premium.webp',
    imageAlt: 'Tobogã Premium — escorregador inflável médio para eventos no Rio de Janeiro'
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
    imageAlt: 'Toboágua — brinquedo inflável médio com água para festas no Rio de Janeiro'
  },

  // =========================
  // GRANDES
  // =========================
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
    id: 'toy-toboga-gigante',
    cat: 'grande',
    etiquetaLabel: 'Grande',
    etiquetaClass: 'etiqueta-grande',
    name: 'Tobogã Gigante',
    destaque: true,
    schemaCategory: 'Brinquedo inflável - Grande',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 3+',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 4 crianças',
    capText: 'Até 4 crianças',
    imageSrc: '/images/gigante.webp',
    imageAlt: 'Tobogã Gigante — escorregador inflável grande para festas no Rio de Janeiro'
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
    imageAlt: 'Touro Mecânico — atração grande para festas e eventos no Rio de Janeiro'
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
    capAlt: 'Capacidade: até 4 crianças',
    capText: 'Até 4 crianças',
    imageSrc: '/images/legolandia.webp', 
    imageAlt: 'Legolândia — brinquedo grande para festa infantil no Rio de Janeiro'
  }
])

// Catálogo completo em JSON-LD — independente do filtro visível na tela,
// para o Google enxergar todos os brinquedos e não só a categoria ativa.
useHead({
  script: [scriptJsonLd(jsonLdCatalogoBrinquedos(brinquedos.value), 'ld-catalogo-brinquedos')]
})

const brinquedosFiltrados = computed(() => {
  if (activeCat.value === 'todos') return brinquedos.value
  return brinquedos.value.filter((t) => t.cat === activeCat.value)
})

// destaques primeiro -> vitrine inicial ganha variedade e prova social
const brinquedosOrdenados = computed(() =>
  [...brinquedosFiltrados.value].sort((a, b) => Number(b.destaque ?? false) - Number(a.destaque ?? false))
)

const LIMITE_INICIAL = 6
const mostrarTodos = ref(false)

const brinquedosVisiveis = computed(() =>
  mostrarTodos.value ? brinquedosOrdenados.value : brinquedosOrdenados.value.slice(0, LIMITE_INICIAL)
)

const temMais = computed(() => brinquedosOrdenados.value.length > LIMITE_INICIAL)

// ao trocar de categoria, recolhe de volta pros 6 iniciais
watch(activeCat, () => {
  mostrarTodos.value = false
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

watch(brinquedosVisiveis, async () => {
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
  --onda-h: clamp(56px, 8vw, 110px)
  padding: 70px 0 calc(30px + var(--onda-h))
  background-color: #ffffff

.onda-brinquedo
  position: absolute
  left: 0
  right: 0
  bottom: -1px
  z-index: 1
  line-height: 0
  pointer-events: none

  svg
    display: block
    width: 100%
    height: var(--onda-h)

.container
  position: relative
  z-index: 1
  max-width: var(--largura-max)
  margin: 0 auto
  padding: 0 var(--container-px)

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
    transform: scale(1.05)
    filter: brightness(.96) saturate(1.06)

  &:focus-visible
    box-shadow: 0 0 0 4px rgba(43, 116, 235, .25)

/* cores por categoria */
.chip--todos
  background: rgba(0,0,0,.06)
  color: $ct-navy

.chip--grande
  background: $ct-teal
  color: #ffffff

.chip--medio
  background: $ct-red
  color: #ffffff

.chip--pequeno
  background: $ct-orange
  color: #ffffff

.chip-ativo
  transform: scale(1.04)
  filter: brightness(1.02) saturate(1.06)

.grade-brinquedos
  display: grid
  grid-template-columns: repeat(auto-fit, minmax(min(340px, 100%), 1fr))
  gap: 28px
  margin-top: 34px

.card-brinquedo
  position: relative
  display: flex
  flex-direction: column
  background: #fff
  border: 1px solid #eef2f7
  border-radius: 24px
  overflow: hidden
  box-shadow: 0 12px 30px rgba(18, 48, 98, .08)

  --rx: 0px
  --ry: 0px
  transform: translateX(var(--rx)) translateY(var(--ry))
  opacity: 1
  will-change: transform, opacity
  transition: transform .55s ease, opacity .55s ease, box-shadow .3s ease, border-color .3s ease

  &:hover
    box-shadow: 0 22px 44px rgba(18, 48, 98, .16)
    border-color: #e3ebf5

    .foto-card img
      transform: scale(1.05)

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

.foto-card
  position: relative
  width: 100%
  aspect-ratio: 16 / 11
  overflow: hidden
  background: #f4f7fb

  img
    width: 100%
    height: 100%
    object-fit: cover
    display: block
    transition: transform .4s ease

.etiqueta
  position: absolute
  top: 14px
  left: 14px
  color: #fff
  padding: 7px 16px
  font-weight: 900
  font-size: .82rem
  letter-spacing: .3px
  border-radius: 999px
  box-shadow: 0 6px 16px rgba(0, 0, 0, .18)
  z-index: 2

/* cores da etiqueta batem com os chips de categoria */
.etiqueta-grande
  background: $ct-teal

.etiqueta-medio
  background: $ct-red

.etiqueta-pequeno
  background: $ct-orange

.selo-destaque
  position: absolute
  top: 14px
  right: 14px
  z-index: 2
  display: inline-flex
  align-items: center
  gap: 6px
  background: #ffd23f
  color: #052a54
  font-weight: 900
  font-size: .76rem
  letter-spacing: .2px
  padding: 6px 12px
  border-radius: 999px
  box-shadow: 0 6px 16px rgba(0, 0, 0, .18)

.corpo-card
  display: flex
  flex-direction: column
  gap: 16px
  padding: 22px 22px 24px
  flex: 1

.nome-brinquedo
  font-size: 1.4rem
  font-weight: 1000
  color: $ct-navy
  line-height: 1.15
  margin: 0

.infos-brinquedo
  list-style: none
  padding: 0
  margin: 0
  display: flex
  flex-wrap: wrap
  gap: 10px

  li
    display: inline-flex
    align-items: center
    gap: 8px
    background: #f4f7fb
    color: #4a5b70
    font-weight: 800
    font-size: .9rem
    padding: 8px 12px
    border-radius: 999px

  .icone-info
    color: $ct-navy
    flex: 0 0 auto

.btn-card-whats
  margin-top: auto
  display: flex
  align-items: center
  justify-content: center
  gap: 10px
  width: 100%
  padding: 14px
  background: #43d38d
  color: #fff
  font-weight: 900
  font-size: 1.05rem
  text-decoration: none
  border-radius: 999px
  transition: background .2s ease, transform .2s ease

  &:hover
    background: #ff3b3b

.icone-whats
  width: 22px
  height: 22px
  display: inline-block
  color: #fff

.ver-todos-wrap
  display: flex
  justify-content: center
  margin-top: 44px

.btn-ver-todos
  cursor: pointer
  display: inline-flex
  align-items: center
  gap: 8px
  border: 2px solid $ct-blue
  background: #fff
  color: $ct-blue
  font-weight: 900
  font-size: 1rem
  padding: 14px 32px
  border-radius: 999px
  transition: background .2s ease, color .2s ease

  &:hover
    background: $ct-blue
    color: #fff

/* ---- tema sazonal (Dia das Crianças) ---- */
/* Tudo abaixo depende da classe .secao-tema na <section>, que entra e sai
   junto com a campanha (composables/useTemaSazonal.ts). */

/* Confete bem clarinho no fundo branco: aparece entre os cards, nunca por
   cima das fotos (os cards têm fundo próprio). */
.secao-tema
  background-image: var(--tema-confete-fundo)
  background-size: 240px 240px

/* Respiro liso atrás do cabeçalho, que se desfaz nas bordas: o confete do
   fundo fica em volta do título e dos filtros, nunca atrás das letras. */
.secao-tema .cabecalho-secao
  background: radial-gradient(ellipse 70% 90% at center, #ffffff 62%, rgba(255,255,255,0) 100%)

/* corda cinza-azulada: a branca padrão sumiria no fundo branco */
.varal-secao
  --varal-corda: #b9c7d8
  width: min(760px, 92%)
  margin: 0 auto 14px

.mini-texto--tema
  display: inline-flex
  align-items: center
  gap: 6px
  color: #d62f35

.secao-tema .selo-destaque
  background: linear-gradient(90deg, #ffd23f, #ffb347)

/* Borda colorida no hover. A borda tem 2px transparentes o tempo todo, então
   trocar a cor não muda o tamanho do card nem empurra a grade. */
.secao-tema .card-brinquedo
  border: 2px solid transparent
  background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(#eef2f7, #eef2f7) border-box

  &:hover
    border-color: transparent
    background: linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(120deg, #ff3b3b, #ffd23f, #2ecc71, #2b74eb, #a45cff) border-box

/* "Ver todos" colorido, correndo como a faixa do topo. Sem amarelo no
   gradiente: o texto é branco e precisa ler bem.
   No hover ele "pula": sobe com efeito de mola, ganha brilho colorido em
   volta, um reflexo atravessa o botão e a setinha quica pra baixo (é ali
   embaixo que a lista abre). */
.secao-tema .btn-ver-todos
  position: relative
  overflow: hidden
  border-color: transparent
  background: linear-gradient(90deg, #2b74eb, #a45cff, #ff3b3b, #2b74eb)
  background-size: 200% 100%
  color: #ffffff
  box-shadow: 0 6px 16px rgba(43,116,235,.22)
  animation: tema-correr-gradiente 10s linear infinite
  transition: transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s ease

  /* reflexo de luz, escondido à esquerda até o hover */
  &::after
    content: ""
    position: absolute
    top: 0
    bottom: 0
    left: -60%
    width: 55%
    background: linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.7) 50%, rgba(255,255,255,0) 100%)
    transform: skewX(-20deg)
    pointer-events: none

  &:hover
    background: linear-gradient(90deg, #2b74eb, #a45cff, #ff3b3b, #2b74eb)
    background-size: 200% 100%
    color: #ffffff
    transform: translateY(-4px) scale(1.05)
    box-shadow: 0 14px 30px rgba(164,92,255,.38), 0 6px 14px rgba(255,59,59,.25)

    &::after
      animation: btn-reflexo .8s ease

    .btn-ver-todos__seta
      animation: seta-quicar .9s ease-in-out infinite

  /* no celular não tem hover: o toque dá uma afundadinha de resposta */
  &:active
    transform: translateY(-1px) scale(.97)

  &:focus-visible
    outline: 3px solid #ffd23f
    outline-offset: 3px

.btn-ver-todos__seta
  width: 18px
  height: 18px

  path
    fill: none
    stroke: currentColor
    stroke-width: 2.6
    stroke-linecap: round
    stroke-linejoin: round

@keyframes btn-reflexo
  from
    left: -60%
  to
    left: 120%

@keyframes seta-quicar
  0%, 100%
    transform: translateY(0)
  50%
    transform: translateY(4px)

@media (prefers-reduced-motion: reduce)
  .secao-tema .btn-ver-todos
    animation: none
    transition: box-shadow .2s ease

    &:hover
      transform: none

      &::after,
      .btn-ver-todos__seta
        animation: none

@media (max-width: 640px)
  .chips-categorias
    padding: 10px
    border-radius: 24px

  .chip
    width: 100%
    max-width: 260px

  .corpo-card
    padding: 18px 18px 20px

  .nome-brinquedo
    font-size: 1.25rem

  .btn-card-whats
    font-size: 1rem
</style>
