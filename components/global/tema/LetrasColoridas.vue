<template>
  <span class="letras-coloridas" :class="{ 'letras-coloridas--claro': fundo === 'claro' }">
    <span
      v-for="(l, i) in letras"
      :key="i"
      class="letra"
      :style="{ '--cor': l.cor, '--giro': `${i % 2 ? 3 : -3}deg`, '--atraso': `${i * 0.12}s` }"
    >{{ l.letra }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Palavra em "letras de inflável" do tema sazonal: cada letra numa cor, com
// brilho e volume, pulando de leve. É texto de verdade, então continua legível
// pro Google e pra leitor de tela. O tamanho vem do font-size de quem usa.
const props = withDefaults(
  defineProps<{
    texto: string
    fundo?: 'escuro' | 'claro' | 'noite'
  }>(),
  { fundo: 'escuro' }
)

// Cada fundo pede uma paleta, sempre com contraste de pelo menos 3:1:
// - escuro: céu ou foto (hero), vale o amarelo;
// - claro: fundo branco, onde o amarelo some;
// - noite: azul-escuro (Benefícios), onde azul e roxo sumiriam, então só cores claras.
const PALETAS = {
  escuro: ['#ffd23f', '#ff3b3b', '#2ecc71', '#ff9a00', '#00c2c7', '#a45cff', '#ffd23f', '#2b74eb'],
  claro: ['#e5343a', '#1e9e57', '#e86f00', '#0a9da2', '#8b3fe0', '#2b74eb'],
  noite: ['#ffd23f', '#ff6b6b', '#4ade80', '#ffb347', '#22d3ee', '#d8b4fe', '#ff9ecb']
}

const letras = computed(() => {
  const cores = PALETAS[props.fundo]
  return Array.from(props.texto).map((letra, i) => ({ letra, cor: cores[i % cores.length] }))
})
</script>

<style lang="sass" scoped>
.letras-coloridas
  display: inline-flex

/* Base que funciona em qualquer navegador: cor chapada + sombra de volume. */
.letra
  display: inline-block
  color: var(--cor)
  text-shadow: 0 .03em 0 rgba(0,0,0,.2), 0 .08em .17em rgba(3,20,54,.35)
  transform: rotate(var(--giro))
  animation: letra-pular 2.8s ease-in-out infinite
  animation-delay: var(--atraso)

/* Onde der, vira "inflável": brilho em cima, sombra da própria cor embaixo.
   Fica dentro do @supports porque sem color-mix o texto ficaria transparente. */
@supports (color: color-mix(in srgb, red 50%, white))
  .letra
    text-shadow: none
    background: linear-gradient(180deg, color-mix(in srgb, var(--cor) 45%, #ffffff) 0%, var(--cor) 42%, color-mix(in srgb, var(--cor) 80%, #000000) 100%)
    -webkit-background-clip: text
    background-clip: text
    -webkit-text-fill-color: transparent
    filter: drop-shadow(0 .03em 0 color-mix(in srgb, var(--cor) 55%, #000000)) drop-shadow(0 .09em .14em rgba(3,20,54,.35))

  /* No fundo claro o brilho é menor (senão o topo da letra some no branco) e a
     sombra é mais leve. */
  .letras-coloridas--claro .letra
    background: linear-gradient(180deg, color-mix(in srgb, var(--cor) 78%, #ffffff) 0%, var(--cor) 45%, color-mix(in srgb, var(--cor) 82%, #000000) 100%)
    -webkit-background-clip: text
    background-clip: text
    filter: drop-shadow(0 .03em 0 color-mix(in srgb, var(--cor) 60%, #000000)) drop-shadow(0 .06em .1em rgba(3,20,54,.16))

@keyframes letra-pular
  0%, 100%
    transform: translateY(0) rotate(var(--giro))
  50%
    transform: translateY(-.045em) rotate(var(--giro))

@media (prefers-reduced-motion: reduce)
  .letra
    animation: none
</style>
