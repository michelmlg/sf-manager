<template>
  <div class="min-h-screen bg-ong-background">
    <main class="container mx-auto px-4 py-12 md:py-20">

      <div class="max-w-6xl mx-auto">
        <!-- Header Section -->
        <div class="text-center mb-12 animate-fade-in">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-ong-primary to-ong-accent rounded-full mb-6 shadow-lg">
            <Heart class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-4xl md:text-5xl font-heading text-ong-text mb-4">
            Sua Doação <span class="text-ong-primary">Transforma Vidas</span>
          </h1>
          <p class="text-lg text-ong-text/80 max-w-2xl mx-auto leading-relaxed">
            Cada contribuição nos ajuda a continuar nosso trabalho de resgate, cuidado e
            reabilitação de animais abandonados. Ajude e faça a diferença!
          </p>
        </div>

        <!-- Main Content Grid -->
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- QR Code Section -->
          <div class="p-8 bg-white shadow-xl border-2 border-ong-secondary/30 rounded-2xl animate-scale-in hover:shadow-2xl transition-shadow duration-300">
            <div class="text-center space-y-6">
              <div class="inline-flex items-center justify-center w-14 h-14 bg-ong-primary/10 rounded-full mb-2">
                <QrCode class="w-7 h-7 text-ong-primary" />
              </div>
              <h2 class="text-2xl font-heading text-ong-text">Doe via PIX</h2>

              <!-- QR Code Placeholder -->
              <div class="bg-gradient-to-br from-ong-secondary/20 to-ong-background p-6 rounded-2xl inline-block shadow-inner border border-ong-secondary/30">
                <div class="w-64 h-64 bg-white rounded-xl flex items-center justify-center shadow-md">
                <template v-if="qrImageUrl">
                    <img
                        :src="qrImageUrl"
                        alt="QR Code para doação (PIX)"
                        class="object-contain w-full h-full"
                        @error="onImgError"
                        decoding="async"
                    />
                    
                </template>

                <template v-else>
                    <div class="text-center space-y-3 p-4">
                        <div class="inline-flex items-center justify-center w-24 h-24 rounded-lg bg-ong-primary/10 mx-auto">
                        <QrCode class="w-16 h-16 text-ong-primary" stroke-width="1.5" />
                        </div>
                        <p class="text-sm text-ong-text/70 font-medium">
                        Aponte a câmera<br />do seu banco aqui
                        </p>
                        <p v-if="showUploadHint" class="text-xs text-ong-text/60 mt-2">
                        Nenhuma imagem disponível — envie o QR ou use a chave PIX.
                        </p>
                    </div>
                </template>
                </div>
              </div>

                <!-- PIX Key -->
                <!-- <div class="space-y-3">
                    <p class="text-sm text-ong-text/70 font-medium">Ou copie a chave PIX:</p>
                    <div class="flex gap-2">
                        <input
                        type="text"
                        :value="pixKey"
                        readonly
                        class="flex-1 px-4 py-3 bg-ong-background rounded-lg text-sm text-ong-text font-mono border-2 border-ong-secondary/30"
                        aria-label="Chave PIX"
                        />
                        <button
                        @click="copyPixKey"
                        class="inline-flex items-center justify-center px-3 py-2 rounded-lg bg-ong-primary hover:bg-ong-accent text-white shadow-md"
                        aria-label="Copiar chave PIX"
                        >
                        <Copy class="w-4 h-4" />
                        </button>
                    </div>
                </div> -->
            </div>
          </div>

          <!-- Impact Section -->
          <div class="space-y-6 animate-fade-in" :style="{ animationDelay: '0.1s' }">
            <div class="p-6 bg-gradient-to-br from-ong-primary/10 to-ong-accent/5 border-2 border-ong-primary/20 shadow-lg rounded-2xl">
              <h3 class="text-xl font-heading text-ong-text mb-4 flex items-center gap-2">
                <Sparkles class="w-5 h-5 text-ong-primary" />
                Como sua doação ajuda
              </h3>
              <ul class="space-y-4 text-ong-text/80">
                <li class="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                  <span class="text-ong-primary font-bold text-xl">•</span>
                  <span><strong class="text-ong-primary">R$ 50</strong> alimentam um animal resgatado por uma semana</span>
                </li>
                <li class="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                  <span class="text-ong-primary font-bold text-xl">•</span>
                  <span><strong class="text-ong-primary">R$ 100</strong> cobrem vacinas e vermífugos essenciais</span>
                </li>
                <li class="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                  <span class="text-ong-primary font-bold text-xl">•</span>
                  <span><strong class="text-ong-primary">R$ 200</strong> garantem tratamento veterinário completo</span>
                </li>
                <li class="flex items-start gap-3 p-3 bg-white/60 rounded-lg">
                  <span class="text-ong-primary font-bold text-xl">•</span>
                  <span><strong class="text-ong-primary">R$ 500</strong> sustentam um abrigo temporário por um mês</span>
                </li>
              </ul>
            </div>

            <div class="p-6 bg-white border-2 border-ong-secondary/30 shadow-lg rounded-2xl">
              <h3 class="text-xl font-heading text-ong-text mb-4 flex items-center gap-2">
                <Heart class="w-5 h-5 text-ong-accent" />
                Transparência Total
              </h3>
              <p class="text-ong-text/80 mb-4 leading-relaxed">
                Todos os nossos gastos são documentados e compartilhados mensalmente
                com nossos doadores. Você saberá exatamente como seu apoio está
                fazendo a diferença.
              </p>
              <div class="grid grid-cols-2 gap-4 pt-4 border-t-2 border-ong-secondary/30">
                <div class="text-center p-3 bg-ong-background rounded-lg">
                  <div class="text-3xl font-heading text-ong-primary">95%</div>
                  <div class="text-xs text-ong-text/70 font-medium">Direto para os animais</div>
                </div>
                <div class="text-center p-3 bg-ong-background rounded-lg">
                  <div class="text-3xl font-heading text-ong-accent">5%</div>
                  <div class="text-xs text-ong-text/70 font-medium">Custos operacionais</div>
                </div>
              </div>
            </div>

            <button
              @click="shareLink"
              class="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-ong-secondary hover:bg-ong-primary text-ong-text hover:text-white transition-all duration-300 shadow-md"
              aria-label="Compartilhar esta página"
            >
              <Share2 class="w-4 h-4 transform group-hover:scale-110 transition-transform" />
              Compartilhar esta página
            </button>
          </div>
        </div>

        <!-- Testimonials -->
        <div class="bg-gradient-to-r from-ong-primary via-ong-accent to-ong-primary rounded-2xl p-8 text-center animate-fade-in shadow-xl" :style="{ animationDelay: '0.2s' }">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-full mb-4">
            <Heart class="w-6 h-6 text-white" />
          </div>
          <p class="text-lg italic text-white mb-4 leading-relaxed font-medium">
            "Graças às doações de pessoas como você, conseguimos resgatar e encontrar
            lares para diversos animais. Cada vida salva é uma vitória compartilhada!"
          </p>
          <p class="text-sm text-white/90 font-semibold">— Equipe ONG São Francisco</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ArrowLeft, Heart, QrCode, Share2, Copy, Sparkles } from 'lucide-vue-next';
import { showToast } from '@/utils/uiAlerts/toast';

const qrImageUrl = ref("../../../../public/images/QR-payment.jpg");

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

const pixKey = ref('doe@ongexemplo.org.br');

const copyPixKey = async () => {
  try {
    await navigator.clipboard.writeText(pixKey.value);

    showToast({
      icon: 'success',
      title: 'Chave PIX copiada!',
      description: 'Cole no seu aplicativo bancário para doar.',
    });
  } catch (err) {
    showToast({
      icon: 'error',
      title: 'Erro ao copiar!',
      description: 'Não foi possível copiar a chave automaticamente.',
    });
  }
};

const shareLink = async () => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: 'Faça uma doação',
        text: 'Ajude a transformar vidas! Doe para nossa ONG.',
        url: window.location.href,
      });
    } else {
      await copyPixKey();
    }
  } catch (err) {
    // fallback para copiar em caso de erro/cancelamento
    await copyPixKey();
  }
};
</script>

<style scoped>
/* ajustes locais se necessário */
</style>
