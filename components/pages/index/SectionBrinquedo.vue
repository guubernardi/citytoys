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
        <!-- Varal de luzinhas por cima do título: só no Natal. -->
        <img
          v-if="temaAtivo"
          class="varal-luzes"
          src="/images/natal/brinquedos-varal-luzes.svg"
          alt=""
          width="640"
          height="90"
          loading="lazy"
          decoding="async"
        />

        <p class="olho-secao" id="brinquedos-kicker">
          <SvgIcone :nome="temaAtivo ? 'presente' : 'estrela'" :tamanho="16" />
          {{ temaAtivo ? copy.seloBrinquedos : 'Os queridinhos da festa' }}
        </p>

        <h2 class="titulo-secao" id="brinquedos-titulo">
          Veja nossos <span class="titulo-secao__destaque">brinquedos</span> mais alugados
        </h2>
        <p class="subtitulo-secao" id="brinquedos-subtitulo">Escolha uma categoria ou veja todos</p>
      </header>

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
              <SvgIcone nome="estrela" :tamanho="14" />
              {{ temaAtivo ? copy.seloDestaque : 'Mais alugado' }}
            </span>
          </div>

          <div class="corpo-card">
            <h3 class="nome-brinquedo" itemprop="name">{{ toy.name }}</h3>

            <ul class="infos-brinquedo" aria-label="Informações do brinquedo">
              <li>
                <SvgIcone class="icone-info" nome="emoji-feliz" :tamanho="16" />
                <span>{{ toy.ageText }}</span>
              </li>

              <li>
                <SvgIcone class="icone-info" nome="usuarios" :tamanho="16" />
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
              <SvgIcone class="icone-whats" nome="whatsapp" :tamanho="20" />
              Quero alugar
            </a>
          </div>
        </article>
      </div>

      <div v-if="temMais && !mostrarTodos" class="ver-todos-wrap">
        <button type="button" class="btn-ver-todos" @click="mostrarTodos = true">
          Ver todos os brinquedos ({{ brinquedosOrdenados.length }})
          <SvgIcone class="btn-ver-todos__seta" nome="chevron-baixo" :tamanho="18" />
        </button>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { dimensaoImagem } from '~/helpers/dimensoesImagens.js'
import { jsonLdCatalogoBrinquedos, scriptJsonLd } from '~/helpers/seo.js'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

// O layout da seção é o mesmo o ano todo. No Natal entram o varal de luzinhas,
// o olho "Especial de Natal", o selo "Top do Natal" nos destaques e o degradê
// vermelho → verde no "Ver todos". Fotos, etiquetas e o botão do WhatsApp ficam
// iguais: é aqui que a pessoa escolhe o brinquedo.
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
    id: 'toy-fliperama',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-medio',
    name: 'Fliperama',
    schemaCategory: 'Jogo eletrônico - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade: livre',
    ageText: 'Livre',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 2 crianças',
    capText: 'Até 2 crianças',
    imageSrc: '/images/fliperama.webp',
    imageAlt: 'Fliperama multijogos com dois controles, para alugar em festas no Rio de Janeiro'
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
// Tons da arte que não estão nos tokens globais.
$vermelho-claro: #e5343a
$vermelho-escuro: #b8202c
$sombra-card: rgba(18, 48, 98, .08)

.secao-brinquedos
  position: relative
  z-index: 5
  margin-top: -1px
  padding: 64px 0 110px
  background-color: #ffffff
  font-family: var(--fonte)
  /* os cards entram deslizando de lado (reveal): sem esse corte, o deslocamento
     inicial vaza da tela e cria rolagem horizontal no celular. "clip" não vira
     container de rolagem; "hidden" fica de reserva pra navegador antigo. */
  overflow-x: hidden
  overflow-x: clip

/* no Natal o varal ocupa o respiro de cima */
.secao-tema
  padding-top: 20px

.container
  position: relative
  z-index: 1
  max-width: calc(1280px + 2 * var(--container-px))
  margin: 0 auto
  padding: 0 var(--container-px)

/* ---- cabeçalho ---- */
.cabecalho-secao
  display: flex
  flex-direction: column
  align-items: center
  gap: 10px
  text-align: center

