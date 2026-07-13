<template>
  <header
    ref="headerEl"
    class="topo-hero"
    :id="headerId"
    :class="{ 'is-scrolled': isScrolled }"
  >
    <nav class="menu-hero" :id="navId" aria-label="Menu principal">
      <ul class="links-menu links-esquerda" aria-label="Links do menu (esquerda)">
        <li v-for="item in leftLinks" :key="item.href">
          <NuxtLink
            v-if="isRoute(item.href)"
            :to="item.href"
            @click="closeMobile"
          >
            {{ item.label }}
          </NuxtLink>

          <a
            v-else
            :href="item.href"
            @click="onClickLink($event, item.href)"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>

      <NuxtLink
        class="logo-menu"
        :to="logoTo"
        aria-label="City Toys - voltar ao início"
        @click="onClickLogo"
      >
        <img :src="logoSrc" :alt="logoAlt" loading="eager" decoding="async" />
      </NuxtLink>

      <ul class="links-menu links-direita" aria-label="Links do menu (direita)">
        <li v-for="item in rightLinks" :key="item.href">
          <NuxtLink
            v-if="isRoute(item.href)"
            :to="item.href"
            :class="{ 'cta-menu': item.isCta }"
            @click="closeMobile"
          >
            <SvgIcone v-if="item.isCta" nome="foguete" :tamanho="16" />
            {{ item.label }}
          </NuxtLink>
          <a
            v-else
            :href="item.href"
            :class="{ 'cta-menu': item.isCta }"
            @click="onClickLink($event, item.href)"
          >
            <SvgIcone v-if="item.isCta" nome="foguete" :tamanho="16" />
            {{ item.label }}
          </a>
        </li>
      </ul>

      <button
        class="btn-mobile"
        :class="{ 'is-open': mobileOpen }"
        type="button"
        :aria-label="mobileOpen ? 'Fechar menu' : 'Abrir menu'"
        :aria-expanded="mobileOpen"
        aria-controls="drawer-menu"
        @click="toggleMobile"
      >
        <span class="btn-mobile__line" aria-hidden="true"></span>
        <span class="btn-mobile__line" aria-hidden="true"></span>
        <span class="btn-mobile__line" aria-hidden="true"></span>
      </button>
    </nav>

    <Teleport to="body">
      <button
        v-if="mobileOpen"
        class="overlay"
        type="button"
        aria-label="Fechar menu"
        @click="closeMobile"
      ></button>

      <aside
        v-if="mobileOpen"
        id="drawer-menu"
        class="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
      >
        <div class="drawer__top">
          <NuxtLink
            class="drawer__logo"
            :to="logoTo"
            aria-label="City Toys - voltar ao início"
            @click="onClickLogo"
          >
            <img :src="logoSrc" :alt="logoAlt" loading="eager" decoding="async" />
          </NuxtLink>

          <button class="drawer__close" type="button" aria-label="Fechar menu" @click="closeMobile">
            ✕
          </button>
        </div>

        <div class="drawer__links">
          <p class="drawer__title">Navegação</p>

          <div v-for="item in mobileLinks" :key="item.href">
            <NuxtLink
              v-if="isRoute(item.href)"
              :to="item.href"
              :class="['drawer__link', { 'drawer__link--cta': item.isCta }]"
              @click="closeMobile"
            >
              {{ item.label }}
            </NuxtLink>

            <a
              v-else
              :href="item.href"
              :class="['drawer__link', { 'drawer__link--cta': item.isCta }]"
              @click="onClickLink($event, item.href, true)"
            >
              {{ item.label }}
            </a>
          </div>
        </div>

      </aside>
    </Teleport>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'

type LinkItem = { label: string; href: string; isCta?: boolean }

const props = withDefaults(
  defineProps<{
    headerId?: string
    navId?: string
    logoTo?: string
    logoSrc?: string
    logoAlt?: string
    left?: LinkItem[]
    right?: LinkItem[]
  }>(),
  {
    headerId: 'hero-topo',
    navId: 'menu-principal',
    logoTo: '/',
    logoSrc: '/images/logo-citytoys.svg',
    logoAlt: 'City Toys - aluguel de brinquedos para festas',
    left: () => [
      { label: 'Início', href: '#inicio' },
      { label: 'Brinquedos', href: '#brinquedos' },
      { label: 'Depoimentos', href: '#depoimentos' }
    ],
    right: () => [
      { label: 'Dúvidas', href: '#faq' },
      { label: 'Contato', href: '#contato' },
      { label: 'Monte seu Combo', href: '/montar-combo', isCta: true }
    ]
  }
)

