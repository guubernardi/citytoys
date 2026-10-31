<template>
  <div id="pagina-combo" class="pagina-combo" :class="{ 'pagina-combo--tema': temaAtivo }">
    <!-- ===================== HERO ===================== -->
    <header class="hero-combo" :class="{ 'hero-combo--tema': temaAtivo }" aria-labelledby="titulo-pagina">
      <div class="hero-combo__fundo" aria-hidden="true">
        <span class="hero-combo__brilho-azul"></span>

        <span
          v-for="(e, i) in estrelasHero"
          :key="`estrela-${i}`"
          class="hero-combo__estrela"
          :style="estiloEnfeite(e, i)"
        ></span>

        <!-- flocos e faíscas: só com o tema de Natal no ar -->
        <template v-if="temaAtivo">
          <img
            v-for="(e, i) in flocosHero"
            :key="`floco-${i}`"
            class="hero-combo__floco"
            src="/images/natal/combo-hero-neve.svg"
            alt=""
            :width="e.t"
            :height="e.t"
            decoding="async"
            :style="estiloEnfeite(e, i)"
          />

          <img
            v-for="(e, i) in faiscasHero"
            :key="`faisca-${i}`"
            class="hero-combo__faisca"
            src="/images/natal/combo-hero-faisca.svg"
            alt=""
            :width="e.t"
            :height="e.t"
            decoding="async"
            :style="estiloEnfeite(e, i)"
          />
        </template>
      </div>

      <img
        v-if="temaAtivo"
        class="hero-combo__varal"
        src="/images/natal/combo-varal-luzes.svg"
        alt=""
        aria-hidden="true"
        width="1440"
        height="86"
        loading="eager"
        decoding="async"
      />

      <div class="container hero-combo__grade">
        <div class="hero-combo__texto">
          <span class="selo-combo animar-entrada" id="selo-promocao">
            <SvgIcone class="selo-combo__icone" nome="presente" :tamanho="16" />
            {{ temaAtivo ? 'Combo de Natal' : 'Combo promocional' }} · Segunda a Quinta
          </span>

          <h1 class="titulo-combo animar-entrada" id="titulo-pagina">
            Monte seu <span class="titulo-combo__destaque">Combo</span>
            <template v-if="temaAtivo">
              <span class="titulo-combo__linha">
                de
                <span class="titulo-combo__natal" aria-hidden="true"
                  ><span
                    v-for="(letra, i) in letrasNatal"
                    :key="`letra-${i}`"
                    class="letra-natal"
                    :class="`letra-natal--${i + 1}`"
                    >{{ letra }}</span
                  ></span
                ><span class="sr-only">Natal</span>
              </span>
            </template>
          </h1>

          <div class="cartao-preco animar-entrada" id="preco-combo">
            <div class="cartao-preco__valor">
              <span class="cartao-preco__rotulo">Combo fixo por</span>
              <strong class="cartao-preco__numero">{{ precoBRL }}</strong>
            </div>

            <span class="cartao-preco__separador" aria-hidden="true"></span>

            <div class="cartao-preco__inclui">
              <strong class="cartao-preco__qtd">3 brinquedos</strong>
              <span class="cartao-preco__lista">1 Grande, 1 Médio e 1 Pequeno</span>
            </div>
          </div>

          <p class="hero-combo__descricao animar-entrada" id="descricao-combo">
            Escolha primeiro um brinquedo <strong class="destaque-grande">Grande</strong>, depois um
            <strong class="destaque-medio">Médio</strong> e por último um
            <strong class="destaque-pequeno">Pequeno</strong>. Garantimos a melhor combinação de diversão para sua
            festa<template v-if="temaAtivo"> de fim de&nbsp;ano</template>!
          </p>

          <div class="hero-combo__acoes animar-entrada">
            <a class="botao-escolher" href="#escolher-brinquedos" @click.prevent="rolarParaSelecao">
              Escolher brinquedos
              <SvgIcone class="icone-girado" nome="chevron-baixo" :tamanho="18" />
            </a>

            <a
              class="botao-duvida"
              :href="linkWhatsDuvida"
              target="_blank"
              rel="noopener"
              @click="cliqueDuvida"
            >
              <SvgIcone class="botao-duvida__icone" nome="whatsapp" :tamanho="19" />
              Tirar dúvida no WhatsApp
            </a>
          </div>
        </div>

        <div class="hero-combo__visual">
          <span class="hero-combo__brilho-presentes" aria-hidden="true"></span>

          <img
            class="hero-combo__presentes"
            src="/images/natal/combo-hero-presentes.webp"
            alt="Três presentes empilhados: o combo junta 1 brinquedo grande, 1 médio e 1 pequeno"
            width="544"
            height="885"
            loading="eager"
            fetchpriority="high"
            decoding="async"
          />

          <span class="etiqueta-presente etiqueta-presente--pequeno" aria-hidden="true">
            <span class="etiqueta-presente__pilula">
              <span class="etiqueta-presente__numero">3</span>
              Pequeno
            </span>
          </span>

          <span class="etiqueta-presente etiqueta-presente--medio" aria-hidden="true">
            <span class="etiqueta-presente__pilula">
              <span class="etiqueta-presente__numero">2</span>
              Médio
            </span>
          </span>

          <span class="etiqueta-presente etiqueta-presente--grande" aria-hidden="true">
            <span class="etiqueta-presente__pilula">
              <span class="etiqueta-presente__numero">1</span>
              Grande
            </span>
          </span>
        </div>
      </div>

      <div class="hero-combo__onda" aria-hidden="true">
        <svg viewBox="0 0 1440 56" fill="none" preserveAspectRatio="none">
          <path d="M0 16C360 -34 1000 66 1440 0V56H0V16Z" />
        </svg>
      </div>
    </header>

    <!-- ===================== CALENDÁRIO (popover) ===================== -->
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

        <p v-if="mesFechado" class="cal__aviso">
          <strong>Outubro</strong> não entra no combo da semana. Para festas nesse mês,
          <a :href="linkWhatsOutubro" target="_blank" rel="noopener">fale com a gente no WhatsApp</a>.
        </p>

        <div class="cal__rodape">
          <button class="cal__btn" type="button" @click="irHoje">Hoje</button>
          <button class="cal__btn cal__btn--ghost" type="button" @click="limparData">Limpar</button>
        </div>
      </div>
    </Teleport>

    <!-- ===================== MONTAGEM DO COMBO ===================== -->
    <main class="montagem" aria-label="Seleção do combo">
      <div class="container montagem__grade">
        <section
          id="escolher-brinquedos"
          ref="selecaoEl"
          class="selecao"
          aria-labelledby="titulo-selecao"
        >
          <div class="selecao__cabecalho" id="cabecalho-secao">
            <p class="selecao__olho">
              <SvgIcone nome="estrela" :tamanho="14" />
              Passo {{ numeroPasso }} de 3 · {{ rotuloCategoria[filtroAtivo] }}
            </p>
            <h2 class="selecao__titulo" id="titulo-selecao">Escolha os brinquedos do seu combo</h2>
            <p class="selecao__subtitulo">Selecione 1 brinquedo de cada categoria para completar o combo.</p>
          </div>

          <div ref="etapasEl" class="etapas" id="abas-filtro" role="tablist" aria-label="Etapas do combo">
            <button
              v-for="(cat, i) in ordemCategorias"
              :key="cat"
              class="etapa"
              :class="`etapa--${estadoEtapa(cat)}`"
              type="button"
              role="tab"
              :aria-selected="filtroAtivo === cat"
              aria-controls="grade-combo"
              @click="definirFiltro(cat)"
            >
              <span class="etapa__marcador" aria-hidden="true">
                <SvgIcone v-if="selecionados[cat]" nome="check-limpo" :tamanho="20" />
                <template v-else>{{ i + 1 }}</template>
              </span>

              <span class="etapa__texto">
                <span class="etapa__titulo">{{ i + 1 }}º {{ rotuloCategoria[cat] }}</span>
                <span class="etapa__detalhe">{{ detalheEtapa(cat) }}</span>
              </span>

              <span v-if="estadoEtapa(cat) === 'concluida'" class="etapa__trocar" aria-hidden="true">Trocar</span>
            </button>
          </div>

          <div
            class="grade-combo"
            id="grade-combo"
            role="tabpanel"
            :aria-label="`Brinquedos da categoria ${rotuloCategoria[filtroAtivo]}`"
          >
            <article
              v-for="(b, idx) in brinquedosFiltrados"
              :key="b.id"
              class="card-combo"
              :class="{
                'card-combo--selecionado': estaSelecionado(b),
                'is-bloqueado': brinquedoIndisponivel(b)
              }"
              :style="{ animationDelay: `${idx * 0.05}s` }"
            >
              <div class="card-combo__foto">
                <img
                  :src="b.imageSrc"
                  :alt="b.imageAlt"
                  :width="dimensaoImagem(b.imageSrc).largura"
                  :height="dimensaoImagem(b.imageSrc).altura"
                  loading="lazy"
                  decoding="async"
                />

                <span class="card-combo__porte" :class="`fundo-${b.cat}`">{{ rotuloCategoria[b.cat] }}</span>

                <span v-if="estaSelecionado(b)" class="card-combo__no-combo">
                  <SvgIcone nome="check-limpo" :tamanho="14" />
                  No seu combo
                </span>
              </div>

              <div class="card-combo__conteudo">
                <h3 class="card-combo__nome">{{ b.name }}</h3>

                <ul class="card-combo__detalhes">
                  <li class="chip-combo" :title="b.ageAlt">
                    <SvgIcone nome="emoji-feliz" :tamanho="14" />
                    {{ b.ageText }}
                  </li>
                  <li class="chip-combo" :title="b.capAlt">
                    <SvgIcone nome="usuarios" :tamanho="14" />
                    {{ b.capText }}
                  </li>
                  <li class="chip-combo">
                    <SvgIcone nome="regua" :tamanho="14" />
                    {{ rotuloCategoria[b.cat] }}
                  </li>
                </ul>

                <button
                  class="botao-selecionar"
                  :class="{ 'botao-selecionar--ativo': estaSelecionado(b) }"
                  type="button"
                  :disabled="brinquedoIndisponivel(b)"
                  :aria-pressed="estaSelecionado(b)"
                  @click="alternarSelecao(b)"
                >
                  <template v-if="estaSelecionado(b)">
                    <SvgIcone nome="check-limpo" :tamanho="16" />
                    Selecionado
                  </template>
                  <template v-else>
                    <SvgIcone nome="mais" :tamanho="16" />
                    Selecionar
                  </template>
                  <span class="sr-only">{{ b.name }}</span>
                </button>

                <p v-if="brinquedoIndisponivel(b)" class="card-combo__aviso">Indisponível em Junho e Julho</p>
              </div>
            </article>
          </div>
        </section>

        <aside ref="resumoEl" class="resumo" aria-label="Resumo do combo">
          <div class="resumo-card">
            <img
              v-if="temaAtivo"
              class="resumo-card__gorro"
              src="/images/natal/combo-gorro-noel.svg"
              alt=""
              aria-hidden="true"
              width="112"
              height="90"
              loading="lazy"
              decoding="async"
            />

            <div class="resumo-card__topo">
              <p class="resumo-card__titulo">
                <SvgIcone class="resumo-card__presente" nome="presente" :tamanho="22" />
                {{ temaAtivo ? 'Seu combo de Natal' : 'Seu combo' }}
              </p>

              <p class="resumo-card__contagem" id="contador-carrinho" aria-live="polite">
                {{ totalSelecionados }} de 3 brinquedos escolhidos
              </p>

              <div
                class="progresso"
                role="progressbar"
                aria-label="Brinquedos escolhidos"
                aria-valuemin="0"
                aria-valuemax="3"
                :aria-valuenow="totalSelecionados"
              >
                <span
                  v-for="cat in ordemCategorias"
                  :key="`progresso-${cat}`"
                  class="progresso__barra"
                  :class="{ 'is-cheia': !!selecionados[cat] }"
                ></span>
              </div>
            </div>

            <div class="resumo-card__conteudo">
              <div class="campo-data">
                <label class="resumo-card__rotulo" :for="calendarBtnId">Data do evento</label>

                <button
                  ref="calendarBtn"
                  :id="calendarBtnId"
                  class="campo-data__gatilho"
                  :class="`campo-data__gatilho--${statusDataClasse}`"
                  type="button"
                  :aria-expanded="calAberto"
                  aria-haspopup="dialog"
                  aria-controls="calendar-popover"
                  @click="toggleCalendar"
                >
                  <SvgIcone class="campo-data__icone" nome="calendario-dia" :tamanho="18" />
                  <span class="campo-data__texto" :class="{ 'is-preenchido': !!dataEvento }">
                    {{ dataEvento ? dataLabel : 'Selecione uma data' }}
                  </span>
                  <SvgIcone class="campo-data__seta icone-girado" nome="chevron-baixo" :tamanho="18" />
                </button>

                <p class="campo-data__ajuda" :class="`campo-data__ajuda--${ajudaData.classe}`" aria-live="polite">
                  <SvgIcone :nome="ajudaData.icone" :tamanho="14" />
                  {{ ajudaData.texto }}
                </p>

                <p v-if="dataEvento && touroBloqueadoNoMes" class="campo-data__ajuda campo-data__ajuda--aviso">
                  <SvgIcone nome="info" :tamanho="14" />
                  O Touro Mecânico fica indisponível em Junho e Julho.
                </p>
              </div>

              <div class="vagas">
                <p class="resumo-card__rotulo">Brinquedos</p>

                <ul class="vagas__lista">
                  <li v-for="cat in ordemCategorias" :key="`vaga-${cat}`">
                    <button
                      class="vaga"
                      :class="`vaga--${estadoVaga(cat)}`"
                      type="button"
                      :id="`check-${cat}`"
                      @click="irParaCategoria(cat)"
                    >
                      <span class="vaga__miniatura">
                        <img
                          v-if="selecionados[cat]"
                          :src="selecionados[cat]?.imageSrc"
                          alt=""
                          width="52"
                          height="52"
                          loading="lazy"
                          decoding="async"
                        />
                        <SvgIcone v-else nome="presente" :tamanho="22" />
                      </span>

                      <span class="vaga__texto">
                        <span class="vaga__categoria" :class="`cor-${cat}`">{{ rotuloCategoria[cat] }}</span>
                        <span class="vaga__nome">{{ nomeVaga(cat) }}</span>
                      </span>

                      <span v-if="selecionados[cat]" class="vaga__check" aria-hidden="true">
                        <SvgIcone nome="check-limpo" :tamanho="14" />
                      </span>
                    </button>
                  </li>
                </ul>
              </div>

              <span class="resumo-card__divisoria" aria-hidden="true"></span>

              <div class="total">
                <div class="total__texto">
                  <p class="total__rotulo">Total do combo</p>
                  <p class="total__nota">Preço fixo, sem surpresa</p>
                </div>
                <strong class="total__valor">{{ precoBRL }}</strong>
              </div>

              <a
                class="btn-whats"
                id="btn-whats"
                :class="{ pronto: podeFinalizar }"
                :href="podeFinalizar ? linkWhats : '#'"
                target="_blank"
                rel="noopener"
                :aria-disabled="!podeFinalizar"
                @click="handleWhatsClick"
              >
                <SvgIcone class="btn-whats__icone" nome="whatsapp" :tamanho="19" />
                Finalizar no WhatsApp
              </a>

              <p class="resumo-card__ajuda">{{ textoAjudaFinalizar }}</p>
            </div>
          </div>

          <ul class="garantias">
            <li v-for="g in garantias" :key="g" class="garantias__item">
              <span class="garantias__check" aria-hidden="true">
                <SvgIcone nome="check-limpo" :tamanho="13" />
              </span>
              {{ g }}
            </li>
          </ul>
        </aside>
      </div>
    </main>

    <!-- ===================== BARRA FIXA (≤980px) ===================== -->
    <Teleport to="body">
      <div
        class="barra-combo"
        id="barra-carrinho"
        :class="{ 'is-visivel': barraVisivel }"
        role="region"
        aria-label="Resumo rápido do combo"
        :aria-hidden="!barraVisivel"
      >
        <div class="barra-combo__info">
          <span class="barra-combo__contagem">
            <strong>{{ totalSelecionados }} de 3</strong> brinquedos
          </span>

          <span class="barra-combo__progresso" aria-hidden="true">
            <span
              v-for="cat in ordemCategorias"
              :key="`barra-${cat}`"
              class="barra-combo__segmento"
              :class="[`fundo-${cat}`, { 'is-cheio': !!selecionados[cat] }]"
            ></span>
          </span>
        </div>

        <a
          v-if="podeFinalizar"
          class="btn-whats btn-whats--barra pronto"
          :href="linkWhats"
          target="_blank"
          rel="noopener"
          :tabindex="barraVisivel ? 0 : -1"
          @click="handleWhatsClick"
        >
          <SvgIcone class="btn-whats__icone" nome="whatsapp" :tamanho="18" />
          Finalizar no WhatsApp
        </a>

        <button
          v-else-if="comboCompleto"
          class="barra-combo__data"
          type="button"
          :tabindex="barraVisivel ? 0 : -1"
          @click="escolherDataPelaBarra"
        >
          <SvgIcone nome="calendario-dia" :tamanho="18" />
          Escolher a data
        </button>

        <span v-else class="btn-whats btn-whats--barra" aria-disabled="true">
          <SvgIcone class="btn-whats__icone" nome="whatsapp" :tamanho="18" />
          Finalizar no WhatsApp
        </span>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { dimensaoImagem } from '~/helpers/dimensoesImagens.js'
