// Tema sazonal do site — hoje, Dia das Crianças.
//
// Tudo que a campanha precisa saber mora aqui: quando ela entra, quando sai,
// os textos que vão pro ar e o link do WhatsApp temático. Fora da janela o
// site volta sozinho ao visual padrão — não precisa de deploy no dia seguinte
// ao feriado pra desligar o tema.

import { computed } from 'vue'
import { useState } from '#app'

const WHATS_NUMERO = '5521984848699'

// Janela da campanha, no fuso do Rio. Os dois extremos entram.
// O fim é 13/10 (um dia depois do feriado) pra pegar quem busca de última hora.
const INICIO = '2026-09-19'
const FIM = '2026-10-13'

/**
 * Copy da campanha, num lugar só.
 *
 * ⚠️ ATENÇÃO — esse texto vai público.
 * Ele fala em "sob consulta" de propósito: não afirma que outubro esgotou nem
 * promete data livre. O calendário do /montar-combo bloqueia outubro inteiro
 * (ver MES_OUTUBRO no MontarCombo.vue), mas isso vale só pro combo promocional
 * — não é a agenda da empresa. Só troque por uma afirmação mais forte, do tipo
 * "outubro esgotado", depois de confirmar a agenda real com o cliente.
 */
export const COPY_TEMA = {
  faixa: 'Dia das Crianças chegando! As datas de outubro estão sob consulta.',
  faixaCta: 'Garantir minha data',
  faixaCurta: 'Dia das Crianças · datas sob consulta',

  // Título do hero na campanha: "Feliz" + "Dia das" na fita + "Crianças" em letras coloridas.
  tituloTag: 'Feliz',
  tituloFita: 'Dia das',
  tituloDestaque: 'Crianças',
  //   = espaço que não quebra linha: "City Toys" nunca fica partido em duas linhas.
  subtituloHero: 'Dia das Crianças chegando e a diversão tá aqui na City Toys. Garanta já os brinquedos da sua festa!',

  // Seção de brinquedos: selo acima do título e selo dos brinquedos em destaque.
  seloBrinquedos: 'Especial Dia das Crianças',
  seloDestaque: 'Top Dia das Crianças',

  // Conversa de exemplo do "Passo a passo" (passo 2). A City Toys responde que
  // vai conferir, sem prometer data: outubro está sob consulta.
  chatPassoAPasso: {
    pergunta: 'Oi! Quero um Castelinho pra festa do Dia das Crianças 🎉',
    resposta: 'Oba! Me passa a data e o bairro que eu já confiro 🎈',
    confirmacao: 'Show! Te mando agora 🥳'
  },

  faqPergunta: 'Dá pra alugar no Dia das Crianças?',
  faqResposta:
    'O Dia das Crianças é a data mais concorrida do ano e a nossa agenda de outubro fecha cedo. ' +
    'Confirme a disponibilidade pelo WhatsApp o quanto antes: se o dia que você quer já estiver ' +
    'fechado, a gente te ajuda a encaixar a festa na semana seguinte.'
}

// Data de hoje no fuso do Rio, no formato YYYY-MM-DD.
// O servidor pode rodar em UTC, mas a virada do tema tem que seguir o Rio —
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
  // hidratação) — datas ISO comparam certinho como string.
  const hoje = useState('tema-sazonal-hoje', dataDeHojeNoRio)

  const temaAtivo = computed(() => hoje.value >= INICIO && hoje.value <= FIM)

  // Mensagem única da campanha: já chega no WhatsApp identificada como lead
  // de Dia das Crianças, sem precisar de parâmetro na URL.
  const linkWhatsTema = computed(() => {
    const msg =
      'Olá! Vim pelo site da City Toys 🎈\n' +
      'Quero alugar brinquedo para o Dia das Crianças.\n\n' +
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
      campanha: 'dia-das-criancas',
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
