<template>
  <div id="pagina-combo" class="pagina-combo">
    <header class="cabecalho" aria-label="Monte seu combo City Toys">
      <div class="cabecalho__clip" aria-hidden="true">
        <div class="cabecalho__fundo"></div>

        <div class="cabecalho__decoracoes">
          <div class="decoracao decoracao-1"></div>
          <div class="decoracao decoracao-2"></div>
        </div>
      </div>

      <div class="container cabecalho__conteudo">
        <span class="selo-promocao animar-entrada" id="selo-promocao"> 🎉 Promoção Segunda a Quinta </span>

        <h1 class="titulo-principal animar-entrada" id="titulo-pagina">
          Monte seu <span class="texto-destaque">Combo</span> da Semana
        </h1>

        <p class="preco animar-entrada" id="preco-combo">Combo fixo por {{ precoBRL }}</p>

        <p class="descricao animar-entrada" id="descricao-combo">
          Escolha primeiro um brinquedo <strong class="texto-destaque">Grande</strong>, depois um
          <strong class="texto-destaque">Médio</strong> e por último um
          <strong class="texto-destaque">Pequeno</strong>. Garantimos a melhor combinação de diversão para sua festa!
        </p>

        <div class="linha-data animar-entrada" id="linha-data">
          <label class="rotulo-data" :for="calendarBtnId">Data do evento (Segunda a Quinta)</label>

          <div class="campo-data">
            <button
              ref="calendarBtn"
              :id="calendarBtnId"
              class="date-trigger"
              type="button"
              :aria-expanded="calAberto"
              aria-haspopup="dialog"
              aria-controls="calendar-popover"
              @click="toggleCalendar"
            >
              <span class="date-trigger__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 2v2M17 2v2M3.5 9.5h17M6 6h12a2.5 2.5 0 0 1 2.5 2.5v11A2.5 2.5 0 0 1 18 22H6a2.5 2.5 0 0 1-2.5-2.5v-11A2.5 2.5 0 0 1 6 6Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                  />
                </svg>
              </span>

              <span class="date-trigger__text">
                <template v-if="!dataEvento">Selecione uma data</template>
                <template v-else>{{ dataLabel }}</template>
              </span>

              <span class="date-trigger__caret" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9l6 6 6-6"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </button>

            <span class="chip-data" :class="statusDataClasse">
              <template v-if="!dataEvento">Escolha uma data</template>

              <template v-else-if="diaValido">
                Válido
                <svg class="chip-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </template>

              <template v-else>
                Somente de Segunda a Quinta
                <svg class="chip-icon chip-icon--x" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M18 6L6 18M6 6l12 12"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                  />
                </svg>
              </template>
            </span>
          </div>

          <p class="microtexto" v-if="dataEvento && !diaValido">
            Esse combo é válido apenas de <strong>segunda a quinta</strong>. Troca a data e fechou 😄
          </p>

          <!-- Aviso específico do Touro (Junho/Julho) -->
          <p class="microtexto" v-if="dataEvento && touroBloqueadoNoMes">
            Observação: o <strong>Touro Mecânico</strong> fica indisponível em <strong>Junho</strong> e
            <strong>Julho</strong>.
          </p>
        </div>

        <div class="passos animar-entrada" id="passos">
          <div class="passo" :class="{ ativo: !comboCompleto }" id="passo-1">1. Escolha os brinquedos</div>

          <div class="linha-passo" aria-hidden="true"></div>

          <div class="passo" :class="{ ativo: comboCompleto }" id="passo-2">2. Finalizar no WhatsApp</div>
        </div>
      </div>

      <div class="onda-cabecalho" aria-hidden="true">
        <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
          <path
            d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,50 1440,40 L1440,80 L0,80 Z"
            fill="#F8FAFC"
          />
        </svg>
      </div>
    </header>

    <Teleport to="body">
      <button
        v-if="calAberto"
        class="cal-backdrop"
        type="button"
        aria-label="Fechar calendário"
        @click="fecharCalendar"
      ></button>

      <div
        v-if="calAberto"
        ref="calEl"
        id="calendar-popover"
        class="cal cal--portal"
        role="dialog"
        aria-label="Calendário"
        :style="calStyle"
      >
        <div class="cal__topo">
          <button class="cal__nav" type="button" aria-label="Mês anterior" @click="prevMonth">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>

          <div class="cal__mes" aria-live="polite">
            <span class="cal__mesTxt">{{ mesLabel }}</span>
            <span class="cal__subTxt">Escolha qualquer dia (o combo só vale de Segunda a Quinta)</span>
          </div>

          <button class="cal__nav" type="button" aria-label="Próximo mês" @click="nextMonth">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>

        <div class="cal__dow" aria-hidden="true">
          <span v-for="w in semanaLabels" :key="w" class="cal__dowItem">{{ w }}</span>
        </div>

        <div class="cal__grid" role="grid" aria-label="Dias do mês">
          <template v-for="(cell, i) in calendarCells" :key="i">
            <span v-if="!cell || !cell.iso" class="cal__blank" aria-hidden="true"></span>

            <button
              v-else
              type="button"
              class="cal__day"
              role="gridcell"
              :class="{
                'is-out': !cell.inMonth,
                'is-today': cell.isToday,
                'is-selected': cell.isSelected,
                'is-disabled': cell.isDisabled,
                'is-invalid': !cell.isWeekdayOk
              }"
              :disabled="cell.isDisabled"
              :aria-label="cell.ariaLabel"
              @click="selecionarDia(cell.iso)"
            >
              {{ cell.day }}
            </button>
          </template>
        </div>

        <div class="cal__rodape">
          <button class="cal__btn" type="button" @click="irHoje">Hoje</button>
          <button class="cal__btn cal__btn--ghost" type="button" @click="limparData">Limpar</button>
        </div>
      </div>
    </Teleport>

    <main class="principal" aria-label="Seleção do combo">
      <div class="abas-filtro container" id="abas-filtro" role="tablist" aria-label="Etapas do combo">
        <button
          class="aba"
          type="button"
          role="tab"
          :class="{ ativa: filtroAtivo === 'grande', concluida: !!selecionados.grande }"
          aria-controls="grade-brinquedos"
          @click="definirFiltro('grande')"
        >
          <img src="/images/box.svg" alt="Icone Caixa" width="25px" />
          1º Grande
        </button>

        <button
          class="aba"
          type="button"
          role="tab"
          :class="{ ativa: filtroAtivo === 'medio', concluida: !!selecionados.medio }"
          aria-controls="grade-brinquedos"
          @click="definirFiltro('medio')"
        >
          <img src="/images/box.svg" alt="Icone Caixa" width="25px" />
          2º Médio
        </button>

        <button
          class="aba"
          type="button"
          role="tab"
          :class="{ ativa: filtroAtivo === 'pequeno', concluida: !!selecionados.pequeno }"
          aria-controls="grade-brinquedos"
          @click="definirFiltro('pequeno')"
        >
          <img src="/images/box.svg" alt="Icone Caixa" width="25px" />
          3º Pequeno
        </button>
      </div>

      <div class="cabecalho-secao container" id="cabecalho-secao">
        <h2 class="titulo-secao">Escolha os brinquedos do seu combo</h2>
        <p class="subtitulo-secao">Selecione <strong>1</strong> brinquedo de cada categoria para completar o combo.</p>
      </div>

      <div class="grade-brinquedos container" id="grade-brinquedos" role="tabpanel" aria-label="Lista de brinquedos">
        <article
          v-for="(b, idx) in brinquedosFiltrados"
          :key="b.id"
          class="card"
          :class="{
            selecionado: estaSelecionado(b),
            'is-bloqueado': brinquedoIndisponivel(b)
          }"
          :style="{ animationDelay: `${idx * 0.05}s` }"
        >
          <div class="card__imagem">
            <img :src="b.imageSrc" :alt="b.imageAlt" loading="lazy" decoding="async" />

            <div v-if="estaSelecionado(b)" class="card__check" aria-label="Selecionado">
              <img src="/images/check.svg" alt="Icone Check" />
            </div>

            <span class="etiqueta" :class="b.etiquetaClass" aria-hidden="true">{{ b.etiquetaLabel }}</span>
          </div>

          <div class="card__info">
            <h3 class="card__titulo">{{ b.name }}</h3>

            <div class="card__meta">
              <span class="tag tag-idade">
                <img class="tag__icone" :src="b.ageIcon" :alt="b.ageAlt" loading="lazy" />
                {{ b.ageText }}
              </span>

              <span class="tag tag-capacidade">
                <img class="tag__icone" :src="b.capIcon" :alt="b.capAlt" loading="lazy" />
                {{ b.capText }}
              </span>

              <span class="tag tag-tamanho">
                <img src="/images/regua.svg" alt="Icone Régua" />
                {{ rotuloCategoria[b.cat] }}
              </span>
            </div>

            <button
              class="btn-selecionar"
              :class="{ remover: estaSelecionado(b) }"
              type="button"
              :disabled="brinquedoIndisponivel(b)"
              @click="alternarSelecao(b)"
            >
              <template v-if="estaSelecionado(b)">❌ Remover</template>
              <template v-else>Selecionar</template>
            </button>

            <p v-if="brinquedoIndisponivel(b)" class="card__aviso">Indisponível em Junho e Julho</p>
          </div>
        </article>
      </div>
    </main>

    <Teleport to="body">
      <aside class="barra-carrinho" id="barra-carrinho" aria-label="Resumo do combo">
        <div class="carrinho__info">
          <span class="carrinho__contador" id="contador-carrinho">
            <img src="/images/carrinho.svg" alt="" width="25px" height="30px" />
            {{ textoCarrinho }}
          </span>

          <div class="carrinho__checks" aria-label="Categorias selecionadas">
            <span class="check" :class="{ preenchido: !!selecionados.grande }" id="check-grande">Grande</span>
            <span class="check" :class="{ preenchido: !!selecionados.medio }" id="check-medio">Médio</span>
            <span class="check" :class="{ preenchido: !!selecionados.pequeno }" id="check-pequeno">Pequeno</span>
          </div>
        </div>

        <a
          class="btn-whats"
          id="btn-whats"
          :class="{ pronto: podeFinalizar }"
          :href="podeFinalizar ? linkWhats : '#'"
          target="_blank"
          rel="noopener"
          @click="handleWhatsClick"
        >
          <template v-if="podeFinalizar">
            <img src="/images/whatsapp.svg" alt="Icone WhastsApp" width="20px" />
            Finalizar no WhatsApp
          </template>
          <template v-else>Aguardando seleção...</template>
        </a>
      </aside>
    </Teleport>

    <div class="onda-rodape" aria-hidden="true">
      <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
        <path d="M0,40 C360,0 720,80 1080,40 C1260,20 1380,30 1440,40 L1440,80 L0,80 Z" fill="#2D3A7A" />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useHead } from 'nuxt/app'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