import { useTemaSazonal } from '~/composables/useTemaSazonal'

// O título da página é definido em pages/montar-combo/index.vue.
//
// Layout do redesign de Natal (Figma "Monte seu Combo Natal"). A estrutura vale
// com ou sem tema: o tema só liga os enfeites (varal de luzes, flocos, faíscas,
// gorro do resumo) e troca a copy "de Natal / de fim de ano" pela neutra.
const { temaAtivo, registrarCliqueTema } = useTemaSazonal()

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

// ---------------------------------------------------------------------------
// Hero: enfeites posicionados como no Figma (x e y em % do hero de 1440x800).
// ---------------------------------------------------------------------------
type Enfeite = { x: number; y: number; t: number; o?: number }

const estrelasHero: Enfeite[] = [
  { x: 11.11, y: 21.25, t: 4 },
  { x: 36.11, y: 18.75, t: 3 },
  { x: 43.06, y: 80, t: 4 },
  { x: 81.94, y: 17.5, t: 3 },
  { x: 90.28, y: 80, t: 4 },
  { x: 29.17, y: 75, t: 3 },
  { x: 61.11, y: 16.25, t: 4 }
]

const flocosHero: Enfeite[] = [
  { x: 2.78, y: 25, t: 34 },
  { x: 48.61, y: 21.25, t: 22, o: 0.9 },
  { x: 95.14, y: 31.25, t: 40, o: 0.85 },
  { x: 4.17, y: 70, t: 26, o: 0.8 }
]