.varal-luzes
  display: block
  width: min(640px, 100%)
  height: auto
  margin-bottom: 16px

.olho-secao
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0
  color: var(--cor-vermelho)
  font-weight: 900
  font-size: 13px
  letter-spacing: .1em
  text-transform: uppercase

.titulo-secao
  margin: 0
  color: var(--cor-navy)
  font-weight: 900
  font-size: clamp(28px, 3.06vw, 44px)
  line-height: 1.2

.titulo-secao__destaque
  color: var(--cor-vermelho)

.subtitulo-secao
  margin: 0
  color: var(--cor-texto-suave)
  font-weight: 800
  font-size: 16.5px

/* ---- filtros ---- */
.chips-categorias
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 6px
  width: fit-content
  max-width: 100%
  margin: 26px auto 0
  padding: 8px
  border: 1px solid rgba(0,0,0,.07)
  border-radius: 999px
  background: #ffffff
  box-shadow: 0 6px 18px rgba(18,48,98,.06)

.chip
  padding: 9px 20px
  border: 0
  border-radius: 999px
  font-family: var(--fonte)
  font-weight: 900
  font-size: 14.5px
  line-height: 1.38
  cursor: pointer
  user-select: none
  transition: box-shadow .18s ease, filter .18s ease

  &:hover
    filter: brightness(.94)

  &:focus-visible
    outline: 3px solid rgba(43,116,235,.45)
    outline-offset: 2px

/* cores por categoria (as mesmas das etiquetas dos cards) */
.chip--todos
  background: rgba(0,0,0,.06)
  color: var(--cor-navy)
  --cor-chip: var(--cor-navy)

.chip--grande
  background: var(--cor-vermelho)
  color: #ffffff
  --cor-chip: var(--cor-vermelho)

.chip--medio
  background: var(--cor-verde-acao)
  color: #ffffff
  --cor-chip: var(--cor-verde-acao)

.chip--pequeno
  background: var(--cor-laranja)
  color: var(--cor-navy)
  --cor-chip: var(--cor-laranja)

/* categoria escolhida: anel da própria cor em volta */
.chip-ativo
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--cor-chip)

/* ---- grade ---- */
.grade-brinquedos
  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 25px
  margin-top: 26px

.card-brinquedo
  position: relative
  display: flex
  flex-direction: column
  overflow: hidden
  border: 1px solid var(--cor-borda)
  border-radius: 24px
  background: #ffffff
  box-shadow: 0 12px 30px $sombra-card

  --rx: 0px
  transform: translateX(var(--rx))
  opacity: 1
  will-change: transform, opacity
  transition: transform .55s ease, opacity .55s ease, box-shadow .3s ease

  /* hover só reforça a sombra: o card não se mexe */
  &:hover
    box-shadow: 0 22px 44px rgba(18,48,98,.16)

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
  aspect-ratio: 410 / 282
  overflow: hidden
  background: var(--cor-chip-fundo)

  img
    display: block
    width: 100%
    height: 100%
    object-fit: cover

.etiqueta
  position: absolute
  top: 16px
  left: 16px
  z-index: 2
  padding: 5px 12px
  border-radius: 999px
  font-weight: 900
  font-size: 13px
  line-height: 1.36

/* cores da etiqueta batem com os filtros */
.etiqueta-grande
  background: var(--cor-vermelho)
  color: #ffffff

.etiqueta-medio
  background: var(--cor-verde-acao)
  color: #ffffff

.etiqueta-pequeno
  background: var(--cor-laranja)
  color: var(--cor-navy)

