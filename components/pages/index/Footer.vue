<template>
  <div class="footer-wrapper">
    <footer class="rodape" :class="{ 'rodape--tema': temaAtivo }" id="contato" aria-label="Rodapé com informações de contato">
      <div class="rodape__brilho" aria-hidden="true"></div>

      <div class="container">
        <div class="rodape__grade">
          <!-- marca -->
          <div class="rodape__marca">
            <img class="rodape__logo" src="/images/logo-citytoys.svg" alt="City Toys" width="180" height="92" />

            <p class="rodape__desc">Soluções em diversão, praticidade e magia para festas infantis no RJ.</p>
          </div>

          <!-- atalhos -->
          <nav class="rodape__bloco" aria-label="Navegação do rodapé">
            <h2 class="rodape__titulo">Navegue</h2>

            <ul class="rodape__links">
              <li v-for="l in links" :key="l.href">
                <NuxtLink v-if="l.href.startsWith('/')" :to="l.href">{{ l.label }}</NuxtLink>
                <a v-else :href="l.href">{{ l.label }}</a>
              </li>
            </ul>
          </nav>

          <!-- contato -->
          <div class="rodape__bloco">
            <h2 class="rodape__titulo">Fale com a gente</h2>

            <ul class="rodape__contatos">
              <li>
                <a class="rodape__contato" :href="linkWhats" target="_blank" rel="noopener">
                  <span class="rodape__ico rodape__ico--whats"><SvgIcone nome="whatsapp" :tamanho="20" /></span>
                  <span class="rodape__contato-texto">
                    <strong>WhatsApp</strong>
                    <small>{{ TELEFONE_VISIVEL }}</small>
                  </span>
                </a>
              </li>

              <li>
                <a class="rodape__contato" :href="`mailto:${EMAIL_CONTATO}`">
                  <span class="rodape__ico rodape__ico--email"><SvgIcone nome="envelope-1" :tamanho="20" /></span>
                  <span class="rodape__contato-texto">
                    <strong>E-mail</strong>
                    <small>{{ EMAIL_CONTATO }}</small>
                  </span>
                </a>
              </li>

              <li>
                <a class="rodape__contato" :href="INSTAGRAM_URL" target="_blank" rel="noopener">
                  <span class="rodape__ico rodape__ico--insta"><SvgIcone nome="instagram" :tamanho="20" /></span>
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
            <NuxtLink to="http://gustavobernardi.com/" target="_blank" rel="noopener noreferrer" class="rodape__dev">
              Gustavo Bernardi
            </NuxtLink>
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
import { computed } from 'vue'
import { useTemaSazonal } from '~/composables/useTemaSazonal'
import { EMAIL_CONTATO, INSTAGRAM_URL, WHATS_NUMERO } from '~/helpers/seo.js'

const { temaAtivo } = useTemaSazonal()

// Contato e bairros vêm do helpers/seo.js, que já é a fonte única do site.
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
</script>

<style lang="sass" scoped>
$fundo: #052a54
$acento: #ffd23f
$claro: #cbd7e8
$apagado: #8fa3bd