useHead({
  title: 'Montar Combo - City Toys'
})

type Categoria = 'grande' | 'medio' | 'pequeno'

type Brinquedo = {
  id: string
  cat: Categoria
  etiquetaLabel: string
  etiquetaClass: string
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

const idadeIcon = '/icons/idade.svg'
const capacidadeIcon = '/icons/capacidade.svg'

const WHATS_NUMERO = '5521984848699'
const PRECO_FIXO = 1500

const rotuloCategoria: Record<Categoria, string> = {
  grande: 'Grande',
  medio: 'Médio',
  pequeno: 'Pequeno'
}

const ordemCategorias: Categoria[] = ['grande', 'medio', 'pequeno']
const filtroAtivo = ref<Categoria>('grande')

const calendarBtnId = 'data-evento'
const calAberto = ref(false)

const calendarBtn = ref<HTMLElement | null>(null)
const calEl = ref<HTMLElement | null>(null)
const calStyle = ref<Record<string, string>>({})

const dataEvento = ref<string>('')

const MES_OUTUBRO = 9
function isOutubro(m0: number) {
  return m0 === MES_OUTUBRO
}

/** soma meses pulando Outubro */
function addMonthsSkippingOct(delta: number) {
  let d = new Date(viewYear.value, viewMonth.value, 1)
  d.setMonth(d.getMonth() + delta)

  if (isOutubro(d.getMonth())) {
    d.setMonth(d.getMonth() + (delta >= 0 ? 1 : -1))
  }

  viewMonth.value = d.getMonth()
  viewYear.value = d.getFullYear()
}

const dataMinima = computed(() => {
  const hoje = new Date()
  const yyyy = hoje.getFullYear()
  const mm = String(hoje.getMonth() + 1).padStart(2, '0')
  const dd = String(hoje.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

const minDateObj = computed(() => new Date(`${dataMinima.value}T12:00:00`))

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function isoFromYMD(y: number, m0: number, d: number) {
  return `${y}-${pad2(m0 + 1)}-${pad2(d)}`
}

function parseISO(iso: string) {
  return new Date(`${iso}T12:00:00`)
}

function monthFromISO(iso: string) {
  return parseISO(iso).getMonth()
}

const dataLabel = computed(() => {
  if (!dataEvento.value) return ''
  const d = parseISO(dataEvento.value)
  const dd = pad2(d.getDate())
  const mm = pad2(d.getMonth() + 1)
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
})

const diaValido = computed(() => {
  if (!dataEvento.value) return false
  const d = parseISO(dataEvento.value)
  const dia = d.getDay()
  return dia >= 1 && dia <= 4
})

const statusDataClasse = computed(() => {
  if (!dataEvento.value) return 'pendente'
  return diaValido.value ? 'ok' : 'ruim'
})

const meses = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]

const semanaLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

const viewMonth = ref<number>(new Date().getMonth())
const viewYear = ref<number>(new Date().getFullYear())

function ensureNotOctoberOnView() {
  if (isOutubro(viewMonth.value)) {
    viewMonth.value = 10 // Novembro
  }
}

function syncViewToSelected() {
  if (!dataEvento.value) return

  if (isOutubro(monthFromISO(dataEvento.value))) {
    dataEvento.value = ''
    ensureNotOctoberOnView()
    return
  }

  const d = parseISO(dataEvento.value)
  viewMonth.value = d.getMonth()
  viewYear.value = d.getFullYear()
  ensureNotOctoberOnView()
}

watch(dataEvento, () => {
  if (calAberto.value) syncViewToSelected()
})

const mesLabel = computed(() => `${meses[viewMonth.value]} ${viewYear.value}`)

function prevMonth() {
  addMonthsSkippingOct(-1)
  if (calAberto.value) nextTick(updateCalPos)
}

function nextMonth() {
  addMonthsSkippingOct(1)
  if (calAberto.value) nextTick(updateCalPos)
}

type CalCell = {
  day: number
  iso: string
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  isWeekdayOk: boolean
  ariaLabel: string
}

const calendarCells = computed<(CalCell | null)[]>(() => {
  const y = viewYear.value
  const m = viewMonth.value

  if (isOutubro(m)) return Array.from({ length: 42 }, () => null)

  const first = new Date(y, m, 1)
  const daysInMonth = new Date(y, m + 1, 0).getDate()

  const shift = (first.getDay() + 6) % 7
  const total = 42

  const now = new Date()
  const todayISO = isoFromYMD(now.getFullYear(), now.getMonth(), now.getDate())

  const out: (CalCell | null)[] = []
  for (let i = 0; i < total; i++) {
    const dayNum = i - shift + 1
    if (dayNum < 1 || dayNum > daysInMonth) {
      out.push(null)
      continue
    }

    const iso = isoFromYMD(y, m, dayNum)
    const d = parseISO(iso)

    const isDisabled = d.getTime() < minDateObj.value.getTime() || isOutubro(d.getMonth())
    const dow = d.getDay()
    const isWeekdayOk = dow >= 1 && dow <= 4

    out.push({
      day: dayNum,
      iso,
      inMonth: true,
      isToday: iso === todayISO,
      isSelected: iso === dataEvento.value,
      isDisabled,
      isWeekdayOk,
      ariaLabel: `${dayNum} de ${meses[m]} de ${y}`
    })
  }

  return out
})

function selecionarDia(iso: string) {
  if (isOutubro(monthFromISO(iso))) return
  dataEvento.value = iso
  fecharCalendar()
}

function irHoje() {
  const now = new Date()

  if (isOutubro(now.getMonth())) {
    const iso = isoFromYMD(now.getFullYear(), 10, 1)
    const d = parseISO(iso)
    dataEvento.value = d.getTime() < minDateObj.value.getTime() ? dataMinima.value : iso
    fecharCalendar()
    return
  }

  const iso = isoFromYMD(now.getFullYear(), now.getMonth(), now.getDate())
  const d = parseISO(iso)
  dataEvento.value = d.getTime() < minDateObj.value.getTime() ? dataMinima.value : iso
  fecharCalendar()
}

function limparData() {
  dataEvento.value = ''
  fecharCalendar()
}

let rafId = 0

function updateCalPos() {
  const btn = calendarBtn.value
  const cal = calEl.value
  if (!btn) return

  const r = btn.getBoundingClientRect()
  const vw = window.innerWidth
  const vh = window.innerHeight

  const pad = 12
  const width = Math.min(360, Math.floor(vw * 0.92))

  let left = r.left
  if (left + width > vw - pad) left = vw - width - pad
  if (left < pad) left = pad

  const h = cal?.getBoundingClientRect().height || 420
  const GAP_DOWN = 14 // mais embaixo (era 10)
  const GAP_UP = 2
  const downTop = r.bottom + GAP_DOWN
  const upTop = r.top - GAP_UP - h

  let top = downTop
  if (downTop + h > vh - pad) top = upTop
  top = Math.max(pad, Math.min(top, vh - pad - h))

  calStyle.value = {
    position: 'fixed',
    left: `${Math.round(left)}px`,
    top: `${Math.round(top)}px`,
    width: `${width}px`,
    zIndex: '100000'
  }
}

function onWinScrollResize() {
  if (!calAberto.value) return
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(updateCalPos)
}

function abrirCalendar() {
  if (calAberto.value) return
  calAberto.value = true

  ensureNotOctoberOnView()
  syncViewToSelected()

  nextTick(() => {
    updateCalPos()
    window.addEventListener('scroll', onWinScrollResize, { passive: true })
    window.addEventListener('resize', onWinScrollResize, { passive: true })
  })
}

function fecharCalendar() {
  calAberto.value = false
  window.removeEventListener('scroll', onWinScrollResize)
  window.removeEventListener('resize', onWinScrollResize)
}

function toggleCalendar() {
  calAberto.value ? fecharCalendar() : abrirCalendar()
}

function onDocPointerDown(e: PointerEvent) {
  if (!calAberto.value) return
  const t = e.target as Node

  const insideBtn = !!calendarBtn.value && calendarBtn.value.contains(t)
  const insideCal = !!calEl.value && calEl.value.contains(t)

  if (!insideBtn && !insideCal) fecharCalendar()
}

function onDocKeyDown(e: KeyboardEvent) {
  if (!calAberto.value) return
  if (e.key === 'Escape') fecharCalendar()
}

onMounted(() => {
  ensureNotOctoberOnView()
  document.addEventListener('pointerdown', onDocPointerDown)
  document.addEventListener('keydown', onDocKeyDown)
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
  document.removeEventListener('keydown', onDocKeyDown)
  window.removeEventListener('scroll', onWinScrollResize)
  window.removeEventListener('resize', onWinScrollResize)
})

const MESES_BLOQUEADOS_TOURO = new Set([5, 6])

const mesSelecionado = computed<number | null>(() => {
  if (!dataEvento.value) return null
  return parseISO(dataEvento.value).getMonth()
})

const touroBloqueadoNoMes = computed(() => {
  return mesSelecionado.value !== null && MESES_BLOQUEADOS_TOURO.has(mesSelecionado.value)
})

function brinquedoIndisponivel(b: Brinquedo) {
  if (b.id !== 'toy-touro-mecanico') return false
  return touroBloqueadoNoMes.value
}

watch([dataEvento, touroBloqueadoNoMes], () => {
  if (!dataEvento.value) return
  if (touroBloqueadoNoMes.value && selecionados.value.grande?.id === 'toy-touro-mecanico') {
    selecionados.value.grande = null
    if (filtroAtivo.value !== 'grande') filtroAtivo.value = 'grande'
  }
})

const brinquedos = ref<Brinquedo[]>([
  // GRANDES
  {
    id: 'toy-futebol-sabao-10x5',
    cat: 'grande',
    etiquetaLabel: 'Grande',
    etiquetaClass: 'etiqueta-amarela',
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
    etiquetaClass: 'etiqueta-amarela',
    name: 'Tobogã Gigante',
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
    etiquetaClass: 'etiqueta-amarela',
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
    etiquetaClass: 'etiqueta-amarela',
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
  },

  // MÉDIOS
  {
    id: 'toy-futebol-sabao-4x8',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-azul',
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
    id: 'toy-guerra-cotonete',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-azul',
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
    etiquetaClass: 'etiqueta-azul',
    name: 'Tobogã Colorex',
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
    etiquetaClass: 'etiqueta-azul',
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
    etiquetaClass: 'etiqueta-azul',
    name: 'Toboágua',
    schemaCategory: 'Brinquedo inflável - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade mínima: 5+',
    ageText: 'Até 15 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 1 criança',
    capText: 'Até 1 criança',
    imageSrc: '/images/toboagua.webp',
    imageAlt: 'Toboágua — brinquedo inflável com água (médio) para festas no Rio de Janeiro'
  },

  // PEQUENOS
  {
    id: 'toy-area-baby',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-roxa',
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
    etiquetaClass: 'etiqueta-roxa',
    name: 'Castelinho',
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
    etiquetaClass: 'etiqueta-roxa',
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
    etiquetaClass: 'etiqueta-roxa',
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
    id: 'toy-piscina-dino',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-roxa',
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
    id: 'toy-pula-pula-244',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-roxa',
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
    etiquetaClass: 'etiqueta-roxa',
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
    id: 'toy-toto',
    cat: 'pequeno',
    etiquetaLabel: 'Pequeno',
    etiquetaClass: 'etiqueta-roxa',
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
    etiquetaClass: 'etiqueta-roxa',
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
  {
    id: 'toy-piscina-bolinha',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-azul',
    name: 'Piscina de Bolinha',
    schemaCategory: 'Brinquedo - Médio',
    ageIcon: idadeIcon,
    ageAlt: 'Idade recomendada: até 5 anos',
    ageText: 'Até 5 anos',
    capIcon: capacidadeIcon,
    capAlt: 'Capacidade: até 3 crianças',
    capText: 'Até 3 crianças',
    imageSrc: '/images/piscina-bolinha.webp',
    imageAlt: 'Piscina de Bolinha — brinquedo médio para festa infantil no Rio de Janeiro'
  }
])

const selecionados = ref<Record<Categoria, Brinquedo | null>>({
  grande: null,
  medio: null,
  pequeno: null
})

const brinquedosFiltrados = computed(() => brinquedos.value.filter((b) => b.cat === filtroAtivo.value))

const totalSelecionados = computed(() => Object.values(selecionados.value).filter(Boolean).length)
const comboCompleto = computed(() => totalSelecionados.value === 3)

const podeFinalizar = computed(() => comboCompleto.value && !!dataEvento.value && diaValido.value)

const precoBRL = computed(() => PRECO_FIXO.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))

const textoCarrinho = computed(() => {
  if (totalSelecionados.value === 0) return 'Selecione os Brinquedos'
  if (comboCompleto.value) return 'Combo completo! 🎉'
  return `${totalSelecionados.value}/3 selecionados`
})

function definirFiltro(cat: Categoria) {
  filtroAtivo.value = cat
}

function estaSelecionado(b: Brinquedo) {
  return selecionados.value[b.cat]?.id === b.id
}

function alternarSelecao(b: Brinquedo) {
  if (brinquedoIndisponivel(b)) return

  const ja = estaSelecionado(b)

  if (ja) {
    selecionados.value[b.cat] = null
    return
  }

  selecionados.value[b.cat] = b

  const idx = ordemCategorias.indexOf(b.cat)
  const prox = ordemCategorias[idx + 1]
  if (prox && !selecionados.value[prox]) {
    setTimeout(() => (filtroAtivo.value = prox), 250)
  }
}

const linkWhats = computed(() => {
  const msg =
    `Olá! Gostaria de fechar o combo da semana.\n\n` +
    `📅 Data do evento: ${dataLabel.value || '-'}\n\n` +
    `🎈 Grande: ${selecionados.value.grande?.name || '-'}\n` +
    `🎈 Médio: ${selecionados.value.medio?.name || '-'}\n` +
    `🎈 Pequeno: ${selecionados.value.pequeno?.name || '-'}\n\n` +
    `💰 Valor: ${precoBRL.value} (Promoção Segunda a Quinta)\n\n` +
    `Aguardo retorno! 🎉`

  return `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(msg)}`
})

function handleWhatsClick(e: MouseEvent) {
  if (!podeFinalizar.value) e.preventDefault()
}
</script>

<style lang="sass" scoped>
@keyframes entrada
  from
    opacity: 0
    transform: translateY(10px)
  to
    opacity: 1
    transform: translateY(0)

@keyframes subir-barra
  from
    transform: translateX(-50%) translateY(100%)
    opacity: 0
  to
    transform: translateX(-50%) translateY(0)
    opacity: 1

@keyframes quicar
  0%
    transform: scale(.3)
    opacity: 0
  50%
    transform: scale(1.05)
  70%
    transform: scale(.9)
  100%
    transform: scale(1)
    opacity: 1

@keyframes pulsar
  0%, 100%
    box-shadow: 0 8px 25px -8px rgba(46, 204, 113, .55)
  50%
    box-shadow: 0 0 30px rgba(46, 204, 113, .65)

@keyframes gelatina
  0%, 100%
    transform: scale(1, 1)
  30%
    transform: scale(1.1, .9)
  40%
    transform: scale(.95, 1.05)
  50%
    transform: scale(1.03, .97)
  65%
    transform: scale(.99, 1.01)
  75%
    transform: scale(1.01, .99)

.pagina-combo
  min-height: 100vh
  background: #F8FAFC
  color: #131A3B
  font-family: 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif

.container
  max-width: 1200px
  margin: 0 auto
  padding: 0 24px

.texto-destaque
  color: #00C2CC

.animar-entrada
  opacity: 0
  animation: entrada .5s ease-out forwards

.cabecalho
  position: relative
  padding: calc(var(--menu-h, 76px) + 44px) 0 88px
  overflow: hidden
  background: #2D3A7A
  color: #FFFFFF

.cabecalho__clip
  position: absolute
  inset: 0
  overflow: hidden
  pointer-events: none
  z-index: 0

.cabecalho__fundo
  position: absolute
  inset: 0
  background-image: radial-gradient(circle at 20% 30%, rgba(0, 194, 204, .10) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255, 201, 58, .10) 0%, transparent 50%), radial-gradient(circle at 50% 50%, rgba(122, 98, 181, .06) 0%, transparent 70%)
  pointer-events: none

.cabecalho__decoracoes
  position: absolute
  inset: 0
  pointer-events: none

.decoracao
  position: absolute
  border-radius: 50%
  filter: blur(60px)

.decoracao-1
  top: 28px
  left: 28px
  width: 72px
  height: 72px
  background: rgba(255, 201, 58, .20)

.decoracao-2
  bottom: 24px
  right: 24px
  width: 120px
  height: 120px
  background: rgba(0, 194, 204, .20)

.cabecalho__conteudo
  position: relative
  z-index: 2
  text-align: center
  max-width: 760px
  margin: 0 auto

.selo-promocao
  display: inline-block
  padding: 8px 16px
  background: #FFC93A
  color: #131A3B
  border-radius: 999px
  font-size: 14px
  font-weight: 800
  margin-bottom: 12px

.titulo-principal
  font-size: clamp(30px, 4.6vw, 54px)
  font-weight: 900
  margin-bottom: 12px
  line-height: 1.05

.preco
  font-size: 18px
  font-weight: 800
  color: #00C2CC
  margin-bottom: 10px

.descricao
  color: rgba(255,255,255,.82)
  max-width: 560px
  margin: 0 auto 20px
  font-weight: 700

.linha-data
  margin: 8px auto 16px
  text-align: center
  max-width: 560px

.rotulo-data
  display: block
  font-weight: 900
  margin-bottom: 8px
  color: rgba(255,255,255,.92)

.campo-data
  display: flex
  gap: 10px
  align-items: center
  justify-content: center
  flex-wrap: wrap

.date-trigger
  border: none
  outline: none
  background: rgba(255,255,255,.95)
  border-radius: 14px
  padding: 12px 14px
  font-weight: 900
  color: #0B1538
  box-shadow: 0 14px 30px rgba(0,0,0,.20)
  min-width: 240px
  display: inline-flex
  align-items: center
  justify-content: space-between
  gap: 10px
  cursor: pointer
  transition: transform .18s ease, box-shadow .18s ease

  &:hover
    transform: translateY(-1px)
    box-shadow: 0 18px 35px rgba(0,0,0,.22)

  &:active
    transform: translateY(0)

.date-trigger__icon
  width: 22px
  height: 22px
  display: inline-flex
  align-items: center
  justify-content: center
  color: #2D3A7A

  svg
    width: 22px
    height: 22px
    display: block

.date-trigger__text
  flex: 1
  text-align: left
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.date-trigger__caret
  width: 18px
  height: 18px
  display: inline-flex
  align-items: center
  justify-content: center
  color: rgba(11, 21, 56, .65)

  svg
    width: 18px
    height: 18px
    display: block

.cal-backdrop
  position: fixed
  inset: 0
  z-index: 99999
  background: rgba(0,0,0,.10)
  border: 0
  padding: 0

.cal
  background: rgba(255,255,255,.98)
  border-radius: 18px
  border: 1px solid rgba(19, 26, 59, .10)
  box-shadow: 0 26px 60px rgba(0,0,0,.20)
  overflow: hidden
  backdrop-filter: blur(10px)
  font-family: var(--fonte)

.cal--portal
  z-index: 100000

.cal__topo
  display: flex
  align-items: center
  justify-content: space-between
  gap: 10px
  padding: 14px 14px 10px
  background: linear-gradient(180deg, #FFFFFF 0%, #F7FAFF 100%)
  border-bottom: 1px solid rgba(19, 26, 59, .08)

.cal__nav
  width: 38px
  height: 38px
  border-radius: 12px
  border: 2px solid rgba(0, 194, 204, .20)
  background: rgba(0, 194, 204, .08)
  color: #00C2CC
  cursor: pointer
  display: inline-flex
  align-items: center
  justify-content: center
  transition: transform .18s ease, background .18s ease, border-color .18s ease

  svg
    width: 18px
    height: 18px
    display: block

  &:hover
    transform: scale(1.05)
    background: rgba(0, 194, 204, .12)
    border-color: rgba(0, 194, 204, .35)

.cal__mes
  display: flex
  flex-direction: column
  align-items: center
  gap: 2px
  flex: 1
  min-width: 0

.cal__mesTxt
  font-weight: 1000
  color: #131A3B
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.cal__subTxt
  font-weight: 800
  font-size: 12px
  color: rgba(92, 107, 134, .85)

.cal__dow
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 6px
  padding: 10px 14px 8px

.cal__dowItem
  font-size: 11px
  font-weight: 1000
  color: rgba(92, 107, 134, .85)
  text-align: center

.cal__grid
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 6px
  padding: 0 14px 12px

.cal__blank
  height: 38px

.cal__day
  height: 38px
  border-radius: 12px
  border: 2px solid transparent
  background: rgba(45, 58, 122, .04)
  color: #131A3B
  font-weight: 1000
  cursor: pointer
  transition: transform .14s ease, background .14s ease, border-color .14s ease, color .14s ease
  display: inline-flex
  align-items: center
  justify-content: center

  &:hover
    transform: translateY(-1px)
    background: rgba(0, 194, 204, .12)
    border-color: rgba(0, 194, 204, .35)
    color: #00C2CC

  &.is-today
    border-color: rgba(255, 201, 58, .55)
    background: rgba(255, 201, 58, .12)

  &.is-selected
    background: #00C2CC
    border-color: #00C2CC
    color: #FFFFFF

  &.is-invalid
    background: rgba(231, 76, 60, .06)
    border-color: rgba(231, 76, 60, .25)
    color: #A63A2E

    &:hover
      background: rgba(231, 76, 60, .10)
      border-color: rgba(231, 76, 60, .35)
      color: #E74C3C

  &.is-disabled
    opacity: .35
    cursor: not-allowed
    transform: none !important

.cal__rodape
  display: flex
  gap: 10px
  justify-content: space-between
  padding: 12px 14px 14px
  border-top: 1px solid rgba(19, 26, 59, .08)
  background: #FFFFFF

.cal__btn
  flex: 1
  border: none
  cursor: pointer
  font: inherit
  font-weight: 1000
  border-radius: 12px
  padding: 10px 12px
  background: rgba(0, 194, 204, .12)
  color: #00C2CC
  transition: transform .16s ease, background .16s ease

  &:hover
    transform: translateY(-1px)
    background: rgba(0, 194, 204, .16)

.cal__btn--ghost
  background: rgba(45, 58, 122, .08)
  color: #2D3A7A

  &:hover
    background: rgba(45, 58, 122, .12)

.chip-data
  padding: 10px 12px
  border-radius: 999px
  font-weight: 900
  background: rgba(255,255,255,.14)
  color: rgba(255,255,255,.92)
  display: inline-flex
  align-items: center
  gap: 8px
  white-space: nowrap

  &.ok
    background: rgba(46, 204, 113, .18)
    color: #DFF7EA

  &.ruim
    background: rgba(231, 76, 60, .18)
    color: #FFE8E6

  &.pendente
    background: rgba(255,255,255,.14)

.chip-icon
  width: 18px
  height: 18px
  display: flex
  justify-content: center
  align-items: center
  flex: 0 0 auto

.chip-icon--x
  opacity: .95

.microtexto
  margin-top: 10px
  color: rgba(255,255,255,.78)
  font-weight: 700
  text-align: center

.passos
  display: flex
  align-items: center
  justify-content: center
  gap: 12px
  flex-wrap: wrap
  margin-top: 14px

.passo
  padding: 10px 18px
  border-radius: 999px
  font-weight: 900
  font-size: 14px
  background: rgba(255,255,255,.10)
  color: rgba(255,255,255,.62)
  transition: all .3s ease

  &.ativo
    background: linear-gradient(135deg, #FFC93A 0%, #FFB238 100%)
    color: #131A3B
    box-shadow: 0 8px 25px -8px rgba(255, 201, 58, .45)

.linha-passo
  width: 32px
  height: 2px
  background: rgba(255,255,255,.20)
  border-radius: 2px

.onda-cabecalho
  position: absolute
  bottom: 0
  left: 0
  right: 0
  line-height: 0
  z-index: 1
  pointer-events: none

  svg
    width: 100%
    height: auto

.principal
  padding: 32px 0 140px

.abas-filtro
  display: flex
  flex-wrap: wrap
  justify-content: center
  gap: 12px
  margin-bottom: 22px

.aba
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 12px 18px
  border: none
  border-radius: 999px
  font: inherit
  font-size: 14px
  font-weight: 900
  cursor: pointer
  transition: all .3s ease
  background: #EAF0F6
  color: #5C6B86

  &:hover
    background: rgba(0, 194, 204, .10)
    color: #00C2CC
    transform: scale(1.05)

  &.ativa
    background: #00C2CC
    color: #FFFFFF
    box-shadow: 0 8px 25px -8px rgba(0, 194, 204, .45)

  &.concluida
    background: #2ECC71
    color: #FFFFFF

.cabecalho-secao
  text-align: center
  margin-bottom: 22px

.titulo-secao
  font-size: 28px
  font-weight: 900
  margin-bottom: 8px

.subtitulo-secao
  color: #5C6B86
  font-weight: 800

.grade-brinquedos
  display: grid
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))
  gap: 18px

.card
  position: relative
  background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)
  border-radius: 16px
  overflow: hidden
  border: 3px solid transparent
  box-shadow: 0 4px 20px -4px rgba(19, 26, 59, .10)
  transition: transform .25s ease, box-shadow .25s ease
  animation: entrada .4s ease-out forwards
  opacity: 0

  &:hover
    transform: translateY(-4px)
    box-shadow: 0 8px 30px -8px rgba(19, 26, 59, .16)

  &:hover .card__imagem img
    animation: gelatina .7s ease-in-out

  &.selecionado
    border-color: #00C2CC
    box-shadow: 0 8px 25px -8px rgba(0, 194, 204, .45)

.card__imagem
  position: relative
  aspect-ratio: 4 / 3
  overflow: hidden
  background: #EAF0F6

  img
    width: 100%
    height: 100%
    object-fit: cover

.card__check
  position: absolute
  top: 12px
  right: 12px
  width: 40px
  height: 40px
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  box-shadow: 0 8px 25px -8px rgba(0, 194, 204, .55)
  animation: quicar .5s ease-out
  background: rgba(0, 194, 204, .92)

  img
    width: 22px
    height: 22px

.etiqueta
  position: absolute
  left: 12px
  top: 12px
  padding: 8px 12px
  border-radius: 999px
  font-weight: 1000
  font-size: 12px
  backdrop-filter: blur(10px)
  border: 2px solid rgba(255,255,255,.35)

.etiqueta-amarela
  background: rgba(255, 201, 58, .92)
  color: #131A3B

.etiqueta-azul
  background: rgba(45, 58, 122, .92)
  color: #FFFFFF

.etiqueta-roxa
  background: rgba(122, 98, 181, .92)
  color: #FFFFFF

.card__info
  padding: 18px

.card__titulo
  font-size: 18px
  font-weight: 900
  margin-bottom: 10px

.card__meta
  display: flex
  flex-wrap: wrap
  gap: 8px
  margin-bottom: 14px

.tag
  display: inline-flex
  align-items: center
  gap: 6px
  padding: 4px 10px
  border-radius: 999px
  font-size: 12px
  font-weight: 900

  img
    width: 20px
    height: 20px

.tag-idade
  background: #FBFCFD
  color: #5C6B86

.tag-capacidade
  background: #FBFCFD
  color: #007D86

.tag-tamanho
  color: #2D3A7A

.btn-selecionar
  width: 100%
  padding: 12px 14px
  border: 2px solid #00C2CC
  border-radius: 999px
  font: inherit
  font-size: 14px
  font-weight: 900
  cursor: pointer
  transition: transform .2s ease, background .2s ease
  display: flex
  align-items: center
  justify-content: center
  gap: 8px
  background: transparent
  color: #00C2CC

  &:hover
    background: rgba(0, 194, 204, .10)
    transform: scale(1.02)

  &.remover
    background: #E74C3C
    border-color: #E74C3C
    color: #FFFFFF

    &:hover
      background: #D64537
      border-color: #D64537

.barra-carrinho
  position: fixed
  bottom: 20px
  left: 50%
  transform: translateX(-50%)
  z-index: 9999
  width: 95%
  max-width: 600px
  background: #FFFFFF
  border-radius: 999px
  padding: 16px 22px
  display: flex
  align-items: center
  justify-content: space-between
  gap: 16px
  border: 2px solid #00C2CC
  box-shadow: 0 8px 30px -8px rgba(19, 26, 59, .18), 0 0 0 4px #F8FAFC
  animation: subir-barra .5s ease-out .4s forwards
  opacity: 0
  font-family: var(--fonte)

.card.is-bloqueado 
  opacity: 0.55
  pointer-events: auto

.card.is-bloqueado .btn-selecionar 
  cursor: not-allowed
  opacity: 0.7

.card__aviso 
  margin-top: 10px
  font-size: 12px
  opacity: 0.9

.carrinho__info
  display: flex
  flex-direction: column
  gap: 8px

.carrinho__contador
  display: flex
  align-items: center
  gap: 8px
  font-weight: 900
  color: #131A3B

.carrinho__checks
  display: flex
  gap: 8px
  flex-wrap: wrap

.check
  padding: 6px 12px
  border-radius: 999px
  font-size: 12px
  font-weight: 900
  background: #EAF0F6
  color: #5C6B86
  border: 2px solid #D7E2EC
  transition: all .25s ease

  &.preenchido
    background: #00C2CC
    color: #FFFFFF
    border-color: #00C2CC
    box-shadow: 0 8px 25px -8px rgba(0, 194, 204, .45)

    &::before
      content: "✓ "

.btn-whats
  padding: 12px 18px
  border-radius: 999px
  font-weight: 900
  font-size: 14px
  text-decoration: none
  display: inline-flex
  align-items: center
  gap: 8px
  transition: all 0.3s
  background: #EAF0F6
  color: #5C6B86
  cursor: not-allowed
  pointer-events: none
  white-space: nowrap

  &.pronto
    background: #2ECC71
    color: #FFFFFF
    cursor: pointer
    pointer-events: auto
    animation: pulsar 2s ease-in-out infinite

  &.pronto:hover
    transform: scale(1.05)

.onda-rodape
  line-height: 0
  margin-top: 24px

  svg
    width: 100%
    height: auto

@media (max-width: 640px)
  .cabecalho
    padding: calc(var(--menu-h, 76px) + 28px) 0 72px

  .titulo-principal
    font-size: 28px

  .date-trigger
    width: 100%
    min-width: 0

  .barra-carrinho
    flex-direction: column
    border-radius: 16px
    padding: 14px
    gap: 12px

  .carrinho__info
    align-items: center
    text-align: center

  .btn-whats
    width: 100%
    justify-content: center
</style>