.selo-destaque
  position: absolute
  top: 16px
  right: 14px
  z-index: 2
  display: inline-flex
  align-items: center
  gap: 6px
  padding: 5px 12px
  border-radius: 999px
  background: linear-gradient(90deg, var(--cor-dourado), #ffb347)
  color: var(--cor-navy)
  font-weight: 900
  font-size: 12.5px
  line-height: 1.36
  box-shadow: 0 6px 16px rgba(0,0,0,.18)

  :deep(.edusites-icone)
    color: var(--cor-vermelho)

.corpo-card
  flex: 1
  display: flex
  flex-direction: column
  gap: 14px
  padding: 20px 24px 24px

.nome-brinquedo
  margin: 0
  color: var(--cor-navy)
  font-weight: 900
  font-size: 22.5px
  line-height: 1.36

.infos-brinquedo
  display: flex
  flex-wrap: wrap
  gap: 8px
  margin: 0
  padding: 0
  list-style: none

  li
    display: inline-flex
    align-items: center
    gap: 6px
    padding: 7px 12px
    border-radius: 999px
    background: var(--cor-chip-fundo)
    color: var(--cor-chip-texto)
    font-weight: 800
    font-size: 14px
    line-height: 1.36

  .icone-info
    flex: 0 0 auto
    color: var(--cor-chip-texto)

.btn-card-whats
  margin-top: auto
  display: flex
  align-items: center
  justify-content: center
  gap: 10px
  width: 100%
  padding: 15px 28px
  border-radius: 999px
  background: var(--cor-verde-acao)
  color: #ffffff
  font-weight: 900
  font-size: 17px
  line-height: 1.36
  text-decoration: none
  filter: drop-shadow(0 8px 10px rgba(21,128,61,.22))
  transition: background .2s ease

  &:hover
    background: #116b33

  &:focus-visible
    outline: 3px solid rgba(21,128,61,.45)
    outline-offset: 3px

.icone-whats
  color: #ffffff

/* ---- ver todos ---- */
.ver-todos-wrap
  display: flex
  justify-content: center
  margin-top: 26px

// Degradê não anima no hover (o fundo "pulava"). Por isso o degradê fica num
// ::before por cima da cor de hover e só some com fade: hover só escurece.
.btn-ver-todos
  position: relative
  isolation: isolate
  display: inline-flex
  align-items: center
  gap: 10px
  padding: 15px 30px
  border: 0
  border-radius: 999px
  background: $vermelho-escuro
  color: #ffffff
  font-family: var(--fonte)
  font-weight: 900
  font-size: 16.5px
  line-height: 1.38
  cursor: pointer
  box-shadow: 0 8px 20px rgba(214,47,53,.25)

  &::before
    content: ''
    position: absolute
    inset: 0
    z-index: -1
    border-radius: inherit
    background: linear-gradient(90deg, $vermelho-claro, var(--cor-vermelho))
    transition: opacity .25s ease

  &:hover::before
    opacity: 0

  &:focus-visible
    outline: 3px solid var(--cor-dourado)
    outline-offset: 3px

/* no Natal o botão ganha o degradê vermelho → verde da arte (nó 21:1143 do Figma) */
.secao-tema .btn-ver-todos
  background: linear-gradient(90deg, $vermelho-escuro, var(--cor-verde-acao))

  &::before
    background: linear-gradient(90deg, $vermelho-claro, var(--cor-verde))

.btn-ver-todos__seta
  color: #ffffff

/* ---- responsivo ---- */
@media (max-width: 980px)
  .grade-brinquedos
    grid-template-columns: repeat(2, minmax(0, 1fr))
    gap: 20px

@media (max-width: 640px)
  .secao-brinquedos
    padding-bottom: 72px

  /* deslocamento menor do reveal no celular */
  [data-reveal]
    --rx: -14px

  .reveal-right[data-reveal]
    --rx: 14px

  .is-inview[data-reveal]
    --rx: 0px

  .chips-categorias
    border-radius: 24px

  .grade-brinquedos
    grid-template-columns: minmax(0, 1fr)
    max-width: 460px
    margin-left: auto
    margin-right: auto

  .corpo-card
    padding: 18px 18px 20px

  .nome-brinquedo
    font-size: 20px

  .btn-card-whats
    font-size: 16px

  .btn-ver-todos
    padding: 14px 24px
    font-size: 15.5px

@media (max-width: 480px)
  .titulo-secao
    font-size: 26px

  /* os quatro filtros cabem numa linha só a partir de 360px */
  .chips-categorias
    gap: 4px
    padding: 6px

  .chip
    padding: 8px 11px
    font-size: 13px
</style>