const route = useRoute()
const router = useRouter()

const headerEl = ref<HTMLElement | null>(null)
const headerH = ref(76)

const mobileOpen = ref(false)
const isScrolled = ref(false)

const leftLinks = computed(() => props.left)
const rightLinks = computed(() => props.right)
const mobileLinks = computed(() => [...props.left, ...props.right])

function isHash(href: string) {
  return typeof href === 'string' && href.startsWith('#') && href.length > 1
}

function isRoute(href: string) {
  return typeof href === 'string' && href.startsWith('/')
}

function measureHeader() {
  const h = headerEl.value?.offsetHeight || 76
  headerH.value = h
  document.documentElement.style.setProperty('--menu-h', `${h}px`)
}

function scrollToHash(hash: string) {
  const el = document.querySelector(hash) as HTMLElement | null
  if (!el) return

  const y = el.getBoundingClientRect().top + window.scrollY - headerH.value - 10
  window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' })
}

function onClickLink(e: MouseEvent, href: string, closeAfter = false) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

  if (!isHash(href)) {
    if (closeAfter) closeMobile()
    return
  }

  e.preventDefault()

  const go = async () => {
    if (route.path !== '/') {
      await router.push({ path: '/', hash: href })
      await nextTick()
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToHash(href)))
    } else {
      scrollToHash(href)
    }
  }

  go()
  if (closeAfter) closeMobile()
}

async function onClickLogo(e: MouseEvent) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

  e.preventDefault()
  closeMobile()

  if (route.path !== props.logoTo) {
    await router.push(props.logoTo)
    await nextTick()
  } else if (route.hash) {
    await router.replace({ path: props.logoTo, hash: '' })
    await nextTick()
  }

  window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
}

function closeMobile() {
  mobileOpen.value = false
}

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}

function onKeyDown(e: KeyboardEvent) {
  if (mobileOpen.value && e.key === 'Escape') closeMobile()
}

const SCROLL_THRESHOLD = 80
function updateScrolled() {
  isScrolled.value = (window.scrollY || 0) > SCROLL_THRESHOLD
}

watch(mobileOpen, (v) => {
  document.documentElement.classList.toggle('is-menu-open', v)
  document.body.style.overflow = v ? 'hidden' : ''
})

watch(
  () => route.fullPath,
  () => closeMobile()
)

function onResize() {
  measureHeader()
  updateScrolled()

  if (window.innerWidth > 980 && mobileOpen.value) closeMobile()
}

