<template>
  <div class="footer-wrapper">
    <footer class="rodape-premium" id="contato" aria-label="Rodapé com informações de contato">
      <div class="glow-line"></div>

      <div class="container">
        <div class="footer-content">
          <div class="brand-section">
            <img class="footer-logo-img" src="/images/logo-citytoys.svg" alt="City Toys" />
            <p class="footer-desc">Soluções em diversão, praticidade e magia para festas infantis no RJ.</p>
          </div>

          <div class="contact-section">
            <a href="mailto:citytoyslocacoesdebrinquedos@gmail.com" class="contact-item">
              <span class="icon">
                <img src="/images/email.svg" alt="Icone Email" width="20" height="20" />
              </span>
              <span class="text">citytoyslocacoesdebrinquedos@gmail.com</span>
            </a>

            <a href="https://wa.me/5521984848699?text=Ol%C3%A1!%20Vim%20pelo%20site%20da%20City%20Toys%20e%20quero%20fazer%20um%20or%C3%A7amento%20%F0%9F%8E%89" target="_blank" rel="noopener" class="contact-item">
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
      to="https://wa.me/5521984848699?text=Ol%C3%A1!%20Vi%20o%20site%20da%20City%20Toys%20e%20quero%20fazer%20um%20or%C3%A7amento%20%F0%9F%8E%89"
      class="whatsapp-float"
      target="_blank"
      rel="noopener"
      aria-label="Falar no WhatsApp"
    >
      <svg viewBox="0 0 24 24" width="32" height="32" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.017-1.04 2.48s1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const anoAtual = computed(() => new Date().getFullYear())
</script>

<style lang="sass" scoped>
$cor-azul-bg: #052a54
$acento: #ffd23f
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
  background: linear-gradient(90deg, transparent, $acento, transparent)
  margin-bottom: 40px
  opacity: 0.6

.container
  max-width: var(--largura-max)
  margin: 0 auto
  padding: 0 var(--container-px)

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

.footer-logo-img
  width: 160px
  height: auto
  display: inline-block
  margin-bottom: 14px

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
    background: rgba(255,255,255,0.06)
    color: $acento

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
    color: $acento
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

@keyframes pulse
  0%
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.7)
  70%
    box-shadow: 0 0 0 15px rgba(37, 211, 102, 0)
  100%
    box-shadow: 0 0 0 0 rgba(37, 211, 102, 0)
</style>
