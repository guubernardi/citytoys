<!-- components/sections/SecaoFAQ.vue -->
<template>
  <section
    ref="secEl"
    class="secao-faq"
    id="faq"
    aria-label="Perguntas frequentes"
    itemscope
    itemtype="https://schema.org/FAQPage"
  >
    <div class="faq-shell" data-reveal>
      <div class="faq-content container">
        <header class="faq-header" data-reveal>
          <h2 class="faq-title">Perguntas Frequentes</h2>
        </header>

        <div class="faq-list" role="list">
          <article
            v-for="(f, i) in faqs"
            :key="f.id"
            class="faq-item"
            :class="{ open: abertoId === f.id }"
            role="listitem"
            itemprop="mainEntity"
            itemscope
            itemtype="https://schema.org/Question"
            data-reveal
            :style="{ '--d': `${i * 80}ms` }"
          >
            <button
              class="faq-question"
              type="button"
              :id="`faq-btn-${f.id}`"
              :aria-expanded="abertoId === f.id ? 'true' : 'false'"
              :aria-controls="`faq-panel-${f.id}`"
              @click="toggle(f.id)"
            >
              <span class="faq-leftIcon" aria-hidden="true">
                <img
                  class="faq-leftIcon__img"
                  :src="iconSrc(f.icon)"
                  alt=""
                  width="24"
                  height="24"
                  loading="lazy"
                  decoding="async"
                />
              </span>

              <span class="faq-bar">
                <span class="faq-text" itemprop="name">{{ f.q }}</span>

                <span class="faq-chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <path
                      d="M6 9l6 6 6-6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </button>

            <div
              class="faq-answerWrap"
              :id="`faq-panel-${f.id}`"
              role="region"
              :aria-labelledby="`faq-btn-${f.id}`"
            >
              <div class="faq-answerInner">
                <div class="faq-answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
                  <p itemprop="text">{{ f.a }}</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

type FAQIcon = 'calendar' | 'pin' | 'spray' | 'truck'
type FAQ = { id: string; q: string; a: string; icon: FAQIcon }

const faqs: FAQ[] = [
  {
    id: 'periodo',
    icon: 'calendar',
    q: 'Período de Locação',
    a: 'O aluguel normalmente é por diária. Se precisar de mais horas ou mais de um dia, chama no WhatsApp que montamos o melhor combo.'
  },
  {
    id: 'area',
    icon: 'pin',
    q: 'Área Atendida',
    a: 'Atendemos o Rio de Janeiro e regiões próximas. Confirma seu bairro no WhatsApp e a gente te passa certinho.'
  },
  {
    id: 'higiene',
    icon: 'spray',
    q: 'Os brinquedos são higienizados?',
    a: 'Sim! Fazemos limpeza e desinfecção completa após cada locação. Segurança e cuidado em primeiro lugar.'
  },
  {
    id: 'frete',
    icon: 'truck',
    q: 'Cobram frete?',
    a: 'Depende da localização. Algumas regiões têm taxa e outras não. Me chama no WhatsApp que calculamos rapidinho.'
  }
]

/* ✅ map dos ícones para /images */
function iconSrc(icon: FAQIcon) {
  switch (icon) {
    case 'calendar':
      return '/images/calendario.svg'
    case 'pin':
      return '/images/localizacao.svg'
    case 'spray':
      return '/images/limpeza.svg'
    default:
      return '/images/caminhao.svg'
  }
}

const abertoId = ref<string>(faqs[0]?.id || '')
function toggle(id: string) {
  abertoId.value = abertoId.value === id ? '' : id
}

/* Reveal (seção inteira, estável) */
const secEl = ref<HTMLElement | null>(null)
let obs: IntersectionObserver | null = null

function reduceMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

