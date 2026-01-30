<!-- components/sections/SecaoDepoimentos.vue -->
<template>
    <!-- âncora (pra menu/scroll) -->
    <div id="depoimentos" aria-hidden="true"></div>
  
    <section
      ref="secEl"
      id="secao-depoimentos"
      class="secao-depoimentos"
      aria-label="Depoimentos de clientes"
    >
      <div class="container">
        <header class="cabecalho-depoimentos" data-anim>
          <h2 class="titulo-secao">🎉 Depoimentos dos pais felizes</h2>
          <p class="subtitulo-secao">
            Brinquedo alugado! Mais de 3 mil festas realizadas com alegria e segurança.
          </p>
        </header>
  
        <div id="grade-depoimentos" class="grade-depoimentos" role="list" aria-label="Lista de depoimentos">
          <article
            v-for="d in depoimentos"
            :key="d.id"
            :id="d.id"
            class="cartao-depoimento"
            :class="d.borda"
            role="listitem"
            data-anim
          >
            <div class="emoji-decorativo" aria-hidden="true">{{ d.emoji }}</div>
  
            <div class="avaliacao" :aria-label="`Nota ${d.nota} de 5`">
              <span class="nota">{{ d.nota }}</span>
              <div class="estrelas" aria-hidden="true">
                <span
                  v-for="n in 5"
                  :key="n"
                  class="estrela"
                  :class="{ preenchida: n <= d.estrelas }"
                >
                  ★
                </span>
              </div>
            </div>
  
            <h3 class="titulo-depoimento">{{ d.titulo }}</h3>
            <p class="texto-depoimento">{{ d.texto }}</p>
  
            <footer class="autor-depoimento">
              <span class="nome-autor">{{ d.nome }}</span>
              <span class="cidade-autor"> - {{ d.cidade }}</span>
            </footer>
          </article>
        </div>
  
        <div class="container-botao-whatsapp" data-anim>
          <a
            id="botao-whatsapp"
            class="botao-whats"
            :href="whatsLink"
            target="_blank"
            rel="noopener noreferrer"
            :data-whatsapp="whatsNumero"
            :data-msg="whatsMsg"
            aria-label="Abrir WhatsApp para fazer orçamento"
          >
            <svg
              fill="#efebeb"
              viewBox="0 0 32 32"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"
              />
            </svg>
            <span>Quero fazer meu orçamento no WhatsApp</span>
          </a>
        </div>
      </div>
  
      <div class="decoracoes-flutuantes" aria-hidden="true">
        <span class="decoracao decoracao-1">🎈</span>
        <span class="decoracao decoracao-2">🎁</span>
        <span class="decoracao decoracao-3">🧸</span>
        <span class="decoracao decoracao-4">⭐</span>
      </div>
    </section>
  </template>
  
  <script setup lang="ts">
  import { computed, onMounted, onBeforeUnmount, ref } from 'vue'
  
  type Depoimento = {
    id: string
    emoji: string
    nota: string
    estrelas: number
    titulo: string
    texto: string
    nome: string
    cidade: string
    borda: 'borda-verde' | 'borda-amarela' | 'borda-rosa' | 'borda-azul' | 'borda-laranja'
  }
  
  const secEl = ref<HTMLElement | null>(null)
  
  const whatsNumero = '5521984848699'
  const whatsMsg = 'Olá! Quero fazer meu orçamento para alugar brinquedos!'
  
  const whatsLink = computed(() => {
    return `https://wa.me/${whatsNumero}?text=${encodeURIComponent(whatsMsg)}`
  })
  
  const depoimentos = ref<Depoimento[]>([
    {
      id: 'depoimento-camila',
      emoji: '🧸',
      nota: '4,9',
      estrelas: 4,
      titulo: 'Tudo perfeito!',
      texto: 'A criançada se divertiu bastante. Chegaram no horário certinho e montaram tudo rapidinho.',
      nome: 'Camila S.',
      cidade: 'Barra da Tijuca (RJ)',
      borda: 'borda-verde'
    },
    {
      id: 'depoimento-fabiana',
      emoji: '🎈',
      nota: '5,0',
      estrelas: 5,
      titulo: 'Muito atenciosos!',
      texto: 'A festa foi um sucesso. Com certeza alugaremos novamente!',
      nome: 'Fabiana M.',
      cidade: 'Recreio dos Bandeirantes (RJ)',
      borda: 'borda-amarela'
    },
    {
      id: 'depoimento-dani',
      emoji: '🎁',
      nota: '4,9',
      estrelas: 4,
      titulo: 'Atendimento e brinquedos nota 10!',
      texto: 'Vale muito a pena. Meu filho amou!',
      nome: 'Dani A.',
      cidade: 'Tijuca (RJ)',
      borda: 'borda-rosa'
    },
    {
      id: 'depoimento-ricardo',
      emoji: '⭐',
      nota: '5,0',
      estrelas: 5,
      titulo: 'A experiência foi excelente!',
      texto: 'Recomendo muito a City Toys, equipe super profissional.',
      nome: 'Ricardo T.',
      cidade: 'Botafogo (RJ)',
      borda: 'borda-azul'
    },
    {
      id: 'depoimento-livia',
      emoji: '🎪',
      nota: '5,0',
      estrelas: 5,
      titulo: 'Excelente serviço!',
      texto: 'Tudo limpo, seguro e de qualidade. Crianças amaram o tobogã!',
      nome: 'Lívia F.',
      cidade: 'Copacabana (RJ)',
      borda: 'borda-laranja'
    },
    {
      id: 'depoimento-andre',
      emoji: '🎂',
      nota: '5,0',
      estrelas: 5,
      titulo: 'Festa de 6 anos do meu filho foi incrível!',
      texto: 'Os infláveis fizeram sucesso.',
      nome: 'André R.',
      cidade: 'Jacarepaguá (RJ)',
      borda: 'borda-verde'
    }
  ])
  
  let io: IntersectionObserver | null = null
  
  onMounted(() => {
    const root = secEl.value
    if (!root) return
  
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
    const itens = Array.from(root.querySelectorAll<HTMLElement>('[data-anim]'))
  
    if (reduceMotion || !('IntersectionObserver' in window)) {
      itens.forEach((el) => el.classList.add('is-inview'))
      return
    }
  
    io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          ;(entry.target as HTMLElement).classList.add('is-inview')
          io?.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px 180px 0px' }
    )
  
    itens.forEach((el) => io?.observe(el))
  })
  
  onBeforeUnmount(() => {
    io?.disconnect()
    io = null
  })
  </script>
  
  <style lang="sass" scoped>
  $bg: #f7fbff
  $texto: #122042
  $suave: rgba(18, 32, 66, .72)
  
  .secao-depoimentos
    position: relative
    background: $bg
    color: $texto
    padding: 84px 0
    overflow: hidden
    font-family: var(--fonte)
  
    .container
      max-width: 1100px
      margin: 0 auto
      padding: 0 20px
      position: relative
      z-index: 2
  
  .cabecalho-depoimentos
    text-align: center
    max-width: 820px
    margin: 0 auto 34px
  
  .titulo-secao
    font-size: clamp(1.7rem, 2.4vw, 2.4rem)
    font-weight: 900
    letter-spacing: -0.02em
    margin: 0
  
  .subtitulo-secao
    margin: 10px 0 0
    color: $suave
    line-height: 1.6
    font-size: 1.02rem
  
  .grade-depoimentos
    display: grid
    grid-template-columns: repeat(3, minmax(0, 1fr))
    gap: 18px
    margin-top: 22px
  
    @media (max-width: 980px)
      grid-template-columns: repeat(2, minmax(0, 1fr))
  
    @media (max-width: 640px)
      grid-template-columns: 1fr
  
  .cartao-depoimento
    position: relative
    border-radius: 22px
    background: rgba(255,255,255,.92)
    border: 1px solid rgba(255,255,255,.70)
    box-shadow: 0 18px 45px rgba(18,48,98,.12), 0 6px 16px rgba(18,48,98,.08)
    padding: 22px 20px 18px
    overflow: hidden
    transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease
  
    &::after
      content: ""
      position: absolute
      inset: -2px
      pointer-events: none
      opacity: 0
      transition: opacity .25s ease
      background: radial-gradient(520px 240px at 50% -30%, rgba(255,255,255,.26), rgba(255,255,255,0) 60%)
  
    &:hover
      transform: translateY(-8px)
      box-shadow: 0 22px 60px rgba(18,48,98,.16), 0 8px 22px rgba(18,48,98,.10)
      border-color: rgba(255,255,255,.85)
  
      &::after
        opacity: 1
  
  .emoji-decorativo
    position: absolute
    right: 14px
    top: 12px
    font-size: 22px
    opacity: .85
    transform: rotate(8deg)
    filter: drop-shadow(0 10px 12px rgba(0,0,0,.10))
  
  .avaliacao
    display: flex
    align-items: center
    gap: 10px
  
  .nota
    font-weight: 900
    font-size: 1.05rem
    color: $texto
  
  .estrelas
    display: inline-flex
    gap: 3px
    color: yellow
  
  .estrela
    font-size: 14px
    opacity: .22
    transform: translateY(-1px)
  
    &.preenchida
      opacity: .95
  
  .titulo-depoimento
    margin: 14px 0 8px
    font-size: 1.1rem
    font-weight: 900
    letter-spacing: -0.01em
  
  .texto-depoimento
    margin: 0
    color: $suave
    line-height: 1.6
  
  .autor-depoimento
    margin-top: 14px
    font-size: .95rem
    color: rgba(18,32,66,.82)
  
  .nome-autor
    font-weight: 800
  
  .borda-verde
    box-shadow: 0 18px 45px rgba(18,48,98,.12), 0 6px 16px rgba(18,48,98,.08)
    border-left: 6px solid rgba(57, 188, 134, .95)
  
  .borda-amarela
    border-left: 6px solid rgba(247, 194, 35, .95)
  
  .borda-rosa
    border-left: 6px solid rgba(209, 67, 105, .90)
  
  .borda-azul
    border-left: 6px solid rgba(43, 116, 235, .92)
  
  .borda-laranja
    border-left: 6px solid rgba(255, 152, 56, .92)
  
  .container-botao-whatsapp
    margin-top: 28px
    display: flex
    justify-content: center
  
  .botao-whats
    display: inline-flex
    align-items: center
    gap: 10px
    padding: 14px 18px
    border-radius: 20px
    background: #009676
    color: #fff
    text-decoration: none
    font-weight: 900
    box-shadow: 0 16px 40px rgba(0,0,0,.16)
    transition: transform .18s ease, box-shadow .18s ease, filter .18s ease
  
    svg
      width: 22px
      height: 22px
      flex: 0 0 auto
  
    &:hover
      transform: translateY(-3px)
      box-shadow: 0 20px 55px rgba(0,0,0,.20)
      filter: saturate(1.05)
  
  .decoracoes-flutuantes
    position: absolute
    inset: 0
    pointer-events: none
    z-index: 1
  
  .decoracao
    position: absolute
    font-size: 26px
    opacity: .25
    filter: blur(.0px)
    animation: floaty 6.5s ease-in-out infinite
  
  .decoracao-1
    left: 6%
    top: 20%
    animation-delay: .1s
  
  .decoracao-2
    right: 8%
    top: 32%
    animation-delay: .6s
  
  .decoracao-3
    left: 10%
    bottom: 18%
    animation-delay: 1.1s
  
  .decoracao-4
    right: 12%
    bottom: 22%
    animation-delay: 1.6s
  
  @keyframes floaty
    0%, 100%
      transform: translateY(0) rotate(0deg)
    50%
      transform: translateY(-12px) rotate(6deg)

  [data-anim]
    opacity: 0
    transform: translateY(14px)
    transition: opacity .65s ease, transform .65s ease
  
  .is-inview
    opacity: 1
    transform: translateY(0)
</style>
  