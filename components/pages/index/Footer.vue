<template>
  <div class="footer-wrapper">
    <footer
      class="rodape"
      :class="{ 'rodape--natal': temaAtivo, 'rodape--folga-barra': folgaBarra }"
      :style="{ '--rodape-cor-curva': corCurva }"
      id="contato"
      aria-label="Rodapé com informações de contato"
    >
      <!-- Topo: curva (fundo da seção de cima entrando em arco) e, no Natal, o
           varal de luzes acompanhando a curva. Os dois ficam no mesmo bloco pra
           escalar juntos; no celular o bloco fica mais largo que a tela e é
           cortado nas laterais, pras lâmpadas não ficarem minúsculas. -->
      <div class="rodape__topo" aria-hidden="true">
        <svg class="rodape__curva" viewBox="0 0 1440 70" preserveAspectRatio="none" focusable="false">
          <path d="M0 0H1440V70C960 3.33 480 3.33 0 70V0Z" />
        </svg>

        <img
          v-if="temaAtivo"
          class="rodape__varal"
          src="/images/natal/rodape-varal-luzes.svg"
          alt=""
          width="1440"
          height="130"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="container">
        <div class="rodape__colunas">
          <!-- marca -->
          <div class="rodape__marca">
            <img
              class="rodape__logo"
              src="/images/logo-citytoys.svg"
              alt="City Toys"
              width="150"
              height="104"
              loading="lazy"
              decoding="async"
            />

            <p class="rodape__desc">Soluções em diversão, praticidade e magia para festas infantis no RJ.</p>

            <p v-if="temaAtivo" class="rodape__boas-festas">
              <img src="/images/natal/rodape-brilho.svg" alt="" aria-hidden="true" width="14" height="14" loading="lazy" decoding="async" />
              Boas festas da equipe City Toys!
            </p>
          </div>

          <!-- atalhos -->
          <nav class="rodape__bloco rodape__bloco--navegue" aria-label="Navegação do rodapé">
            <h2 class="rodape__titulo">Navegue</h2>

            <ul class="rodape__links">
              <li v-for="l in links" :key="l.href">
                <NuxtLink v-if="ehRota(l.href)" :to="l.href">{{ l.label }}</NuxtLink>
                <a v-else :href="hrefSecao(l.href)" @click="irParaSecao($event, l.href)">{{ l.label }}</a>
              </li>
            </ul>
          </nav>

          <!-- contato -->
          <div class="rodape__bloco rodape__bloco--contato">
            <h2 class="rodape__titulo">Fale com a gente</h2>

            <ul class="rodape__contatos">
              <li>
                <a class="rodape__contato" :href="linkWhats" target="_blank" rel="noopener">
                  <span class="rodape__ico rodape__ico--whats"><SvgIcone nome="whatsapp" :tamanho="18" /></span>
                  <span class="rodape__contato-texto">
                    <strong>WhatsApp</strong>
                    <small>{{ TELEFONE_VISIVEL }}</small>
                  </span>
                </a>
              </li>

              <li>
                <a class="rodape__contato" :href="`mailto:${EMAIL_CONTATO}`">
                  <span class="rodape__ico rodape__ico--email"><SvgIcone nome="envelope-2" :tamanho="18" /></span>
                  <span class="rodape__contato-texto">
                    <strong>E-mail</strong>
                    <small>{{ EMAIL_CONTATO }}</small>
                  </span>
                </a>
              </li>

              <li>
                <a class="rodape__contato" :href="INSTAGRAM_URL" target="_blank" rel="noopener">
                  <span class="rodape__ico rodape__ico--insta"><SvgIcone nome="instagram" :tamanho="18" /></span>
                  <span class="rodape__contato-texto">
                    <strong>Instagram</strong>
                    <small>@city_toysbrinquedos</small>
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div class="rodape__base">
          <p>&copy; {{ anoAtual }} City Toys Brinquedos. Todos os direitos reservados.</p>

          <p>
            Site feito por
            <a href="http://gustavobernardi.com/" target="_blank" rel="noopener noreferrer" class="rodape__dev">Gustavo Bernardi</a>
          </p>
        </div>
      </div>
    </footer>

    <NuxtLink
      :to="linkWhatsFlutuante"
      class="whatsapp-float"
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
    >
      <span class="whatsapp-float__balao" aria-hidden="true">Fale no WhatsApp</span>
      <SvgIcone nome="whatsapp" :tamanho="30" />
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import { EMAIL_CONTATO, INSTAGRAM_URL, WHATS_NUMERO } from '~/helpers/seo.js'