onMounted(() => {
  const root = secEl.value
  if (!root) return

  if (reduceMotion() || !('IntersectionObserver' in window)) {
    root.classList.add('is-inview')
    return
  }

  obs = new IntersectionObserver(
    (entries) => {
      const hit = entries.some((e) => e.isIntersecting)
      if (!hit) return
      root.classList.add('is-inview')
      obs?.disconnect()
      obs = null
    },
    { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
  )

  obs.observe(root)
})

onBeforeUnmount(() => {
  obs?.disconnect()
  obs = null
})
</script>

<style lang="sass" scoped>
$ct-red: #ff3b3b
$ct-orange: #ff9800
$ct-text: rgba(0,0,0,.82)

.secao-faq
  position: relative
  min-height: 100vh
  height: 100vh
  overflow: auto
  padding: clamp(64px, 7vh, 96px) 0
  font-family: var(--fonte)
  overflow: hidden
  scroll-margin-top: 90px

  &::before
    content: ""
    position: absolute
    inset: 0
    background-image: url("/images/faq.svg")
    background-size: cover
    background-position: center
    background-repeat: no-repeat
    z-index: 0

  &::after
    content: ""
    position: absolute
    inset: 0
    background: radial-gradient(circle at 40% 30%, rgba(255,255,255,.10), rgba(255,255,255,.00) 55%), rgba(255, 216, 90, .35)
    z-index: 0

.faq-shell
  position: relative
  z-index: 1
  width: 100%

.container
  max-width: 1200px
  margin: 0 auto
  padding: 0 24px

.faq-header
  text-align: center
  margin-bottom: 28px

.faq-title
  margin: 0
  font-weight: 900
  font-size: clamp(28px, 3.6vw, 44px)
  color: #FF3B3B
  letter-spacing: -0.02em
  text-shadow: 0 10px 18px rgba(0,0,0,.10)

.faq-list
  display: flex
  flex-direction: column
  gap: 16px
  justify-items: stretch
  justify-content: center
  align-items: center 
  margin-top: 120px

.faq-item
  width: 100%
  max-width: 1040px
  margin: 0 auto
  visibility: visible
  opacity: 1

.faq-question
  width: 100%
  display: grid
  grid-template-columns: 56px 1fr
  gap: 14px
  align-items: center
  background: transparent
  border: 0
  padding: 0
  cursor: pointer
  text-align: left

.faq-leftIcon
  width: 56px
  height: 56px
  border-radius: 16px
  background: $ct-red
  display: grid
  place-items: center
  box-shadow: 0 10px 22px rgba(255, 59, 59, .25)

.faq-leftIcon__img
  width: 24px
  height: 24px
  display: block
  filter: brightness(0) invert(1)

.faq-bar
  width: 100%
  min-height: 56px
  border-radius: 16px
  padding: 14px 16px
  display: grid
  grid-template-columns: 1fr 46px
  align-items: center
  gap: 10px
  background: linear-gradient(90deg, #ffb200, $ct-orange)
  box-shadow: 0 16px 34px rgba(255, 152, 0, .20)
  color: #fff

.faq-text
  font-weight: 900
  font-size: 1.08rem
  line-height: 1.2
  padding-left: 6px

.faq-chevron
  width: 46px
  height: 46px
  border-radius: 14px
  background: $ct-red
  display: grid
  place-items: center
  box-shadow: 0 10px 22px rgba(255, 59, 59, .18)
  transform: rotate(0deg)
  transition: transform .22s ease

  svg
    width: 22px
    height: 22px
    color: #fff

.faq-answerWrap
  margin-left: 70px
  margin-top: 12px
  overflow: hidden
  max-height: 0
  opacity: 0
  transform: translateY(-6px)
  transition: max-height .35s ease, opacity .25s ease, transform .25s ease

.faq-answer
  width: 100%
  background: rgba(255,255,255,.94)
  border: 1px solid rgba(0,0,0,.06)
  border-radius: 16px
  padding: 18px 22px
  box-shadow: 0 18px 40px rgba(0,0,0,.12)

  p
    margin: 0
    color: $ct-text
    line-height: 1.7
    font-weight: 700
    font-size: 1.02rem

.faq-item.open
  .faq-answerWrap
    max-height: 520px
    opacity: 1
    transform: translateY(0)

  .faq-chevron
    transform: rotate(180deg)

.secao-faq:not(.is-inview) [data-reveal]
  opacity: 0
  transform: translateY(16px)

.secao-faq.is-inview [data-reveal]
  opacity: 1
  transform: translateY(0)

[data-reveal]
  transition: opacity .6s ease, transform .6s ease
  will-change: opacity, transform

.faq-item[data-reveal]
  transition-delay: var(--d, 0ms)

@media (prefers-reduced-motion: reduce)
  [data-reveal]
    opacity: 1 !important
    transform: none !important
    transition: none !important

@media (max-width: 640px)
  .container
    padding: 0 16px

  .faq-item
    max-width: 100%

  .faq-question
    grid-template-columns: 48px 1fr
    gap: 12px

  .faq-leftIcon
    width: 48px
    height: 48px
    border-radius: 12px

  .faq-bar
    min-height: 48px
    border-radius: 12px
    padding: 12px 14px

  .faq-chevron
    width: 42px
    height: 42px
    border-radius: 12px

  .faq-answerWrap
    margin-left: 60px

  .faq-answer
    padding: 16px 16px
</style>
