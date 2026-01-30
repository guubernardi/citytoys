<template>
  <div class="footer-wrapper">
    <footer class="rodape-premium" id="contato" aria-label="Rodapé com informações de contato">
      <div class="glow-line"></div>

      <div class="container">
        <div class="footer-content">
          <div class="brand-section">
            <h3 class="footer-logo">
              City <span class="text-destaque">Toys</span>
            </h3>
            <p class="footer-desc">Soluções em diversão, praticidade e magia para festas infantis no RJ.</p>
          </div>

          <div class="contact-section">
            <a href="mailto:citytoyslocacoesdebrinquedos@gmail.com" class="contact-item">
              <span class="icon">
                <img src="/images/email.svg" alt="Icone Email" width="20" height="20" />
              </span>
              <span class="text">citytoyslocacoesdebrinquedos@gmail.com</span>
            </a>

            <a href="https://wa.me/5521984848699" target="_blank" rel="noopener" class="contact-item">
              <span class="icon">
                <img src="/images/whatsapp.svg" alt="Icone WhatsApp" width="20" height="20" />
              </span>
              <span class="text">+55 21 98484-8699</span>
            </a>

            <a href="https://www.instagram.com/city_toysbrinquedos/" target="_blank" rel="noopener" class="contact-item">
              <span class="icon">
                <img src="/images/instagram.svg" alt="Icone instagram" width="20" height="20" />
              </span>
              <span class="text">@city_toysbrinquedos</span>
            </a>
          </div>
        </div>

        <div class="divider"></div>

        <div class="footer-bottom">
          <div class="copyright">
            <p>&copy; {{ anoAtual }} City Toys Brinquedos. Todos os direitos reservados.</p>
          </div>

          <div class="dev-credit">
            <p>
              Site feito por
              <NuxtLink to="http://gustavobernardi.com/" target="_blank" rel="noopener noreferrer" class="dev-link">
                Gustavo Bernardi
              </NuxtLink>
            </p>
          </div>
        </div>
      </div>
    </footer>

    <NuxtLink
      to="https://wa.me/5521984848699"
      class="whatsapp-float"
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.48s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    </NuxtLink>

    <button
      type="button"
      id="botao-abrir-chat"
      class="botao-abrir-chat"
      aria-label="Abrir ajuda do Gênio"
      @click="toggleChat"
      :class="{ 'chat-ativo': chatAberto }"
    >
      <div class="icon-wrapper">
        <svg height="20" width="20" fill="#FFFFFF" viewBox="0 0 24 24" class="sparkle" aria-hidden="true">
          <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
        </svg>
      </div>
      <span class="label-btn">Ajuda do Gênio</span>
    </button>

    <div class="janela-chat" id="janela-chat" :class="{ 'is-open': chatAberto }" role="dialog" aria-label="Chat do Gênio">
      <div class="cabecalho-chat">
        <div class="avatar-glow">
          <span class="icone-genio">
            <svg height="20" width="20" fill="#FFFFFF" viewBox="0 0 24 24" class="sparkle" aria-hidden="true">
              <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>
          </span>
        </div>

        <div class="info-chat">
          <h3>Gênio da Diversão</h3>
          <p class="status-dot">Online agora</p>
        </div>

        <button type="button" class="botao-fechar-chat" aria-label="Fechar chat" @click="fecharChat">&times;</button>
      </div>

      <div class="corpo-chat" id="corpo-chat" ref="corpoChatRef">
        <div v-for="m in mensagens" :key="m.id" class="mensagem" :class="m.role === 'bot' ? 'robo' : 'user'">
          <div class="texto-msg" v-html="formatMsg(m.text)"></div>
          <span class="horario-msg">{{ fmtHora(m.at) }}</span>
        </div>

        <div v-if="digitando" class="mensagem robo">
          <div class="texto-msg">✨ Pensando no combo ideal...</div>
          <span class="horario-msg">...</span>
        </div>

        <div class="sugestao-box" v-if="mensagens.length <= 2">
          <small>Sugestão:</small>
          <p>"Festa de 5 anos para 20 crianças em salão fechado"</p>
        </div>
      </div>

      <div class="rodape-chat">
        <div class="input-wrapper">
          <input
            type="text"
            v-model="mensagem"
            placeholder="Digite aqui..."
            autocomplete="off"
            @keydown.enter.prevent="enviarMensagem"
          />
          <button type="button" class="btn-send" @click="enviarMensagem" :disabled="!mensagem.trim()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'

type Role = 'bot' | 'user'
type ChatMsg = { id: string; role: Role; text: string; at: number }