const faiscasHero: Enfeite[] = [
  { x: 54.17, y: 75, t: 14 },
  { x: 47.92, y: 37.5, t: 12, o: 0.86 },
  { x: 96.53, y: 65, t: 16, o: 0.86 },
  { x: 20.83, y: 17.5, t: 10, o: 0.86 }
]

function estiloEnfeite(e: Enfeite, i: number) {
  return {
    left: `${e.x}%`,
    top: `${e.y}%`,
    width: `${e.t}px`,
    height: `${e.t}px`,
    opacity: e.o,
    animationDelay: `${(i * -1.7).toFixed(1)}s`
  }
}

// "Natal" em letras coloridas (cores em .letra-natal--N, no style).
const letrasNatal = ['N', 'a', 't', 'a', 'l']

const linkWhatsDuvida = computed(() => {
  const msg = 'Olá! Estou montando um combo no site da City Toys e tenho uma dúvida.'
  return `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(msg)}`
})

function cliqueDuvida() {
  if (temaAtivo.value) registrarCliqueTema('combo-hero-duvida')
}

const garantias = ['Montagem e retirada inclusas', 'Brinquedos higienizados', 'Entrega em todo o RJ']

// ---------------------------------------------------------------------------
// Calendário
// ---------------------------------------------------------------------------
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

/**
 * Navega os meses um a um.
 *
 * Outubro continua fora do combo, mas agora aparece no calendário com os dias
 * desabilitados e um aviso. Antes o mês era pulado em silêncio: quem clicava
 * na seta em Setembro caía em Novembro sem entender o que tinha acontecido — e
 * ia embora em vez de chamar no WhatsApp.
 */
