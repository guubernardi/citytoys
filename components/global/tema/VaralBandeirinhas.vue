<template>
  <div class="varal" aria-hidden="true">
    <svg
      v-for="gomo in gomos"
      :key="gomo"
      class="varal__gomo"
      :class="`varal__gomo--${gomo}`"
      viewBox="0 0 480 84"
      preserveAspectRatio="xMidYMin meet"
    >
      <path class="varal__corda" d="M0,4 Q240,68 480,4" />
      <g v-for="(b, i) in bandeiras" :key="i" :transform="`translate(${b.x} ${b.y}) rotate(${b.angulo})`">
        <polygon
          class="varal__bandeira"
          points="-15,0 15,0 0,32"
          :fill="corBandeira(gomo, i)"
          :style="{ animationDelay: `${-(gomo * 9 + i) * 0.3}s` }"
        />
      </g>
      <circle class="varal__no" cx="0" cy="4" r="5" />
      <circle class="varal__no" cx="480" cy="4" r="5" />
    </svg>
  </div>
</template>

<script setup lang="ts">
// Varal de bandeirinhas do tema sazonal, feito de "gomos" iguais emendados.
// Ocupa a largura que o pai der; quem posiciona é o pai (via class).
//
// Com mais de um gomo, o 3º some até 1024px e o 2º até 600px: é o que mantém
// as bandeirinhas na proporção certa quando o varal atravessa a tela toda.
withDefaults(defineProps<{ gomos?: number }>(), { gomos: 3 })

type Bandeira = { x: number; y: number; angulo: number }

const CORES_BANDEIRAS = ['#ff3b3b', '#ffd23f', '#2b74eb', '#2ecc71', '#ff9a00']
const BANDEIRAS_POR_GOMO = 9

// Bandeirinhas penduradas na mesma curva do <path> da corda (Bézier
// quadrática). Sem aleatoriedade e arredondado, pra sair idêntico no servidor
// e no navegador (sem mismatch de hidratação).
function gerarGomo(quantidade: number): Bandeira[] {
  const p0 = { x: 0, y: 4 }
  const p1 = { x: 240, y: 68 }
  const p2 = { x: 480, y: 4 }
  const arredondar = (v: number) => Math.round(v * 10) / 10

  return Array.from({ length: quantidade }, (_, i) => {
    const t = (i + 0.5) / quantidade
    const u = 1 - t
    const dx = 2 * u * (p1.x - p0.x) + 2 * t * (p2.x - p1.x)
    const dy = 2 * u * (p1.y - p0.y) + 2 * t * (p2.y - p1.y)

    return {
      x: arredondar(u * u * p0.x + 2 * u * t * p1.x + t * t * p2.x),
      y: arredondar(u * u * p0.y + 2 * u * t * p1.y + t * t * p2.y),
      angulo: arredondar((Math.atan2(dy, dx) * 180) / Math.PI)
    }
  })
}

const bandeiras = gerarGomo(BANDEIRAS_POR_GOMO)

// A sequência de cores continua de um gomo pro outro, como num varal só.
function corBandeira(gomo: number, i: number) {
  return CORES_BANDEIRAS[((gomo - 1) * BANDEIRAS_POR_GOMO + i) % CORES_BANDEIRAS.length]
}
</script>

<style lang="sass" scoped>
.varal
  display: flex
  align-items: flex-start

.varal__gomo
  flex: 1 1 0
  min-width: 0
  height: auto
  overflow: visible

@media (max-width: 1024px)
  .varal__gomo--3
    display: none

@media (max-width: 600px)
  .varal__gomo--2
    display: none

/* Corda branca por padrão (pensada pro céu do hero). Em fundo claro, o pai
   troca a cor com --varal-corda. */
.varal__corda
  fill: none
  stroke: var(--varal-corda, rgba(255,255,255,.85))
  stroke-width: 2.5
  vector-effect: non-scaling-stroke

/* nó amarelo em cada emenda dos gomos */
.varal__no
  fill: #ffd23f

.varal__bandeira
  transform-box: fill-box
  transform-origin: 50% 0
  animation: bandeira-tremular 2.6s ease-in-out infinite

@keyframes bandeira-tremular
  0%, 100%
    transform: rotate(-6deg)
  50%
    transform: rotate(6deg)

@media (prefers-reduced-motion: reduce)
  .varal__bandeira
    animation: none
</style>
