// Tema sazonal do site: hoje, Natal.
//
// Tudo que a campanha precisa saber mora aqui: quando ela entra, quando sai,
// os textos que vão pro ar e o link do WhatsApp temático. Fora da janela o
// site volta sozinho ao visual padrão (sem enfeites de Natal), sem precisar de
// deploy no dia seguinte.
//
// O layout das seções é o mesmo com ou sem tema: o tema só liga os enfeites
// (luzes, gorros, flocos, presentes) e troca a copy pela de fim de ano.
//
// Prévia: abrir qualquer página com ?tema=natal liga o tema na hora, mesmo fora
// da janela. Vale pra navegação inteira (fica no useState).

import { computed } from 'vue'
import { useRoute, useState } from '#app'

const WHATS_NUMERO = '5521984848699'

// Janela da campanha, no fuso do Rio. Os dois extremos entram.
// Entra no dia seguinte ao fim do tema de Dia das Crianças (31/10) e cobre as
// festas de fim de ano.
const INICIO = '2026-11-01'
const FIM = '2026-12-31'

/**
 * Copy da campanha, num lugar só.
 *
 * ⚠️ ATENÇÃO: esse texto vai público.
 * Ele fala em "sob consulta" de propósito: não afirma que dezembro esgotou nem
 * promete data livre. Só troque por uma afirmação mais forte depois de
 * confirmar a agenda real com o cliente.
 */
export const COPY_TEMA = {
  faixa: 'Natal chegando! As datas de dezembro estão sob consulta.',
  faixaCta: 'Garantir minha data',
  faixaCurta: 'Natal chegando! Datas sob consulta',

  // Título do hero na campanha: "Feliz" na etiqueta + "Natal" em letras de inflável.
  tituloTag: 'Feliz',
  tituloFita: '',
  tituloDestaque: 'Natal',
  //   = espaço que não quebra linha: "City Toys" nunca fica partido em duas linhas.
  subtituloHero: 'Natal chegando e a diversão tá aqui na City Toys. Garanta já os brinquedos da sua festa de fim de ano!',

  // Seção de brinquedos: selo acima do título e selo dos brinquedos em destaque.
  seloBrinquedos: 'Especial de Natal',
  seloDestaque: 'Top do Natal',

  // Conversa de exemplo do "Passo a passo" (passo 2). A City Toys responde que
  // vai conferir, sem prometer data: dezembro está sob consulta.
  chatPassoAPasso: {
    pergunta: 'Oi! Quero um Castelinho pra festa de Natal da família 🎄',
    resposta: 'Oba! Me passa a data e o bairro que eu já confiro 😊',
    confirmacao: 'Show! Te mando agora 🎅'
  },

  faqPergunta: 'Dá pra alugar no Natal?',
  faqResposta:
    'Dá sim! Dezembro é um dos meses mais concorridos do ano e a agenda das festas de fim de ano fecha cedo. ' +
    'Confirme a disponibilidade pelo WhatsApp o quanto antes: se o dia que você quer já estiver fechado, ' +
    'a gente te ajuda a encontrar outra data.'
}

// Data de hoje no fuso do Rio, no formato YYYY-MM-DD.
// O servidor pode rodar em UTC, mas a virada do tema tem que seguir o Rio:
// senão o tema entra (ou sai) com algumas horas de diferença do esperado.
function dataDeHojeNoRio() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date())
}

export function useTemaSazonal() {
  // useState serializa no payload o valor calculado no servidor, e o cliente
  // reidrata com ele. Sem isso, uma navegação que atravessa a meia-noite
  // renderizaria server e client com respostas diferentes (mismatch de
  // hidratação). Datas ISO comparam certinho como string.
  const hoje = useState('tema-sazonal-hoje', dataDeHojeNoRio)

  // ?tema=natal liga a prévia. Lido uma vez só (primeira página carregada) e
  // guardado no useState, então sobrevive à navegação interna.
  const route = useRoute()
  const previa = useState('tema-sazonal-previa', () => route.query.tema === 'natal')

  const temaAtivo = computed(() => previa.value || (hoje.value >= INICIO && hoje.value <= FIM))

  // Mensagem única da campanha: já chega no WhatsApp identificada como lead
  // de Natal, sem precisar de parâmetro na URL.
  const linkWhatsTema = computed(() => {
    const msg =
      'Olá! Vim pelo site da City Toys 🎄\n' +
      'Vi a campanha de Natal e quero alugar brinquedo.\n\n' +
      'Data que tenho em mente: ____\n' +
      'Bairro: ____'

    return `https://wa.me/${WHATS_NUMERO}?text=${encodeURIComponent(msg)}`
  })

  // O site já carrega o GTM (ver app.vue). Registrar o clique no dataLayer dá
  // o rastreio por posição da campanha sem sujar a mensagem que o cliente lê.
  function registrarCliqueTema(local: string) {
    if (import.meta.server) return

    const dl = (window as any).dataLayer
    if (!Array.isArray(dl)) return

    dl.push({
      event: 'clique_tema_sazonal',
      campanha: 'natal',
      local
    })
  }

  return {
    temaAtivo,
    linkWhatsTema,
    registrarCliqueTema,
    copy: COPY_TEMA
  }
}