function addMonths(delta: number) {
  const d = new Date(viewYear.value, viewMonth.value, 1)
  d.setMonth(d.getMonth() + delta)

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

// Linha de ajuda embaixo do campo de data (substitui o antigo chip de status).
const ajudaData = computed(() => {
  if (!dataEvento.value) return { classe: 'neutra', icone: 'info', texto: 'Combo válido de segunda a quinta' }
  if (diaValido.value) return { classe: 'ok', icone: 'check-limpo', texto: 'Data válida para o combo' }
  return {
    classe: 'ruim',
    icone: 'atencao',
    texto: 'Esse combo vale só de segunda a quinta. Troque a data e fechou 😄'
  }
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

function syncViewToSelected() {
  if (!dataEvento.value) return

  // Cinto de segurança: nenhum dia de Outubro é selecionável, mas se algum
  // chegar aqui (estado antigo, link colado), some com ele.
  if (isOutubro(monthFromISO(dataEvento.value))) {
    dataEvento.value = ''
    return
  }

  const d = parseISO(dataEvento.value)
  viewMonth.value = d.getMonth()
  viewYear.value = d.getFullYear()
}

watch(dataEvento, () => {
  if (calAberto.value) syncViewToSelected()
})

const mesLabel = computed(() => `${meses[viewMonth.value]} ${viewYear.value}`)

// Outubro não entra no combo da semana. O mês aparece no calendário, mas com
// todos os dias desabilitados e um aviso que encaminha a pessoa pro WhatsApp
// em vez de deixá-la sem saída.
const mesFechado = computed(() => isOutubro(viewMonth.value))

const linkWhatsOutubro = computed(() => {
  const msg =
    'Olá! Quero alugar brinquedo para uma festa em outubro 🎈\n\n' + 'Data: ____\n' + 'Bairro: ____'

  return `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(msg)}`
})

function prevMonth() {
  addMonths(-1)
  if (calAberto.value) nextTick(updateCalPos)
}

function nextMonth() {
  addMonths(1)
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

  // Em Outubro não existe "hoje" selecionável: leva a vista até o mês, onde o
  // aviso explica o porquê, em vez de escolher uma data que ninguém pediu.
  if (isOutubro(now.getMonth())) {
    viewMonth.value = now.getMonth()
    viewYear.value = now.getFullYear()
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

// Listener de captura: acompanha a rolagem da página e de qualquer área
// rolável em volta do campo de data.
const OPCOES_SCROLL: AddEventListenerOptions = { passive: true, capture: true }

function abrirCalendar() {
  if (calAberto.value) return
  calAberto.value = true

  syncViewToSelected()

  nextTick(() => {
    updateCalPos()
    window.addEventListener('scroll', onWinScrollResize, OPCOES_SCROLL)
    window.addEventListener('resize', onWinScrollResize, { passive: true })
  })
}

function fecharCalendar() {
  calAberto.value = false
  window.removeEventListener('scroll', onWinScrollResize, OPCOES_SCROLL)
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
    id: 'toy-ping-pong',
    cat: 'medio',
    etiquetaLabel: 'Médio',
    etiquetaClass: 'etiqueta-azul',
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
    etiquetaClass: 'etiqueta-azul',
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

// ---------------------------------------------------------------------------
// Etapas (abas) e vagas do resumo
// ---------------------------------------------------------------------------
type EstadoEtapa = 'ativa' | 'concluida' | 'pendente'
type EstadoVaga = 'preenchida' | 'ativa' | 'aguardando'

const numeroPasso = computed(() => ordemCategorias.indexOf(filtroAtivo.value) + 1)

const totalPorCategoria = computed(() => {
  const total: Record<Categoria, number> = { grande: 0, medio: 0, pequeno: 0 }
  for (const b of brinquedos.value) total[b.cat]++
  return total
})

function estadoEtapa(cat: Categoria): EstadoEtapa {
  if (filtroAtivo.value === cat) return 'ativa'
  if (selecionados.value[cat]) return 'concluida'
  return 'pendente'
}

function detalheEtapa(cat: Categoria) {
  const escolhido = selecionados.value[cat]
  if (escolhido) return escolhido.name
  if (filtroAtivo.value === cat) return `Escolha 1 de ${totalPorCategoria.value[cat]} opções`

  const veioAntes = ordemCategorias.indexOf(cat) < ordemCategorias.indexOf(filtroAtivo.value)
  return veioAntes ? 'Falta escolher' : 'Próxima etapa'
}

function estadoVaga(cat: Categoria): EstadoVaga {
  if (selecionados.value[cat]) return 'preenchida'
  if (filtroAtivo.value === cat) return 'ativa'
  return 'aguardando'
}

function nomeVaga(cat: Categoria) {
  const escolhido = selecionados.value[cat]
  if (escolhido) return escolhido.name
  return filtroAtivo.value === cat ? 'Escolhendo agora...' : 'Aguardando'
}

const textoAjudaFinalizar = computed(() => {
  if (!comboCompleto.value) return 'Escolha os 3 brinquedos para liberar o pedido.'
  if (!dataEvento.value) return 'Agora escolha a data do evento para liberar o pedido.'
  if (!diaValido.value) return 'Escolha uma data de segunda a quinta para liberar o pedido.'
  return 'Tudo certo! É só finalizar no WhatsApp.'
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
    setTimeout(() => {
      filtroAtivo.value = prox
      // a grade troca de categoria: se as abas já sumiram lá em cima, volta
      // até elas pra pessoa ver a próxima etapa desde o começo
      nextTick(rolarParaEtapasSeSumiu)
    }, 250)
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
  if (!podeFinalizar.value) {
    e.preventDefault()
    return
  }

  if (temaAtivo.value) registrarCliqueTema('combo-finalizar')
}

// ---------------------------------------------------------------------------
// Rolagem suave (CTA do hero, troca de etapa, vagas do resumo)
// ---------------------------------------------------------------------------
const selecaoEl = ref<HTMLElement | null>(null)
const etapasEl = ref<HTMLElement | null>(null)
const resumoEl = ref<HTMLElement | null>(null)

function reduzirMovimento() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function alturaMenu() {
  const v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-h'))
  return Number.isFinite(v) && v > 0 ? v : 76
}

function rolarAte(el: HTMLElement | null, folga = 16) {
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY - alturaMenu() - folga
  window.scrollTo({ top: Math.max(0, y), behavior: reduzirMovimento() ? 'auto' : 'smooth' })
}

function rolarParaSelecao() {
  rolarAte(selecaoEl.value, 8)
}

function rolarParaEtapasSeSumiu() {
  const el = etapasEl.value
  if (!el) return
  if (el.getBoundingClientRect().top < alturaMenu()) rolarAte(el)
}

function irParaCategoria(cat: Categoria) {
  definirFiltro(cat)
  nextTick(rolarParaEtapasSeSumiu)
}

// ---------------------------------------------------------------------------
// Barra fixa do celular (≤980px): aparece enquanto a pessoa está escolhendo e
// some quando o resumo completo (com o mesmo botão) entra na tela.
// ---------------------------------------------------------------------------
const selecaoNaTela = ref(false)
const resumoAlcancado = ref(false)
const barraVisivel = computed(() => selecaoNaTela.value && !resumoAlcancado.value)

let ioBarra: IntersectionObserver | null = null
let roResumo: ResizeObserver | null = null

// Altura do resumo, pro "top" do sticky (ver .resumo no style).
function medirResumo() {
  const el = resumoEl.value
  if (!el) return
  el.style.setProperty('--resumo-h', `${el.offsetHeight}px`)
}

function observarBarra() {
  const selecao = selecaoEl.value
  const resumo = resumoEl.value
  if (!selecao || !resumo) return

  if (!('IntersectionObserver' in window)) {
    selecaoNaTela.value = true
    return
  }

  ioBarra = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.target === selecao) {
          selecaoNaTela.value = entry.isIntersecting
        } else if (entry.target === resumo) {
          resumoAlcancado.value = entry.isIntersecting || entry.boundingClientRect.top < 0
        }
      }
    },
    // some um pouco antes do resumo encostar na barra
    { rootMargin: '0px 0px 120px 0px' }
  )

  ioBarra.observe(selecao)
  ioBarra.observe(resumo)
}

// Combo completo mas sem data: a barra leva até o campo e já abre o calendário.
function escolherDataPelaBarra() {
  const btn = calendarBtn.value
  if (!btn) return

  const rapido = reduzirMovimento()
  btn.scrollIntoView({ behavior: rapido ? 'auto' : 'smooth', block: 'center' })
  window.setTimeout(abrirCalendar, rapido ? 0 : 450)
}

onMounted(() => {
  document.addEventListener('pointerdown', onDocPointerDown)
  document.addEventListener('keydown', onDocKeyDown)
  observarBarra()

  medirResumo()
  if ('ResizeObserver' in window && resumoEl.value) {
    roResumo = new ResizeObserver(medirResumo)
    roResumo.observe(resumoEl.value)
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocPointerDown)
  document.removeEventListener('keydown', onDocKeyDown)
  window.removeEventListener('scroll', onWinScrollResize, OPCOES_SCROLL)
  window.removeEventListener('resize', onWinScrollResize)
  ioBarra?.disconnect()
  ioBarra = null
  roResumo?.disconnect()
  roResumo = null
})
</script>

<style lang="sass" scoped>
// Cores de apoio do Figma que não viraram token global (cinzas e tons claros).
$cinza-texto: #5c6b86
$cinza-medio: #7a8aa3
$cinza-claro: #97a6bb
$cinza-icone: #a3b1c4
$cinza-bloqueado: #e3e9f1
$cinza-etapa: #eef2f7
$cinza-marcador: #d9e1ec
$borda-campo: #d5deea
$verde-claro: #f3fbf6
$verde-borda: #c9eed8
$verde-miniatura: #e7f6ee
$verde-check: #e3f7ec
$azul-icone: #2b74eb
$vermelho-topo-1: #e5343a
$vermelho-topo-2: #b8202c

// tons claros das categorias pro texto sobre o azul do hero
$grande-claro: #ff8a8a
$medio-claro: #5ee59a
$pequeno-claro: #ffb347

@keyframes entrada
  from
    opacity: 0
    transform: translateY(10px)
  to
    opacity: 1
    transform: translateY(0)

@keyframes flutuar-presentes
  0%, 100%
    transform: translateY(0)
  50%
    transform: translateY(-10px)

@keyframes cair-floco
  0%, 100%
    transform: translateY(0) rotate(0deg)
  50%
    transform: translateY(8px) rotate(30deg)

@keyframes piscar-faisca
  0%, 100%
    transform: scale(1)
    filter: brightness(1)
  50%
    transform: scale(.6)
    filter: brightness(1.4)

@keyframes pulsar
  0%, 100%
    box-shadow: 0 10px 24px -8px rgba(21, 128, 61, .55)
  50%
    box-shadow: 0 0 0 6px rgba(21, 128, 61, .14), 0 10px 24px -8px rgba(21, 128, 61, .55)

// ---------------------------------------------------------------------------
// Base
// ---------------------------------------------------------------------------
.pagina-combo
  min-height: 100vh
  background: var(--cor-neve)
  color: var(--cor-navy-2)
  font-family: var(--fonte)
  // o gorro do resumo passa um pouco da borda: nunca gera rolagem lateral
  overflow-x: clip

.container
  width: 100%
  max-width: calc(1280px + 2 * var(--container-px, 20px))
  margin: 0 auto
  padding: 0 var(--container-px, 20px)

// o ícone "chevron-baixo" do @edusites/icons é desenhado apontando pra cima
.icone-girado
  transform: rotate(180deg)

.sr-only
  position: absolute
  width: 1px
  height: 1px
  padding: 0
  margin: -1px
  overflow: hidden
  clip: rect(0, 0, 0, 0)
  white-space: nowrap
  border: 0

.animar-entrada
  opacity: 0
  animation: entrada .5s ease-out forwards

  &:nth-child(2)
    animation-delay: .06s

  &:nth-child(3)
    animation-delay: .12s

  &:nth-child(4)
    animation-delay: .18s

  &:nth-child(5)
    animation-delay: .24s

.cor-grande
  color: var(--cor-vermelho)

.cor-medio
  color: var(--cor-verde)

.cor-pequeno
  color: var(--cor-laranja)

.fundo-grande
  background: var(--cor-vermelho)

.fundo-medio
  background: var(--cor-verde)

.fundo-pequeno
  background: var(--cor-laranja)

// ---------------------------------------------------------------------------
// Hero
// ---------------------------------------------------------------------------
.hero-combo
  position: relative
  // só corta na horizontal (sem rolagem lateral); nada do hero leva corte reto
  overflow-x: clip
  padding: calc(var(--menu-h, 76px) + 20px) 0 92px
  background: linear-gradient(180deg, var(--cor-noite) 0%, #11296e 50%, #0f2463 100%)
  color: var(--cor-branco)

.hero-combo__fundo
  position: absolute
  inset: 0
  z-index: 0
  overflow: hidden
  pointer-events: none

.hero-combo__brilho-azul
  position: absolute
  left: -300px
  top: 25%
  width: 900px
  height: 600px
  background: radial-gradient(closest-side, rgba(43, 116, 235, .25), rgba(43, 116, 235, 0))

.hero-combo__estrela
  position: absolute
  border-radius: 50%
  background: rgba(255, 255, 255, .8)

.hero-combo__floco
  position: absolute
  display: block
  animation: cair-floco 9s ease-in-out infinite

.hero-combo__faisca
  position: absolute
  display: block
  animation: piscar-faisca 3.2s ease-in-out infinite

// varal logo abaixo do menu, como no Figma (só com o tema)
.hero-combo__varal
  position: absolute
  z-index: 1
  top: calc(var(--menu-h, 76px) - 6px)
  left: 50%
  width: max(100%, 1100px)
  height: auto
  transform: translateX(-50%)
  pointer-events: none

.hero-combo__grade
  position: relative
  z-index: 2
  display: grid
  grid-template-columns: minmax(0, 640px) minmax(0, 1fr)
  align-items: end
  gap: 24px

// sem o tema o título tem uma linha só: o texto centraliza ao lado dos presentes
.hero-combo:not(.hero-combo--tema) .hero-combo__grade
  align-items: center

.hero-combo__texto
  display: flex
  flex-direction: column
  align-items: flex-start
  gap: 22px

.selo-combo
  display: inline-flex
  align-items: center
  gap: 8px
  padding: 8px 16px
  border-radius: 999px
  background: var(--cor-dourado)
  color: var(--cor-navy)
  box-shadow: 0 6px 16px rgba(0, 0, 0, .2)
  font-size: 14.5px
  font-weight: 800
  line-height: 1.2

.titulo-combo
  margin: 0
  font-size: clamp(34px, 7vw, 68px)
  font-weight: 900
  line-height: 1.04
  color: var(--cor-branco)
  text-shadow: 0 4px 14px rgba(3, 20, 54, .35)

.titulo-combo__destaque
  color: var(--cor-dourado)

.titulo-combo__linha
  display: block

.letra-natal--1,
.letra-natal--5
  color: #ff7a7a

.letra-natal--2
  color: #4ade80

.letra-natal--3
  color: var(--cor-dourado)

.letra-natal--4
  color: #8ec5ff

.cartao-preco
  display: inline-flex
  align-items: center
  gap: 22px
  padding: 16px 24px
  border-radius: 20px
  border: 1px solid rgba(255, 255, 255, .14)
  background: rgba(255, 255, 255, .07)

.cartao-preco__valor,
.cartao-preco__inclui
  display: flex
  flex-direction: column
  white-space: nowrap

.cartao-preco__inclui
  gap: 2px

.cartao-preco__rotulo
  font-size: 14px
  font-weight: 700
  color: rgba(255, 255, 255, .8)

.cartao-preco__numero
  font-size: 40px
  font-weight: 900
  line-height: 1.35
  color: var(--cor-dourado)

.cartao-preco__separador
  flex: 0 0 1px
  height: 52px
  background: rgba(255, 255, 255, .2)

.cartao-preco__qtd
  font-size: 17px
  font-weight: 900
  color: var(--cor-branco)

.cartao-preco__lista
  font-size: 14.5px
  font-weight: 400
  color: rgba(255, 255, 255, .78)

.hero-combo__descricao
  margin: 0
  max-width: 640px
  text-wrap: pretty
  font-size: 17px
  font-weight: 600
  line-height: 1.5
  color: rgba(255, 255, 255, .88)

  strong
    font-weight: 900

.destaque-grande
  color: $grande-claro

.destaque-medio
  color: $medio-claro

.destaque-pequeno
  color: $pequeno-claro

.hero-combo__acoes
  display: flex
  flex-wrap: wrap
  align-items: center
  gap: 14px

.botao-escolher,
.botao-duvida
  display: inline-flex
  align-items: center
  justify-content: center
  gap: 10px
  border-radius: 999px
  font-weight: 800
  text-decoration: none
  white-space: nowrap
  transition: background-color .25s ease, color .25s ease, border-color .25s ease

.botao-escolher
  padding: 17px 30px
  background: var(--cor-dourado)
  color: var(--cor-navy)
  font-size: 18px
  box-shadow: 0 10px 24px rgba(122, 90, 0, .3)

  &:hover
    background: #2b74eb
    color: var(--cor-branco)

.botao-duvida
  padding: 16px 26px
  border: 1.5px solid rgba(255, 255, 255, .32)
  color: var(--cor-branco)
  font-size: 16px

  &:hover
    background: rgba(255, 255, 255, .08)
    border-color: rgba(255, 255, 255, .55)

.botao-duvida__icone
  color: #43d38d

.botao-escolher:focus-visible,
.botao-duvida:focus-visible
  outline: 3px solid var(--cor-branco)
  outline-offset: 3px

// presentes empilhados + etiquetas (caixa de 492x590 no Figma)
.hero-combo__visual
  position: relative
  justify-self: end
  width: min(100%, 492px)
  aspect-ratio: 492 / 590

.hero-combo__brilho-presentes
  position: absolute
  left: 54.7%
  top: 46.1%
  width: 154%
  aspect-ratio: 760 / 700
  transform: translate(-50%, -50%)
  background: radial-gradient(closest-side, rgba(255, 210, 63, .22), rgba(255, 107, 107, .08) 55%, rgba(255, 107, 107, 0))
  pointer-events: none

.hero-combo__presentes
  position: absolute
  top: 0
  right: 0
  width: 73.78%
  height: 100%
  object-fit: contain
  animation: flutuar-presentes 6s ease-in-out infinite

// cada etiqueta é uma linha: pílula + traço, com o fim do traço encostando
// no presente (ponto 1040 do Figma)
.etiqueta-presente
  position: absolute
  right: 65.65%
  display: flex
  align-items: center
  transform: translateY(-50%)

  &::after
    content: ''
    width: 46px
    height: 2px
    background: rgba(255, 255, 255, .5)

.etiqueta-presente--pequeno
  top: 25.76%

.etiqueta-presente--medio
  top: 50.68%

.etiqueta-presente--grande
  top: 77.8%

.etiqueta-presente__pilula
  display: inline-flex
  align-items: center
  gap: 10px
  padding: 8px 14px 8px 10px
  border-radius: 999px
  background: var(--cor-branco)
  box-shadow: 0 8px 20px rgba(0, 0, 0, .25)
  color: var(--cor-navy)
  font-size: 14.5px
  font-weight: 900
  white-space: nowrap

.etiqueta-presente__numero
  display: inline-flex
  align-items: center
  justify-content: center
  width: 28px
  height: 28px
  border-radius: 50%
  color: var(--cor-branco)
  font-size: 13px
  font-weight: 900

.etiqueta-presente--pequeno .etiqueta-presente__numero
  background: var(--cor-laranja)

.etiqueta-presente--medio .etiqueta-presente__numero
  background: var(--cor-verde)

.etiqueta-presente--grande .etiqueta-presente__numero
  background: var(--cor-vermelho)

.hero-combo__onda
  position: absolute
  z-index: 3
  left: 0
  right: 0
  bottom: -1px
  height: 56px
  line-height: 0
  pointer-events: none

  svg
    display: block
    width: 100%
    height: 100%

  path
    fill: var(--cor-neve)

// ---------------------------------------------------------------------------
// Montagem do combo (seleção + resumo)
// ---------------------------------------------------------------------------
.montagem
  padding: 64px 0 110px

.montagem__grade
  display: grid
  grid-template-columns: minmax(0, 1fr) 380px
  align-items: start
  gap: 32px

.selecao
  // alvo do "Escolher brinquedos": deixa respiro pro menu fixo
  scroll-margin-top: calc(var(--menu-h, 76px) + 8px)

.selecao__cabecalho
  display: flex
  flex-direction: column
  gap: 8px
  margin-bottom: 24px

.selecao__olho
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0
  font-size: 13px
  font-weight: 900
  letter-spacing: 1.3px
  text-transform: uppercase
  color: var(--cor-verde)

.selecao__titulo
  margin: 0
  font-size: clamp(26px, 3vw, 36px)
  font-weight: 900
  line-height: 1.25
  color: var(--cor-navy-2)

.selecao__subtitulo
  margin: 0
  font-size: 16.5px
  font-weight: 800
  color: $cinza-texto

// ---- etapas ----
.etapas
  display: grid
  grid-template-columns: repeat(3, minmax(0, 1fr))
  gap: 14px
  margin-bottom: 24px
  scroll-margin-top: calc(var(--menu-h, 76px) + 16px)

.etapa
  display: flex
  align-items: center
  gap: 12px
  min-width: 0
  padding: 14px 16px
  border: 1px solid transparent
  border-radius: 18px
  font: inherit
  text-align: left
  cursor: pointer
  transition: background-color .2s ease, border-color .2s ease

  &:focus-visible
    outline: 3px solid rgba(30, 158, 87, .45)
    outline-offset: 2px

.etapa__marcador
  display: inline-flex
  flex: 0 0 40px
  align-items: center
  justify-content: center
  width: 40px
  height: 40px
  border-radius: 50%
  font-size: 17px
  font-weight: 900

.etapa__texto
  display: flex
  flex: 1
  flex-direction: column
  gap: 1px
  min-width: 0

.etapa__titulo
  font-size: 16px
  font-weight: 900
  color: var(--cor-navy-2)

.etapa__detalhe
  overflow: hidden
  font-size: 13.5px
  font-weight: 700
  white-space: nowrap
  text-overflow: ellipsis

.etapa__trocar
  flex: 0 0 auto
  font-size: 13.5px
  font-weight: 900
  color: var(--cor-vermelho)

.etapa--concluida
  background: var(--cor-branco)
  border-color: var(--cor-borda)

  .etapa__marcador
    background: var(--cor-vermelho)
    color: var(--cor-branco)

  .etapa__detalhe
    color: var(--cor-chip-texto)

  &:hover
    background: #fff5f5
    border-color: rgba(214, 47, 53, .35)

.etapa--ativa
  padding: 13px 15px
  background: var(--cor-branco)
  border: 2px solid var(--cor-verde)
  box-shadow: 0 10px 24px rgba(30, 158, 87, .18)

  .etapa__marcador
    background: var(--cor-verde)
    color: var(--cor-branco)

  .etapa__detalhe
    color: var(--cor-verde)

.etapa--pendente
  background: $cinza-etapa

  .etapa__marcador
    background: $cinza-marcador
    color: $cinza-medio

  .etapa__titulo
    color: $cinza-medio

  .etapa__detalhe
    color: $cinza-claro

  &:hover
    background: #e6ecf4

// ---- cards ----
.grade-combo
  display: grid
  grid-template-columns: repeat(2, minmax(0, 1fr))
  gap: 24px

.card-combo
  position: relative
  display: flex
  flex-direction: column
  overflow: hidden
  border: 1px solid var(--cor-borda)
  border-radius: 20px
  background: var(--cor-branco)
  box-shadow: 0 12px 30px rgba(18, 48, 98, .08)
  opacity: 0
  animation: entrada .4s ease-out forwards
  transition: border-color .25s ease

  &:hover
    border-color: #cfdbea

.card-combo--selecionado
  border: 2.5px solid var(--cor-verde)
  box-shadow: 0 12px 30px rgba(30, 158, 87, .18)

  &:hover
    border-color: var(--cor-verde)

.card-combo__foto
  position: relative
  overflow: hidden
  aspect-ratio: 422 / 290
  background: var(--cor-chip-fundo)

  img
    display: block
    width: 100%
    height: 100%
    object-fit: cover

.card-combo__porte,
.card-combo__no-combo
  position: absolute
  top: 14px
  display: inline-flex
  align-items: center
  border-radius: 999px
  color: var(--cor-branco)
  font-size: 12.5px
  font-weight: 900
  line-height: 1.3

.card-combo__porte
  left: 14px
  padding: 5px 12px

.card-combo__no-combo
  right: 12px
  gap: 6px
  padding: 6px 12px
  background: var(--cor-verde)
  box-shadow: 0 6px 14px rgba(0, 0, 0, .18)

.card-combo__conteudo
  display: flex
  flex: 1
  flex-direction: column
  gap: 12px
  padding: 18px 20px 20px

.card-combo__nome
  margin: 0
  font-size: 19px
  font-weight: 900
  color: var(--cor-navy-2)

.card-combo__detalhes
  display: flex
  flex-wrap: wrap
  gap: 6px
  margin: 0
  padding: 0
  list-style: none

.chip-combo
  display: inline-flex
  align-items: center
  gap: 5px
  padding: 6px 10px
  border-radius: 999px
  background: var(--cor-chip-fundo)
  color: var(--cor-chip-texto)
  font-size: 12.5px
  font-weight: 800
  white-space: nowrap

.botao-selecionar
  display: flex
  align-items: center
  justify-content: center
  gap: 8px
  width: 100%
  margin-top: auto
  padding: 12px 20px
  border: 1.6px solid var(--cor-vermelho)
  border-radius: 999px
  background: transparent
  color: var(--cor-vermelho)
  font: inherit
  font-size: 15px
  font-weight: 900
  cursor: pointer
  transition: background-color .2s ease, color .2s ease, border-color .2s ease

  &:hover
    background: var(--cor-vermelho)
    color: var(--cor-branco)

  &:focus-visible
    outline: 3px solid rgba(214, 47, 53, .35)
    outline-offset: 2px

.botao-selecionar--ativo
  border-color: var(--cor-verde)
  background: var(--cor-verde)
  color: var(--cor-branco)

  &:hover
    border-color: var(--cor-verde-acao)
    background: var(--cor-verde-acao)

  &:focus-visible
    outline-color: rgba(30, 158, 87, .4)

.card-combo.is-bloqueado
  opacity: .55

  .botao-selecionar
    cursor: not-allowed
    opacity: .7

.card-combo__aviso
  margin: 0
  font-size: 12px
  font-weight: 700
  color: $cinza-texto

// ---- resumo ----
// Fica grudado ao lado da grade, 28px abaixo do menu. Se for mais alto que a
// tela, o "top" encolhe (até negativo) pra o fim do resumo, com o botão de
// finalizar, nunca sair da tela. --resumo-h é medido no script; sem JS vale
// o primeiro termo do min(). Sem overflow aqui: gorro e sombra não são cortados.
.resumo
  --resumo-folga: 28px
  position: sticky
  top: min(calc(var(--menu-h, 76px) + var(--resumo-folga)), calc(100vh - var(--resumo-h, 0px) - 16px))
  display: flex
  flex-direction: column
  gap: 16px

// com o gorro de Noel: folga extra pra ele não entrar embaixo do menu fixo
.pagina-combo--tema .resumo
  --resumo-folga: 56px

.resumo-card
  position: relative
  flex: 0 0 auto
  border: 1px solid var(--cor-borda)
  border-radius: 24px
  background: var(--cor-branco)
  box-shadow: 0 18px 40px rgba(18, 48, 98, .12)

.resumo-card__gorro
  position: absolute
  z-index: 2
  top: -36px
  right: -16px
  width: 112px
  height: auto
  transform: rotate(-14deg)
  pointer-events: none

.resumo-card__topo
  display: flex
  flex-direction: column
  gap: 10px
  padding: 22px 24px 20px
  border-radius: 23px 23px 0 0
  background: linear-gradient(180deg, $vermelho-topo-1 0%, $vermelho-topo-2 100%)
  color: var(--cor-branco)

.resumo-card__titulo
  display: flex
  align-items: center
  gap: 10px
  margin: 0
  font-size: 20px
  font-weight: 900

.resumo-card__presente
  color: var(--cor-dourado)

.resumo-card__contagem
  margin: 0
  font-size: 14px
  font-weight: 600
  color: rgba(255, 255, 255, .85)

.progresso
  display: flex
  gap: 6px

.progresso__barra
  flex: 1
  height: 6px
  border-radius: 99px
  background: rgba(255, 255, 255, .3)
  transition: background-color .3s ease

  &.is-cheia
    background: var(--cor-branco)

.resumo-card__conteudo
  display: flex
  flex-direction: column
  gap: 18px
  padding: 22px 24px 24px

.resumo-card__rotulo
  display: block
  margin: 0
  font-size: 14px
  font-weight: 900
  color: var(--cor-navy-2)

// campo de data (abre o calendário em popover)
.campo-data
  display: flex
  flex-direction: column
  gap: 8px

.campo-data__gatilho
  display: flex
  align-items: center
  gap: 10px
  width: 100%
  padding: 13px 14px
  border: 1.5px solid $borda-campo
  border-radius: 14px
  background: var(--cor-branco)
  font: inherit
  text-align: left
  cursor: pointer
  transition: border-color .2s ease, box-shadow .2s ease

  &:hover
    border-color: $cinza-claro

  &:focus-visible
    outline: none
    border-color: $azul-icone
    box-shadow: 0 0 0 3px rgba(43, 116, 235, .18)

  &[aria-expanded="true"]
    border-color: $azul-icone

.campo-data__gatilho--ok
  border-color: var(--cor-verde)

.campo-data__gatilho--ruim
  border-color: var(--cor-vermelho)

.campo-data__icone
  color: $azul-icone

.campo-data__seta
  color: $cinza-texto

.campo-data__texto
  flex: 1
  min-width: 0
  overflow: hidden
  font-size: 15px
  font-weight: 600
  color: $cinza-texto
  white-space: nowrap
  text-overflow: ellipsis

  &.is-preenchido
    font-weight: 800
    color: var(--cor-navy-2)

.campo-data__ajuda
  display: flex
  align-items: flex-start
  gap: 6px
  margin: 0
  font-size: 13px
  font-weight: 400
  line-height: 1.35
  color: $cinza-texto

  :deep(.edusites-icone)
    flex: 0 0 auto
    margin-top: 1px

.campo-data__ajuda--neutra :deep(.edusites-icone)
  color: $cinza-medio

.campo-data__ajuda--ok
  font-weight: 700
  color: var(--cor-verde)

.campo-data__ajuda--ruim
  font-weight: 700
  color: var(--cor-vermelho)

.campo-data__ajuda--aviso
  color: #8a4b00

// vagas (os 3 brinquedos do combo)
.vagas
  display: flex
  flex-direction: column
  gap: 10px

.vagas__lista
  display: flex
  flex-direction: column
  gap: 10px
  margin: 0
  padding: 0
  list-style: none

.vaga
  display: flex
  align-items: center
  gap: 12px
  width: 100%
  padding: 10px
  border: 1px solid transparent
  border-radius: 16px
  font: inherit
  text-align: left
  cursor: pointer
  transition: background-color .2s ease, border-color .2s ease

  &:focus-visible
    outline: 3px solid rgba(30, 158, 87, .35)
    outline-offset: 2px

.vaga__miniatura
  display: inline-flex
  flex: 0 0 52px
  align-items: center
  justify-content: center
  width: 52px
  height: 52px
  overflow: hidden
  border-radius: 12px

  img
    width: 100%
    height: 100%
    object-fit: cover

.vaga__texto
  display: flex
  flex: 1
  flex-direction: column
  gap: 2px
  min-width: 0

.vaga__categoria
  font-size: 11px
  font-weight: 900
  letter-spacing: .88px
  text-transform: uppercase

.vaga__nome
  overflow: hidden
  font-size: 14px
  font-weight: 700
  white-space: nowrap
  text-overflow: ellipsis

.vaga__check
  display: inline-flex
  flex: 0 0 26px
  align-items: center
  justify-content: center
  width: 26px
  height: 26px
  border-radius: 50%
  background: var(--cor-verde)
  color: var(--cor-branco)

.vaga--preenchida
  border-color: $verde-borda
  background: $verde-claro

  .vaga__nome
    font-size: 15px
    font-weight: 900
    color: var(--cor-navy-2)

  &:hover
    background: #e8f7ee

.vaga--ativa
  border: 1.5px dashed var(--cor-verde)
  padding: 9.5px
  background: var(--cor-branco)

  .vaga__miniatura
    background: $verde-miniatura
    color: var(--cor-verde)

  .vaga__nome
    color: var(--cor-verde)

.vaga--aguardando
  background: var(--cor-chip-fundo)

  .vaga__miniatura
    background: #e9eef5
    color: $cinza-icone

  .vaga__nome
    color: $cinza-claro

  &:hover
    background: #eaeff6

.resumo-card__divisoria
  display: block
  height: 1px
  background: var(--cor-borda)

.total
  display: flex
  align-items: center
  justify-content: space-between
  gap: 12px

.total__rotulo
  margin: 0
  font-size: 15px
  font-weight: 700
  color: $cinza-texto

.total__nota
  margin: 2px 0 0
  font-size: 12.5px
  font-weight: 400
  color: $cinza-medio

.total__valor
  font-size: 27px
  font-weight: 900
  color: var(--cor-navy)
  white-space: nowrap

// botão de finalizar: cinza até liberar, verde quando dá pra pedir
.btn-whats
  display: flex
  align-items: center
  justify-content: center
  gap: 10px
  width: 100%
  padding: 15px 20px
  border-radius: 999px
  background: $cinza-bloqueado
  color: $cinza-medio
  font-size: 16px
  font-weight: 900
  text-decoration: none
  white-space: nowrap
  cursor: not-allowed
  transition: background-color .25s ease, color .25s ease

  .btn-whats__icone
    color: #8a99ad

  &.pronto
    background: var(--cor-verde-acao)
    color: var(--cor-branco)
    cursor: pointer
    animation: pulsar 2.4s ease-in-out infinite

    .btn-whats__icone
      color: var(--cor-branco)

    &:hover
      background: #116632

  &:focus-visible
    outline: 3px solid rgba(21, 128, 61, .4)
    outline-offset: 3px

.resumo-card__ajuda
  margin: 0
  font-size: 13px
  font-weight: 400
  text-align: center
  color: $cinza-medio

.garantias
  display: flex
  flex: 0 0 auto
  flex-direction: column
  gap: 12px
  margin: 0
  padding: 18px 22px
  border: 1px solid var(--cor-borda)
  border-radius: 20px
  background: var(--cor-branco)
  list-style: none

.garantias__item
  display: flex
  align-items: center
  gap: 10px
  font-size: 14.5px
  font-weight: 700
  color: var(--cor-navy-2)

.garantias__check
  display: inline-flex
  flex: 0 0 24px
  align-items: center
  justify-content: center
  width: 24px
  height: 24px
  border-radius: 50%
  background: $verde-check
  color: var(--cor-verde)

// ---------------------------------------------------------------------------
// Barra fixa do celular (teleportada pro body)
// ---------------------------------------------------------------------------
.barra-combo
  position: fixed
  z-index: 95
  left: 16px
  // à direita fica o botão flutuante do WhatsApp (60px + 20px de margem)
  right: 96px
  bottom: calc(16px + env(safe-area-inset-bottom, 0px))
  display: none
  align-items: center
  gap: 14px
  max-width: 640px
  margin: 0 auto
  padding: 10px 10px 10px 16px
  border: 1px solid var(--cor-borda)
  border-radius: 20px
  background: var(--cor-branco)
  box-shadow: 0 18px 40px rgba(18, 48, 98, .18)
  font-family: var(--fonte)
  opacity: 0
  visibility: hidden
  transform: translateY(calc(100% + 24px))
  transition: transform .35s ease, opacity .35s ease, visibility 0s linear .35s

  &.is-visivel
    opacity: 1
    visibility: visible
    transform: translateY(0)
    transition: transform .35s ease, opacity .35s ease, visibility 0s

.barra-combo__info
  display: flex
  flex: 1
  flex-direction: column
  gap: 6px
  min-width: 0

.barra-combo__contagem
  font-size: 13.5px
  font-weight: 700
  color: $cinza-texto
  white-space: nowrap

  strong
    font-weight: 900
    color: var(--cor-navy-2)

.barra-combo__progresso
  display: flex
  gap: 4px
  max-width: 180px

.barra-combo__segmento
  flex: 1
  height: 5px
  border-radius: 99px
  opacity: .18
  transition: opacity .3s ease

  &.is-cheio
    opacity: 1

.btn-whats--barra
  flex: 0 0 auto
  width: auto
  padding: 12px 18px
  font-size: 15px

.barra-combo__data
  display: inline-flex
  flex: 0 0 auto
  align-items: center
  justify-content: center
  gap: 8px
  padding: 12px 18px
  border: 0
  border-radius: 999px
  background: var(--cor-dourado)
  color: var(--cor-navy)
  font: inherit
  font-size: 15px
  font-weight: 900
  cursor: pointer

  &:focus-visible
    outline: 3px solid rgba(5, 42, 84, .35)
    outline-offset: 2px

// ---------------------------------------------------------------------------
// Calendário (popover teleportado)
// ---------------------------------------------------------------------------
.cal-backdrop
  position: fixed
  inset: 0
  z-index: 99999
  padding: 0
  border: 0
  background: rgba(5, 42, 84, .12)

.cal
  overflow: hidden
  border: 1px solid var(--cor-borda)
  border-radius: 18px
  background: rgba(255, 255, 255, .98)
  box-shadow: 0 26px 60px rgba(5, 42, 84, .25)
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
  border-bottom: 1px solid var(--cor-borda)
  background: linear-gradient(180deg, var(--cor-branco) 0%, var(--cor-neve) 100%)

.cal__nav
  display: inline-flex
  align-items: center
  justify-content: center
  width: 38px
  height: 38px
  border: 2px solid rgba(5, 42, 84, .14)
  border-radius: 12px
  background: rgba(5, 42, 84, .05)
  color: var(--cor-navy)
  cursor: pointer
  transition: background-color .18s ease, border-color .18s ease

  svg
    display: block
    width: 18px
    height: 18px

  &:hover
    background: rgba(5, 42, 84, .09)
    border-color: rgba(5, 42, 84, .26)

.cal__mes
  display: flex
  flex: 1
  flex-direction: column
  align-items: center
  gap: 2px
  min-width: 0

.cal__mesTxt
  overflow: hidden
  font-weight: 900
  color: var(--cor-navy-2)
  white-space: nowrap
  text-overflow: ellipsis

.cal__subTxt
  font-size: 12px
  font-weight: 700
  text-align: center
  color: $cinza-medio

.cal__dow
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 6px
  padding: 10px 14px 8px

.cal__dowItem
  font-size: 11px
  font-weight: 900
  text-align: center
  color: $cinza-medio

.cal__grid
  display: grid
  grid-template-columns: repeat(7, 1fr)
  gap: 6px
  padding: 0 14px 12px

.cal__blank
  height: 38px

.cal__day
  display: inline-flex
  align-items: center
  justify-content: center
  height: 38px
  border: 2px solid transparent
  border-radius: 12px
  background: rgba(5, 42, 84, .04)
  color: var(--cor-navy-2)
  font: inherit
  font-weight: 900
  cursor: pointer
  transition: background-color .14s ease, border-color .14s ease, color .14s ease

  &:hover
    border-color: rgba(30, 158, 87, .4)
    background: rgba(30, 158, 87, .1)
    color: var(--cor-verde-acao)

  &.is-today
    border-color: rgba(255, 210, 63, .7)
    background: rgba(255, 210, 63, .14)

  &.is-selected
    border-color: var(--cor-verde)
    background: var(--cor-verde)
    color: var(--cor-branco)

  &.is-invalid
    border-color: rgba(214, 47, 53, .25)
    background: rgba(214, 47, 53, .06)
    color: #a3262b

    &:hover
      border-color: rgba(214, 47, 53, .4)
      background: rgba(214, 47, 53, .1)
      color: var(--cor-vermelho)

  &.is-disabled
    opacity: .35
    cursor: not-allowed

// Aviso de mês fechado: só aparece com a vista do calendário em Outubro.
.cal__aviso
  margin: 0
  padding: 10px 14px
  border-top: 1px solid var(--cor-borda)
  background: rgba(255, 152, 0, .1)
  color: #8a4b00
  font-size: 12.5px
  font-weight: 700
  line-height: 1.4

  a
    font-weight: 900
    color: var(--cor-verde-acao)

.cal__rodape
  display: flex
  justify-content: space-between
  gap: 10px
  padding: 12px 14px 14px
  border-top: 1px solid var(--cor-borda)
  background: var(--cor-branco)

.cal__btn
  flex: 1
  padding: 10px 12px
  border: none
  border-radius: 12px
  background: rgba(30, 158, 87, .12)
  color: var(--cor-verde-acao)
  font: inherit
  font-weight: 900
  cursor: pointer
  transition: background-color .16s ease

  &:hover
    background: rgba(30, 158, 87, .18)

.cal__btn--ghost
  background: rgba(5, 42, 84, .07)
  color: var(--cor-navy)

  &:hover
    background: rgba(5, 42, 84, .12)

// ---------------------------------------------------------------------------
// Responsivo
// ---------------------------------------------------------------------------
// sem folga lateral suficiente: o gorro entra um pouco pra não encostar na borda
@media (max-width: 1339px)
  .resumo-card__gorro
    right: -6px

@media (max-width: 1199px)
  .cartao-preco__numero
    font-size: 34px

  .etiqueta-presente::after
    width: 30px

// notebook com tela baixa: resumo mais compacto, botão de finalizar à vista
@media (min-width: 981px) and (max-height: 960px)
  .resumo
    gap: 12px

  .resumo-card__topo
    gap: 8px
    padding: 16px 22px 14px

  .resumo-card__conteudo
    gap: 14px
    padding: 16px 22px 18px

  .campo-data__gatilho
    padding: 10px 14px

  .vagas,
  .vagas__lista
    gap: 8px

  .vaga
    padding: 7px

  .vaga--ativa
    padding: 6.5px

  .vaga__miniatura
    flex-basis: 40px
    width: 40px
    height: 40px
    border-radius: 10px

  .total__valor
    font-size: 24px

  .btn-whats
    padding: 13px 20px

  .garantias
    gap: 10px
    padding: 14px 20px

// tela bem baixa: o cartão principal tem prioridade sobre a lista de garantias
@media (min-width: 981px) and (max-height: 860px)
  .garantias
    display: none

@media (max-width: 980px)
  .hero-combo
    padding-bottom: 84px

  // no celular o texto vem primeiro: o varal precisa de espaço acima dele
  .hero-combo--tema
    padding-top: calc(var(--menu-h, 76px) + 64px)

  .hero-combo__grade
    grid-template-columns: minmax(0, 1fr)
    gap: 36px

  .hero-combo__visual
    justify-self: center
    width: min(88%, 380px)
    // as etiquetas ficam à esquerda dos presentes: puxa o conjunto pro centro
    transform: translateX(6%)

  .montagem
    padding: 40px 0 72px

  .montagem__grade
    grid-template-columns: minmax(0, 1fr)
    gap: 40px

  .resumo
    position: static

  .resumo-card__gorro
    right: -6px

  .barra-combo
    display: flex

@media (max-width: 768px)
  .etapas
    gap: 8px

  .etapa
    flex-direction: column
    justify-content: center
    gap: 6px
    padding: 12px 8px
    text-align: center

  .etapa--ativa
    padding: 11px 7px

  .etapa__marcador
    flex-basis: 34px
    width: 34px
    height: 34px
    font-size: 15px

  .etapa__texto
    align-items: center
    width: 100%

  .etapa__titulo
    font-size: 14px

  .etapa__detalhe
    max-width: 100%
    font-size: 12px
    line-height: 1.25
    white-space: normal

  .etapa__trocar
    display: none

@media (max-width: 640px)
  .hero-combo
    padding-top: calc(var(--menu-h, 76px) + 28px)

  .hero-combo--tema
    padding-top: calc(var(--menu-h, 76px) + 56px)

  .hero-combo__texto
    gap: 18px

  .hero-combo__descricao
    font-size: 16px

  .grade-combo
    grid-template-columns: minmax(0, 1fr)
    gap: 18px

@media (max-width: 520px)
  .cartao-preco
    flex-wrap: wrap
    gap: 12px 18px
    width: 100%

  .cartao-preco__separador
    flex: 1 0 100%
    height: 1px

  .cartao-preco__numero
    font-size: 32px

  .hero-combo__acoes
    flex-direction: column
    align-items: stretch
    width: 100%

  .botao-escolher
    padding: 16px 24px
    font-size: 17px

  .botao-duvida
    padding: 15px 22px

  .etiqueta-presente::after
    width: 18px

  .etiqueta-presente__pilula
    gap: 7px
    padding: 6px 11px 6px 7px
    font-size: 13px

  .etiqueta-presente__numero
    width: 22px
    height: 22px
    font-size: 12px

  .selecao__subtitulo
    font-size: 15px

  .resumo-card__conteudo
    padding: 20px 18px 22px

  .resumo-card__topo
    padding: 20px 18px 18px

  .total__valor
    font-size: 24px

  .barra-combo
    flex-direction: column
    align-items: stretch
    gap: 10px
    padding: 12px

  .barra-combo__info
    flex-direction: row
    align-items: center
    justify-content: space-between
    gap: 10px

  .barra-combo__progresso
    flex: 0 1 110px

  .btn-whats--barra,
  .barra-combo__data
    width: 100%
    padding: 12px 14px

@media (max-width: 400px)
  .btn-whats--barra,
  .barra-combo__data
    font-size: 14px

  .selo-combo
    font-size: 13px

@media (prefers-reduced-motion: reduce)
  .animar-entrada,
  .card-combo
    opacity: 1
    animation: none

  .hero-combo__presentes,
  .hero-combo__floco,
  .hero-combo__faisca,
  .btn-whats.pronto
    animation: none

  .barra-combo,
  .barra-combo.is-visivel
    transition: none
</style>