// corCurva: cor da seção logo acima do rodapé, que desce em arco sobre o azul.
// Na home é o creme da chamada final; no /montar-combo, o fundo claro do combo.
// folgaBarra: reserva espaço embaixo pra uma barra fixa na base da tela (a do
// carrinho no /montar-combo) não cobrir o fim do rodapé.
withDefaults(defineProps<{ corCurva?: string; folgaBarra?: boolean }>(), {
  corCurva: 'var(--cor-creme)',
  folgaBarra: false
})

const { temaAtivo } = useTemaSazonal()
const route = useRoute()
const router = useRouter()

// Contato vem do helpers/seo.js, que já é a fonte única do site.
const TELEFONE_VISIVEL = '+55 21 98484-8699'

const linkWhats = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(
  'Olá! Vim pelo site da City Toys e quero fazer um orçamento 🎉'
)}`

const linkWhatsFlutuante = `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(
  'Olá! Vi o site da City Toys e quero fazer um orçamento 🎉'
)}`

const links = [
  { label: 'Início', href: '#inicio' },
  { label: 'Brinquedos', href: '#brinquedos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Dúvidas', href: '#faq' },
  { label: 'Monte seu combo', href: '/montar-combo' }
]

const anoAtual = computed(() => new Date().getFullYear())

/* ---- links de seção (#...) funcionando nas duas páginas ---- */
// Na home a âncora é da própria página; em outra página (ex.: /montar-combo)
// o link leva pra home já na seção. Mesmo comportamento do Nav.

const naHome = computed(() => route.path === '/')

function ehRota(href: string) {
  return href.startsWith('/')
}

function hrefSecao(hash: string) {
  return naHome.value ? hash : `/${hash}`
}

function reduzMovimento() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function rolarAteSecao(hash: string) {
  const el = document.querySelector<HTMLElement>(hash)
  if (!el) return

  const alturaMenu = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--menu-h')) || 76
  const y = el.getBoundingClientRect().top + window.scrollY - alturaMenu - 10
  window.scrollTo({ top: Math.max(0, y), behavior: reduzMovimento() ? 'auto' : 'smooth' })
}

async function irParaSecao(e: MouseEvent, hash: string) {
  // ctrl/cmd + clique abre em outra aba normalmente
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

  e.preventDefault()

  if (!naHome.value) {
    await router.push({ path: '/', hash })
    await nextTick()
    requestAnimationFrame(() => requestAnimationFrame(() => rolarAteSecao(hash)))
    return
  }

  rolarAteSecao(hash)
}
</script>

<style lang="sass" scoped>
// Tons de texto do rodapé no Figma (sem variável global)
$texto-claro: #cbd7e8
$texto-apagado: #8fa3bd
$texto-base: #6f86a3
$titulo: #f8fafc

.rodape
  position: relative
  /* sem varal: só a curva (70px no desenho) + respiro */
  padding: max(110px, 7.6vw) 0 36px
  background: var(--cor-navy)
  color: $titulo
  font-family: var(--fonte, sans-serif)
  /* o bloco da curva + varal é mais largo que a tela no celular: corta só na
     horizontal, na borda da tela (as luzes continuam "pra fora" dela) */
  overflow-x: clip

/* com o varal (130px no desenho) o conteúdo desce um pouco mais */
.rodape--natal
  padding-top: max(150px, 10.4vw)

.rodape--folga-barra
  padding-bottom: 130px

/* ---- curva + varal ---- */
.rodape__topo
  position: absolute
  top: 0
  left: 50%
  width: max(100%, 1440px)
  aspect-ratio: 1440 / 130
  transform: translateX(-50%)
  pointer-events: none

.rodape__curva
  position: absolute
  top: -1px
  left: 0
  display: block
  width: 100%
  /* 70 de 130 do bloco, como no desenho (+1px pra não sobrar fresta) */
  height: calc(100% * 70 / 130 + 1px)

  path
    fill: var(--rodape-cor-curva, var(--cor-creme))

.rodape__varal
  position: absolute
  inset: 0
  display: block
  width: 100%
  height: 100%

.container
  position: relative
  z-index: 1
  max-width: calc(1280px + var(--container-px) * 2)
  margin: 0 auto
  padding: 0 var(--container-px)

/* ---- colunas ---- */
.rodape__colunas
  display: flex
  align-items: flex-start
  justify-content: space-between
  gap: 40px

/* ---- marca ---- */
.rodape__marca
  display: flex
  flex-direction: column
  align-items: flex-start
  gap: 16px
  width: 340px
  max-width: 100%

.rodape__logo
  display: block
  width: 150px
  height: auto

.rodape__desc
  margin: 0
  color: $texto-apagado
  font-size: 15px
  line-height: 1.55

.rodape__boas-festas
  display: inline-flex
  align-items: center
  gap: 8px
  margin: 0
  padding: 8px 14px
  border: 1px solid rgba(255, 210, 63, .3)
  border-radius: 999px
  background: rgba(255, 210, 63, .12)
  color: var(--cor-dourado)
  font-size: 14px
  font-weight: 700

  img
    display: block
    flex: none

/* ---- títulos das colunas, com o tracinho colorido embaixo ---- */
.rodape__titulo
  margin: 0
  color: $titulo
  font-size: 14px
  font-weight: 900
  letter-spacing: .84px
  text-transform: uppercase

  &::after
    content: ""
    display: block
    width: 26px
    height: 3px
    margin-top: 12px
    border-radius: 2px
    background: var(--rodape-acento)

.rodape__bloco--navegue
  --rodape-acento: var(--cor-vermelho)

.rodape__bloco--contato
  --rodape-acento: var(--cor-verde)

/* ---- atalhos ---- */
.rodape__links
  display: flex
  flex-direction: column
  gap: 12px
  margin: 12px 0 0
  padding: 0
  list-style: none

  a
    display: inline-block
    color: $texto-claro
    font-size: 15px
    text-decoration: none
    transition: color .25s ease

    /* hover só troca a cor */
    &:hover
      color: var(--cor-dourado)

    &:focus-visible
      outline: 3px solid rgba(255, 210, 63, .6)
      outline-offset: 3px
      border-radius: 6px

/* ---- contatos ---- */
.rodape__contatos
  display: flex
  flex-direction: column
  gap: 14px
  margin: 14px 0 0
  padding: 0
  list-style: none

.rodape__contato
  display: flex
  align-items: center
  gap: 12px
  border-radius: 12px
  color: $texto-claro
  text-decoration: none
  transition: color .25s ease

  /* hover só troca cor/fundo, nada se mexe */
  &:hover
    color: var(--cor-branco)

  &:focus-visible
    outline: 3px solid rgba(255, 210, 63, .6)
    outline-offset: 4px

.rodape__ico
  flex: none
  display: grid
  place-items: center
  width: 36px
  height: 36px
  border-radius: 10px
  background: rgba(255, 255, 255, .07)
  transition: background .25s ease

.rodape__ico--whats
  color: #43d38d

.rodape__ico--email
  color: var(--cor-dourado)

.rodape__ico--insta
  color: #ff9ecb

.rodape__contato:hover .rodape__ico
  background: rgba(255, 255, 255, .14)

.rodape__contato-texto
  display: flex
  flex-direction: column
  gap: 1px
  min-width: 0

  strong
    font-size: 15px
    font-weight: 900

  small
    color: $texto-apagado
    font-size: 13.5px
    overflow-wrap: anywhere

/* ---- base ---- */
.rodape__base
  display: flex
  align-items: center
  justify-content: space-between
  flex-wrap: wrap
  gap: 10px
  margin-top: 36px
  padding: 36px 0 0
  border-top: 1px solid rgba(255, 255, 255, .1)
  color: $texto-base
  font-size: 13px

  p
    margin: 0

.rodape__dev
  color: $texto-apagado
  text-decoration: underline
  text-underline-offset: 2px
  transition: color .25s ease

  &:hover
    color: var(--cor-dourado)

  &:focus-visible
    outline: 3px solid rgba(255, 210, 63, .6)
    outline-offset: 2px
    border-radius: 4px

/* ---- botão flutuante do WhatsApp ---- */
.whatsapp-float
  position: fixed
  right: 20px
  bottom: 20px
  display: flex
  align-items: center
  justify-content: center
  width: 60px
  height: 60px
  border-radius: 50%
  background: #25d366
  color: #ffffff
  box-shadow: 0 4px 20px rgba(37,211,102,.4)
  z-index: 100
  transition: background .25s ease
  animation: pulsar-whats 3s infinite

  /* hover: verde um pouco mais escuro, sem crescer */
  &:hover
    background: #1ebe5a

  &:focus-visible
    outline: 3px solid rgba(255,255,255,.9)
    outline-offset: 3px

/* balãozinho que aparece ao passar o mouse */
.whatsapp-float__balao
  position: absolute
  right: calc(100% + 12px)
  padding: 8px 14px
  border-radius: 999px
  background: var(--cor-navy)
  color: #ffffff
  font-size: .85rem
  font-weight: 800
  white-space: nowrap
  box-shadow: 0 10px 22px rgba(3,20,54,.28)
  opacity: 0
  pointer-events: none
  transition: opacity .25s ease

  &::after
    content: ""
    position: absolute
    top: 50%
    left: 100%
    width: 8px
    height: 8px
    margin-top: -4px
    background: var(--cor-navy)
    clip-path: polygon(0 0, 100% 50%, 0 100%)

.whatsapp-float:hover .whatsapp-float__balao,
.whatsapp-float:focus-visible .whatsapp-float__balao
  opacity: 1

@keyframes pulsar-whats
  0%
    box-shadow: 0 0 0 0 rgba(37,211,102,.7)
  70%
    box-shadow: 0 0 0 15px rgba(37,211,102,0)
  100%
    box-shadow: 0 0 0 0 rgba(37,211,102,0)

/* conteúdo encostando na lateral da tela: espaço à direita pro botão flutuante
   do WhatsApp não cobrir o crédito */
@media (max-width: 1440px)
  .rodape__base
    padding-right: 90px

/* ---- tablet ---- */
@media (max-width: 980px)
  .rodape__colunas
    display: grid
    grid-template-columns: 1fr 1fr
    gap: 40px 32px

  .rodape__marca
    grid-column: 1 / -1
    width: auto
    max-width: 420px

/* curva e varal: bloco mais estreito, as lâmpadas ficam menores e a curva
   aparece mais (senão no celular só sobraria o miolo quase reto) */
@media (max-width: 768px)
  .rodape__topo
    width: max(100%, 1000px)

  .rodape
    padding-top: 84px

  .rodape--natal
    padding-top: 116px

@media (max-width: 480px)
  .rodape__topo
    width: 800px

  .rodape
    padding-top: 72px

  .rodape--natal
    padding-top: 100px

/* ---- celular ---- */
@media (max-width: 640px)
  .rodape
    /* folga embaixo: no fim da página o botão flutuante fica em cima do texto */
    padding-bottom: 86px

  /* no celular a barra do carrinho vira duas linhas e fica mais alta */
  .rodape--folga-barra
    padding-bottom: 190px

  .rodape__colunas
    grid-template-columns: 1fr
    gap: 34px
    text-align: center

  .rodape__marca
    align-items: center
    margin-inline: auto

  .rodape__titulo::after
    margin-inline: auto

  .rodape__links
    align-items: center

  /* bloco centralizado, mas com os ícones alinhados numa coluna só */
  .rodape__contatos
    align-items: flex-start
    width: fit-content
    max-width: 100%
    margin-inline: auto

  .rodape__contato
    text-align: left

  .rodape__base
    flex-direction: column
    justify-content: center
    padding: 28px 0 0
    text-align: center

/* ---- menos movimento ---- */
@media (prefers-reduced-motion: reduce)
  .whatsapp-float
    animation: none
    transition: none

  .rodape__contato,
  .rodape__links a,
  .rodape__ico,
  .whatsapp-float__balao
    transition: none
</style>