onMounted(() => {
  measureHeader()
  updateScrolled()

  window.addEventListener('scroll', updateScrolled, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('keydown', onKeyDown)
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('is-menu-open')
  document.body.style.overflow = ''
  window.removeEventListener('scroll', updateScrolled)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped lang="sass">
  .topo-hero
    position: fixed
    left: 0
    right: 0
    z-index: 5000
    font-family: var(--fonte)
    background: transparent
    pointer-events: none
    padding: 0
    transition: padding 0.35s ease

  /* ao rolar, o topo ganha respiro e a barra vira uma pílula flutuante */
  .topo-hero.is-scrolled
    padding: 12px 16px 0

  .menu-hero
    pointer-events: auto
    width: 100%
    max-width: var(--largura-max)
    margin: 0 auto
    display: flex
    align-items: center
    justify-content: space-between
    gap: 16px
    padding: 10px var(--container-px)
    border-radius: 999px
    transition: all 0.35s ease

  .topo-hero.is-scrolled .menu-hero
    background: #052a54
    box-shadow: 0 18px 45px rgba(5,20,50,.30)
    backdrop-filter: blur(12px)
    -webkit-backdrop-filter: blur(12px)
  
  .links-menu
    list-style: none
    display: flex
    gap: 18px
    padding: 0
    margin: 0
    align-items: center
  
  .links-menu :deep(a)
    color: rgba(255,255,255,.92)
    font-weight: 900
    text-decoration: none
    font-size: 14px
    padding: 10px 10px
    border-radius: 999px
    transition: all 0.3s
  
    &:hover
      color: #FFC93A
  
  .links-menu :deep(.router-link-active)
    text-decoration: underline
    text-underline-offset: 6px
    text-decoration-thickness: 2px
  
  .logo-menu
    display: inline-flex
    align-items: center
    justify-content: center
    padding: 0px 10px
    border-radius: 16px
    transition: transform .2s ease
  
    &:hover
      transform: scale(1.03)

    img
      height: 56px
      width: auto
      display: block
  
  .cta-menu
    display: inline-flex
    align-items: center
    gap: 8px
    background: #ffd23f
    color: #052a54 !important
    padding: 10px 20px !important
    transition: all 0.4s ease

    &:hover
      background: #2b74eb
      color: #ffffff !important
  
  .btn-mobile
    display: none
    width: 46px
    height: 46px
    border-radius: 14px
    border: 1px solid rgba(255,255,255,.22)
    background: rgba(255,255,255,.10)
    cursor: pointer
    align-items: center
    justify-content: center
    gap: 5px
    flex-direction: column
    transition: all 0.3s
  
    &:hover
      transform: scale(1.04)
      background: rgba(255,255,255,.14)
  
  .btn-mobile__line
    width: 18px
    height: 2px
    background: rgba(255,255,255,.92)
    border-radius: 2px
    transition: transform .25s ease, opacity .2s ease

  .btn-mobile.is-open
    .btn-mobile__line:nth-child(1)
      transform: translateY(7px) rotate(45deg)

    .btn-mobile__line:nth-child(2)
      opacity: 0

    .btn-mobile__line:nth-child(3)
      transform: translateY(-7px) rotate(-45deg)
  
  @media (max-width: 980px)
    .links-menu
      display: none
  
    .btn-mobile
      display: inline-flex
  
    .logo-menu img
      height: 56px
      width: auto
  
  .overlay
    position: fixed
    inset: 0
    z-index: 99990
    background: rgba(0,0,0,.40)
    border: 0
    padding: 0
  
  .drawer
    position: fixed
    top: 12px
    right: 12px
    bottom: 12px
    width: min(360px, 92vw)
    z-index: 99999
    background: rgba(255,255,255,.96)
    border-radius: 20px
    border: 1px solid rgba(19,26,59,.10)
    box-shadow: 0 30px 90px rgba(0,0,0,.25)
    overflow: hidden
    display: flex
    flex-direction: column
    backdrop-filter: blur(12px)
    -webkit-backdrop-filter: blur(12px)
    font-family: var(--fonte)
  
  .drawer__top
    display: flex
    align-items: center
    justify-content: space-between
    padding: 14px 14px
    border-bottom: 1px solid rgba(19,26,59,.08)
  
  .drawer__logo
    display: inline-flex
    align-items: center
    justify-content: center
  
    img
      height: 80px
      width: auto
      display: block
  
  .drawer__close
    width: 45px
    height: 42px
    border-radius: 14px
    border: 1px solid rgba(19,26,59,.10)
    background: rgba(45,58,122,.08)
    cursor: pointer
    font-weight: 1000
    color: #2D3A7A
  
  .drawer__links
    padding: 23px 14px
    display: flex
    flex-direction: column
    gap: 12px
  
  .drawer__title
    margin: 0 0 8px
    font-weight: 1000
    color: #131A3B
  
  .drawer__link
    display: flex
    width: 100%
    box-sizing: border-box
    align-items: center
    justify-content: flex-start
    gap: 10px
  
    text-decoration: none
    font-weight: 950
    color: #131A3B
  
    padding: 14px 16px
    border-radius: 16px
  
    background: rgba(45,58,122,.06)
    border: 1px solid rgba(45,58,122,.08)
  
    line-height: 1.1
    min-height: 48px
  
    transition: transform .2s ease, background .2s ease, border-color .2s ease
  
    &:hover
      transform: translateY(-1px)
      background: rgba(0,194,204,.12)

  .drawer__link--cta
    background: linear-gradient(135deg, #FFC93A 0%, #FFB238 100%)
    border-color: rgba(255,201,58,.34)
    color: #121A3B
  
    &:hover
      transform: translateY(-1px) scale(1.01)
      background: linear-gradient(135deg, #FFD35A 0%, #FFBE52 100%)

  .drawer__links > div:not(:last-child) .drawer__link
    box-shadow: 0 1px 0 rgba(19,26,59,.04)
  
  .drawer__footer
    margin-top: auto
    padding: 12px 14px 14px
    border-top: 1px solid rgba(19,26,59,.08)
  
  .drawer__hint
    font-weight: 800
    font-size: 12px
    color: rgba(92,107,134,.95)
  </style>