type Ctx = {
  ages: number[]
  kids: number | null
  venue: 'indoor' | 'outdoor' | null
  space: 'small' | 'medium' | 'large' | null
  wantsBudget: boolean
  wantsWhats: boolean
  mentions: { pula: boolean; toboga: boolean; piscina: boolean; combo: boolean }
}

const anoAtual = computed(() => new Date().getFullYear())
const chatAberto = ref(false)
const mensagem = ref('')
const digitando = ref(false)
const corpoChatRef = ref<HTMLElement | null>(null)

const mensagens = ref<ChatMsg[]>([
  {
    id: uid(),
    role: 'bot',
    text: 'Olá! Sou o Gênio 🧞‍♂️\n\nMe conte a idade das crianças e onde será a festa, que eu faço a mágica acontecer!',
    at: Date.now()
  }
])

const ctxGlobal = ref<Ctx>({
  ages: [],
  kids: null,
  venue: null,
  space: null,
  wantsBudget: false,
  wantsWhats: false,
  mentions: { pula: false, toboga: false, piscina: false, combo: false }
})

const abrirChat = async () => {
  chatAberto.value = true
  await nextTick()
  scrollToBottom()
}

const fecharChat = () => {
  chatAberto.value = false
}

const toggleChat = () => {
  chatAberto.value ? fecharChat() : abrirChat()
}

const enviarMensagem = async () => {
  const txt = mensagem.value.trim()
  if (!txt) return

  pushMsg('user', txt)
  mensagem.value = ''
  digitando.value = true

  try {
    await wait(800) // Delay natural

    const novo = extrairContexto(txt)
    ctxGlobal.value = mergeCtx(ctxGlobal.value, novo)
    const resposta = gerarRespostaGenio(ctxGlobal.value)

    pushMsg('bot', resposta)
    persistir()
  } catch (err) {
    console.error('[Gênio] Erro:', err)
    pushMsg('bot', 'Eita… minha lâmpada falhou! 😅 Tenta me dizer a idade e o tipo de espaço de novo?')
  } finally {
    digitando.value = false
    await nextTick()
    scrollToBottom()
  }
}

/* --- Helpers de Interface --- */
watch(() => [chatAberto.value, mensagens.value.length], async () => {
  if (chatAberto.value) {
    await nextTick()
    scrollToBottom()
  }
})