.rodape
  position: relative
  /* Sem a antiga linha dourada do topo: a onda no fim do FAQ já faz a divisão,
     e uma linha reta logo abaixo dela virava uma segunda divisória. */
  padding: 56px 0 22px
  background: linear-gradient(180deg, #{$fundo} 0%, #04203f 100%)
  color: #f8fafc
  font-family: var(--fonte, sans-serif)
  overflow: hidden

/* brilho suave no topo, pra não ficar um bloco azul chapado */
.rodape__brilho
  position: absolute
  inset: 0
  pointer-events: none
  background: radial-gradient(60% 70% at 18% 0%, rgba(255,210,63,.10), rgba(255,210,63,0) 60%), radial-gradient(50% 60% at 82% 6%, rgba(0,194,199,.12), rgba(0,194,199,0) 60%)

.container
  position: relative
  z-index: 1
  max-width: var(--largura-max)
  margin: 0 auto
  padding: 0 var(--container-px)

.rodape__grade
  display: grid
  grid-template-columns: 1.6fr 1fr 1.4fr
  gap: 44px
  padding-bottom: 38px

/* ---- marca ---- */
.rodape__logo
  width: 180px
  height: auto
  display: block

.rodape__desc
  margin: 16px 0 0
  max-width: 320px
  color: $apagado
  font-size: .95rem
  line-height: 1.6

/* ---- títulos das colunas ---- */
.rodape__titulo
  position: relative
  margin: 0 0 18px
  padding-bottom: 10px
  font-size: .95rem
  font-weight: 900
  letter-spacing: .6px
  text-transform: uppercase

  &::after
    content: ""
    position: absolute
    left: 0
    bottom: 0
    width: 28px
    height: 3px
    border-radius: 999px
    background: linear-gradient(90deg, #{$acento}, #00c2c7)

/* ---- atalhos ---- */
.rodape__links
  display: flex
  flex-direction: column
  gap: 10px
  margin: 0
  padding: 0
  list-style: none

  a
    position: relative
    display: inline-block
    padding-left: 0
    color: $claro
    font-size: .95rem
    text-decoration: none
    transition: color .25s ease, padding-left .25s ease

    /* bolinha que aparece no hover */
    &::before
      content: ""
      position: absolute
      top: 50%
      left: 0
      width: 6px
      height: 6px
      margin-top: -3px
      border-radius: 50%
      background: $acento
      opacity: 0
      transform: scale(.4)
      transition: opacity .25s ease, transform .25s ease

    &:hover
      color: #ffffff
      padding-left: 16px

      &::before
        opacity: 1
        transform: scale(1)

    &:focus-visible
      outline: 3px solid rgba(255,210,63,.6)
      outline-offset: 3px
      border-radius: 6px

/* ---- contatos ---- */
.rodape__contatos
  display: flex
  flex-direction: column
  gap: 10px
  margin: 0
  padding: 0
  list-style: none

.rodape__contato
  display: flex
  align-items: center
  gap: 12px
  padding: 8px
  border-radius: 14px
  color: $claro
  text-decoration: none
  transition: background .25s ease, transform .25s ease, color .25s ease

  &:hover
    background: rgba(255,255,255,.06)
    color: #ffffff
    transform: translateX(3px)

  &:focus-visible
    outline: 3px solid rgba(255,210,63,.6)
    outline-offset: 2px

.rodape__ico
  flex: none
  display: grid
  place-items: center
  width: 40px
  height: 40px
  border-radius: 12px
  background: rgba(255,255,255,.07)
  transition: background .25s ease, color .25s ease

.rodape__ico--whats
  color: #43d38d

.rodape__ico--email
  color: $acento

.rodape__ico--insta
  color: #ff6fae

.rodape__contato:hover .rodape__ico
  background: currentColor

  :deep(svg)
    color: #052a54

.rodape__contato-texto
  display: flex
  flex-direction: column
  min-width: 0

  strong
    font-size: .95rem
    font-weight: 900

  small
    color: $apagado
    font-size: .85rem
    overflow-wrap: anywhere

/* ---- base ---- */
.rodape__base
  display: flex
  align-items: center
  justify-content: space-between
  flex-wrap: wrap
  gap: 10px
  /* espaço à direita pro botão flutuante do WhatsApp não cobrir o crédito */
  padding: 20px 90px 0 0
  border-top: 1px solid rgba(255,255,255,.08)
  color: #6f86a3
  font-size: .82rem

  p
    margin: 0

.rodape__dev
  color: $apagado
  text-decoration: none
  border-bottom: 1px dotted #64748b
  transition: color .25s ease, border-color .25s ease

  &:hover
    color: $acento
    border-bottom-style: solid

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
  transition: transform .3s ease
  animation: pulsar-whats 3s infinite

  &:hover
    transform: scale(1.08)

  &:focus-visible
    outline: 3px solid rgba(255,255,255,.9)
    outline-offset: 3px

/* balãozinho que aparece ao passar o mouse */
.whatsapp-float__balao
  position: absolute
  right: calc(100% + 12px)
  padding: 8px 14px
  border-radius: 999px
  background: #052a54
  color: #ffffff
  font-size: .85rem
  font-weight: 800
  white-space: nowrap
  box-shadow: 0 10px 22px rgba(3,20,54,.28)
  opacity: 0
  transform: translateX(8px)
  pointer-events: none
  transition: opacity .25s ease, transform .25s ease

  &::after
    content: ""
    position: absolute
    top: 50%
    left: 100%
    width: 8px
    height: 8px
    margin-top: -4px
    background: #052a54
    clip-path: polygon(0 0, 100% 50%, 0 100%)

.whatsapp-float:hover .whatsapp-float__balao,
.whatsapp-float:focus-visible .whatsapp-float__balao
  opacity: 1
  transform: translateX(0)

@keyframes pulsar-whats
  0%
    box-shadow: 0 0 0 0 rgba(37,211,102,.7)
  70%
    box-shadow: 0 0 0 15px rgba(37,211,102,0)
  100%
    box-shadow: 0 0 0 0 rgba(37,211,102,0)

/* ---- responsivo ---- */
@media (max-width: 1000px)
  .rodape__grade
    grid-template-columns: 1fr 1fr
    gap: 34px

@media (max-width: 620px)
  .rodape
    /* folga embaixo: no fim da página o botão flutuante fica em cima do texto */
    padding: 44px 0 86px

  .rodape__base
    padding: 20px 0 0

  .rodape__grade
    grid-template-columns: 1fr
    gap: 30px
    text-align: center

  .rodape__logo,
  .rodape__desc
    margin-inline: auto

  .rodape__titulo::after
    left: 50%
    margin-left: -14px

  .rodape__links a:hover
    padding-left: 0

  .rodape__links a::before
    display: none

  .rodape__contato
    justify-content: center
    text-align: left

  .rodape__base
    justify-content: center
    text-align: center

/* ---- tema sazonal (Dia das Crianças) ---- */
.rodape--tema .rodape__brilho
  background-image: var(--tema-confete-fundo), radial-gradient(60% 70% at 18% 0%, rgba(255,210,63,.10), rgba(255,210,63,0) 60%), radial-gradient(50% 60% at 82% 6%, rgba(0,194,199,.12), rgba(0,194,199,0) 60%)
  background-size: 240px 240px, auto, auto
  /* no azul-escuro o confete fica muito mais forte do que nas seções claras */
  opacity: .32

/* ---- menos movimento ---- */
@media (prefers-reduced-motion: reduce)
  .whatsapp-float
    animation: none
    transition: none

  .rodape__contato,
  .rodape__links a,
  .whatsapp-float__balao
    transition: none
</style>
