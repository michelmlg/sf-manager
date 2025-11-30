<template>
  <div class="min-h-screen bg-ong-background">
    <main class="container mx-auto px-4 py-12 md:py-16">

      <div class="max-w-5xl mx-auto">
        <!-- Header mais compacto -->
        <!-- <div class="text-center mb-10">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-ong-primary to-ong-accent rounded-full mb-4 shadow-lg">
            <Heart class="w-9 h-9 text-white" />
          </div>
          <h1 class="text-3xl md:text-4xl font-heading text-ong-text">
            Sua Doação <span class="text-ong-primary">Transforma Vidas</span>
          </h1>
          <p class="mt-3 text-base md:text-lg text-ong-text/70 max-w-2xl mx-auto leading-relaxed">
            Cada real faz diferença no resgate, tratamento e adoção de animais abandonados.
          </p>
        </div> -->

        <!-- Grid principal mais enxuto -->
        <div class="grid md:grid-cols-2 gap-8 lg:gap-10">

          <!-- QR Code PIX (agora menor e mais elegante) -->
          <div class="bg-white rounded-2xl shadow-xl border border-ong-secondary/20 p-6 md:p-8">
            <div class="text-center">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-ong-primary/10 rounded-full mb-4">
                <QrCode class="w-6 h-6 text-ong-primary" />
              </div>
              <h2 class="text-2xl font-heading text-ong-text mb-6">Doe via PIX</h2>

              <div class="bg-gradient-to-br from-ong-secondary/10 to-ong-background/50 rounded-2xl p-6 shadow-inner">
                <div class="w-56 h-56 md:w-60 md:h-60 mx-auto bg-white rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
                  <img
                    src="/images/QR-payment.jpg"
                    alt="QR Code PIX para doação"
                    class="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>

              <!-- Chave PIX opcional (descomente se quiser usar) -->
              <!--
              <div class="mt-6">
                <p class="text-sm text-ong-text/70 mb-2">Ou use a chave:</p>
                <div class="flex gap-2 max-w-xs mx-auto">
                  <code class="flex-1 px-3 py-2 bg-ong-background/70 rounded-lg text-sm font-mono text-ong-text truncate">
                    doe@ongexemplo.org.br
                  </code>
                  <button @click="copyPixKey" class="p-2 bg-ong-primary text-white rounded-lg hover:bg-ong-accent transition">
                    <Copy class="w-4 h-4" />
                  </button>
                </div>
              </div>
              -->
            </div>
          </div>

          <!-- Impacto + Transparência (mais compacto) -->
          <div class="space-y-6">
            <!-- Como ajuda -->
            <div class="bg-gradient-to-br from-ong-primary/5 to-ong-accent/5 rounded-2xl p-6 border border-ong-primary/20">
              <h3 class="text-xl font-heading text-ong-text mb-4 flex items-center gap-2">
                <Sparkles class="w-5 h-5 text-ong-primary" />
                Sua doação faz isso:
              </h3>
              <ul class="space-y-3 text-ong-text/80 text-sm md:text-base">
                <li class="flex items-center gap-3">
                  <span class="text-ong-primary font-bold">R$ 50</span>
                  <span>alimentam um animal por 1 semana</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-ong-primary font-bold">R$ 100</span>
                  <span>vacinas + vermífugos</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-ong-primary font-bold">R$ 200</span>
                  <span>tratamento veterinário completo</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-ong-primary font-bold">R$ 500</span>
                  <span>abrigo temporário por 1 mês</span>
                </li>
              </ul>
            </div>

            <!-- Transparência -->
            <div class="bg-white rounded-2xl p-6 border border-ong-secondary/20 shadow-md">
              <h3 class="text-xl font-heading text-ong-text mb-3 flex items-center gap-2">
                <Heart class="w-5 h-5 text-ong-accent" />
                Transparência Total
              </h3>
              <p class="text-sm text-ong-text/70 mb-4">
                95% de tudo que recebemos vai direto874 para os animais.
              </p>
              <div class="grid grid-cols-2 gap-4">
                <div class="text-center py-3 bg-ong-background/70 rounded-lg">
                  <div class="text-2xl font-bold text-ong-primary">95%</div>
                  <div class="text-xs text-ong-text/70">Para os animais</div>
                </div>
                <div class="text-center py-3 bg-ong-background/70 rounded-lg">
                  <div class="text-2xl font-bold text-ong-accent">5%</div>
                  <div class="text-xs text-ong-text/70">Operacional</div>
                </div>
              </div>
            </div>

            <!-- Botão compartilhar -->
            <button
              @click="shareLink"
              class="w-full py-3 px-4 bg-ong-secondary hover:bg-ong-primary text-ong-text hover:text-white rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-md"
            >
              <Share2 class="w-4 h-4" />
              Compartilhar esta página
            </button>
          </div>
        </div>

        <!-- Depoimento final (mais sutil) -->
        <div class="mt-12 bg-gradient-to-r from-ong-primary to-ong-accent rounded-2xl p-8 text-center text-white shadow-xl">
          <Heart class="w-10 h-10 mx-auto mb-4 opacity-90" />
          <p class="text-lg italic leading-relaxed max-w-3xl mx-auto">
            "Cada doação é um ato de amor que muda o destino de um animal. Obrigado por fazer parte disso!"
          </p>
          <p class="mt-4 text-sm opacity-90 font-medium">— Equipe ONG São Francisco</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { Heart, QrCode, Share2, Copy, Sparkles } from 'lucide-vue-next'
import { showToast } from '@/utils/uiAlerts/toast'

useHead({
  title: 'Doe — ONG São Francisco',
  meta: [
    {
      name: 'description',
      content:
        'Ajude a ONG São Francisco a resgatar, tratar e proteger animais. Doe via PIX de forma segura e transparente.'
    },
    { name: 'robots', content: 'index,follow' },

    // Open Graph
    { property: 'og:title', content: 'Doe — ONG São Francisco' },
    {
      property: 'og:description',
      content:
        'Ajude a ONG São Francisco a resgatar, tratar e proteger animais. Doe via PIX de forma segura e transparente.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ongsfrancisco.com.br/doar' },

    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [{ rel: 'canonical', href: 'https://ongsfrancisco.com.br/doar' }]
})

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const pixKey = 'doe@ongexemplo.org.br'

const copyPixKey = async () => {
  try {
    await navigator.clipboard.writeText(pixKey)
    showToast({
      icon: 'success',
      title: 'Chave copiada!',
      description: 'Use no app do seu banco.'
    })
  } catch {
    showToast({
      icon: 'error',
      title: 'Erro ao copiar'
    })
  }
}
const shareLink = async () => {
  // Opção 1: link atual da página (recomendado)
  //const linkToCopy = window.location.href

  // Opção 2: link fixo (caso queira forçar um URL específico)
  const linkToCopy = 'https://ongsafrancisco.org.br/doar'

  try {
    await navigator.clipboard.writeText(linkToCopy)

    showToast({
      icon: 'success',
      title: 'Link copiado!',
      description: 'Agora é só colar no WhatsApp, Instagram ou onde quiser'
    })
  } catch (err) {
    // Caso muito raro (ex: página não em HTTPS)
    console.log(err);
    showToast({
      icon: 'error',
      title: 'Erro ao copiar',
      description: 'Selecione e copie o link da barra de endereço manualmente.'
    })
  }
}
</script>