function uid() { return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}` }
function pushMsg(role: Role, text: string) { mensagens.value.push({ id: uid(), role, text, at: Date.now() }) }
function wait(ms: number) { return new Promise((r) => setTimeout(r, ms)) }
function scrollToBottom() { if (corpoChatRef.value) corpoChatRef.value.scrollTop = corpoChatRef.value.scrollHeight }
function fmtHora(ts: number) { return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }

/* --- Persistência --- */
function persistir() {
  if (process.server) return
  localStorage.setItem('citytoys.geniochat', JSON.stringify(mensagens.value))
  localStorage.setItem('citytoys.genioctx', JSON.stringify(ctxGlobal.value))
}

onMounted(() => {
  const savedMsgs = localStorage.getItem('citytoys.geniochat')
  if (savedMsgs) mensagens.value = JSON.parse(savedMsgs)
  
  const savedCtx = localStorage.getItem('citytoys.genioctx')
  if (savedCtx) ctxGlobal.value = JSON.parse(savedCtx)
})

function formatMsg(raw: string) {
  const text = String(raw ?? '')
  const lines = text.split('\n')
  let html = ''
  
  lines.forEach(line => {
    let formatted = line.trim()
    if (!formatted) {
      html += '<div class="msg-spacer"></div>'
      return
    }

    // Negrito e Links
    formatted = formatted
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>')

    if (formatted.startsWith('•') || formatted.startsWith('-')) {
      html += `<li class="msg-li">${formatted.substring(1).trim()}</li>`
    } else {
      html += `<p class="msg-p">${formatted}</p>`
    }
  })
  return html
}

function norm(s: string) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') }

function extrairContexto(texto: string): Partial<Ctx> {
  const t = norm(texto)
  const ages: number[] = []
  const ageMatch = t.match(/\b(\d{1,2})\b/g)
  if (ageMatch) ageMatch.forEach(n => { if (Number(n) < 16) ages.push(Number(n)) })

  const kidsMatch = t.match(/(\d{1,3})\s*(criancas|kids|pessoas|convidados)/)
  
  return {
    ages,
    kids: kidsMatch ? Number(kidsMatch[1]) : null,
    venue: /(aberto|ar livre|quintal|rua|externo)/.test(t) ? 'outdoor' : /(fechado|salao|apartamento|interno)/.test(t) ? 'indoor' : null,
    space: /(grande|quadra|espacos)/.test(t) ? 'large' : /(pequeno|apto|sala)/.test(t) ? 'small' : null,
    wantsBudget: /(orcamento|valor|preco|quanto)/.test(t),
    wantsWhats: /(whats|zap|contato)/.test(t),
    mentions: {
      pula: /pula/.test(t),
      toboga: /toboga|escorrega/.test(t),
      piscina: /piscina|bolinha/.test(t),
      combo: /combo|kit/.test(t)
    }
  }
}

function mergeCtx(a: Ctx, b: Partial<Ctx>): Ctx {
  return {
    ...a,
    ...b,
    ages: [...new Set([...a.ages, ...(b.ages || [])])],
    mentions: { ...a.mentions, ...b.mentions }
  }
}

function gerarRespostaGenio(ctx: Ctx) {
  if (ctx.wantsWhats || ctx.wantsBudget) {
    return "Com certeza! 😄 Pra te passar os valores certinhos e ver a disponibilidade:\n\n👉 **Chama no Zap:** https://wa.me/5521984848699"
  }

  const faltas = []
  if (!ctx.ages.length) faltas.push("a **idade** das crianças")
  if (!ctx.venue) faltas.push("se o local é **aberto ou fechado**")

  if (faltas.length) {
    return `Show! Para eu te sugerir o brinquedo perfeito, me diz: ${faltas.join(' e ')}?`
  }

  let rec = "Opa! Para essa idade, eu recomendo muito o nosso **Pula-Pula Castelo**"
  if (ctx.ages.some(a => a < 3)) rec = "Como tem bebês, a **Piscina de Bolinhas Premium** é imbatível! 🫧"
  if (ctx.space === 'small') rec += " (ele cabe direitinho em espaços menores!)"
  
  return `${rec}\n\nQuer que eu veja o valor com frete para o seu bairro?`
}
</script>
  
  <style lang="sass" scoped>
  $cor-azul-bg: #242B5E
  $cor-turquesa: #22d3ee
  $transicao: all 0.3s ease
  
  .rodape-premium
    background-color: $cor-azul-bg
    color: #f8fafc
    padding: 0 0 20px
    position: relative
    font-family: var(--fonte, sans-serif)
    overflow: hidden
  
  .glow-line
    width: 100%
    height: 4px
    background: linear-gradient(90deg, transparent, $cor-turquesa, transparent)
    margin-bottom: 40px
    opacity: 0.6
  
  .container
    max-width: 1200px
    margin: 0 auto
    padding: 0 20px
  
  .footer-content
    display: flex
    justify-content: space-between
    align-items: center
    flex-wrap: wrap
    gap: 30px
    padding-bottom: 40px
  
    @media (max-width: 768px)
      flex-direction: column
      text-align: center
      justify-content: center
  
  .brand-section
    max-width: 400px
  
  .footer-logo
    font-size: 2rem
    font-weight: 800
    letter-spacing: -1px
    margin-bottom: 10px
    color: white
  
    .text-destaque
      color: $cor-turquesa
      text-shadow: 0 0 15px rgba(34, 211, 238, 0.2)
  
  .footer-desc
    font-size: 0.9rem
    color: #94a3b8
    line-height: 1.5
  
  .contact-section
    display: flex
    gap: 30px
    align-items: center
  
    @media (max-width: 768px)
      flex-direction: column
      gap: 15px
  
  .contact-item
    display: flex
    align-items: center
    gap: 8px
    color: #cbd5e1
    text-decoration: none
    font-size: 0.9rem
    transition: $transicao
    padding: 8px 12px
    border-radius: 8px
  
    &:hover
      background: rgba(255,255,255,0.05)
      color: $cor-turquesa
      transform: translateY(-2px)
  
  .divider
    height: 1px
    background: rgba(255,255,255,0.08)
    margin-bottom: 20px
    width: 100%
  
  .footer-bottom
    display: flex
    justify-content: space-between
    align-items: center
    font-size: 0.8rem
    color: #64748b
    flex-wrap: wrap
    gap: 10px
  
    @media (max-width: 600px)
      flex-direction: column
      text-align: center
  
  .dev-link
    color: #94a3b8
    text-decoration: none
    border-bottom: 1px dotted #64748b
    transition: $transicao
  
    &:hover
      color: $cor-turquesa
      border-bottom-style: solid
  
  .whatsapp-float
    position: fixed
    right: 20px
    bottom: 20px
    width: 60px
    height: 60px
    border-radius: 50%
    background: #25D366
    box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4)
    display: flex
    align-items: center
    justify-content: center
    z-index: 100
    transition: $transicao
    animation: pulse 3s infinite
  
    &:hover
      transform: scale(1.1) rotate(10deg)
  
  .botao-abrir-chat
    position: fixed
    left: 20px
    bottom: 20px
    z-index: 100
    display: flex
    align-items: center
    gap: 12px
    padding: 10px 20px 10px 10px
    border-radius: 50px
    background: #0B4AA2
    backdrop-filter: blur(10px)
    border: 1px solid rgba(255,255,255,0.1)
    color: white
    cursor: pointer
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3)
    transition: $transicao
    font-family: var(--fonte, sans-serif)
    display: none
  
    .icon-wrapper
      width: 36px
      height: 36px
      background: linear-gradient(135deg, #5a4AA2, #00C4CC)
      border-radius: 50%
      display: flex
      align-items: center
      justify-content: center
  
    .label-btn
      font-weight: 600
      font-size: 1rem
  
    &:hover
      transform: translateY(-4px)
  
  .janela-chat
    position: fixed
    left: 20px
    bottom: 90px
    width: 340px
    max-width: calc(100vw - 40px)
    height: 480px
    border-radius: 24px
    background: white
    border: 1px solid rgba(255, 255, 255, 0.1)
    box-shadow: 0 20px 50px rgba(0,0,0,0.5)
    display: flex
    flex-direction: column
    overflow: hidden
    z-index: 101
    opacity: 0
    transform: translateY(20px) scale(0.95)
    pointer-events: none
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1)
    font-family: var(--fonte, sans-serif)
    display: none
  
    &.is-open
      opacity: 1
      transform: translateY(0) scale(1)
      pointer-events: auto
  
  .cabecalho-chat
    background: #0B4AA2
    padding: 16px
    display: flex
    align-items: center
    gap: 12px
  
    .avatar-glow
      width: 40px
      height: 40px
      background: rgba(255,255,255,0.1)
      border-radius: 50%
      display: flex
      align-items: center
      justify-content: center
  
    .info-chat
      h3
        font-size: 1rem
        color: white
        margin: 0
      .status-dot
        font-size: 0.75rem
        color: #4ade80
        margin: 0
  
    .botao-fechar-chat
      margin-left: auto
      background: none
      border: none
      color: rgba(255,255,255,0.6)
      font-size: 1.5rem
      cursor: pointer
  
  .corpo-chat
    flex: 1
    padding: 20px
    background: white
    overflow-y: auto
    display: flex
    flex-direction: column
    gap: 12px
    color: #0a0a0a
  
  .mensagem
    max-width: 88%
    display: flex
    flex-direction: column
    gap: 6px
  
    &.robo
      align-self: flex-start
      background: #F0F4F8
      border-radius: 18px
      padding: 12px 16px
  
    &.user
      align-self: flex-end
      background: #E8F4FF
      border-radius: 18px
      padding: 12px 16px
  
  .horario-msg
    display: block
    font-size: 10px
    opacity: 0.5
    text-align: right
  
  .texto-msg
    font-size: 0.95rem
    line-height: 1.5
    word-break: break-word
  
    .msg-p
      margin: 0 0 8px
  
    .msg-spacer
      height: 8px
  
    .msg-ul, .msg-ol
      margin: 6px 0 10px 18px
      padding: 0
  
    .msg-ul li, .msg-ol li
      margin: 4px 0
  
    strong
      font-weight: 800
  
    a
      color: #0B4AA2
      text-decoration: underline
  
  .sugestao-box
    margin-top: auto
    background: #F0F4F8
    border: 1px dashed rgba(11, 74, 162, 0.45)
    padding: 10px
    border-radius: 12px
    font-size: 0.8rem
  
  .rodape-chat
    padding: 15px
    background: #0B4AA2
  
    .input-wrapper
      display: flex
      gap: 8px
      background: rgba(255,255,255,0.1)
      padding: 6px
      border-radius: 12px
  
      input
        flex: 1
        background: transparent
        border: none
        color: white
        padding: 0 10px
  
        &:focus
          outline: none
  
        &::placeholder
          color: rgba(255,255,255,0.5)
  
      .btn-send
        background: transparent
        border: none
        color: white
        cursor: pointer
        padding: 5px
        opacity: 0.95
  
        &:disabled
          opacity: 0.4
          cursor: not-allowed
  
  @keyframes pulse
    0%
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7)
    70%
      box-shadow: 0 0 0 15px rgba(37, 211, 102, 0)
    100%
      box-shadow: 0 0 0 0 rgba(37, 211, 102, 0)
  </style>
  