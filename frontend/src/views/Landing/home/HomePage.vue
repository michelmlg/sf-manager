<template>
<HeroSection></HeroSection>
<AnimalAdoptionGrid></AnimalAdoptionGrid>
<PartnersCarouselSection></PartnersCarouselSection>
<MissionSection></MissionSection>
<ImpactSection></ImpactSection>
</template>
<script setup>
import { onMounted } from 'vue';
import { useHead } from '@vueuse/head';

import HeroSection from '@/views/Landing/home/components/HeroSection.vue';
import AnimalAdoptionGrid from '@/views/Landing/home/components/AnimalAdoptionGrid.vue';
import MissionSection from '@/views/Landing/home/components/MissionSection.vue';
import ImpactSection from '@/views/Landing/home/components/ImpactSection.vue';
import PartnersCarouselSection from '@/views/Landing/home/components/PartnersCarouselSection.vue';

useHead({
  title: 'ONG São Francisco — Adoções e Proteção Animal',
  meta: [
    {
      name: 'description',
      content:
        'Conheça os animais disponíveis para adoção na ONG São Francisco. Junte-se a nós para resgatar e cuidar de animais em situação de risco.'
    },
    { name: 'robots', content: 'index,follow' },

    // Open Graph (social sharing)
    { property: 'og:title', content: 'ONG São Francisco — Adoções e Proteção Animal' },
    {
      property: 'og:description',
      content:
        'Conheça os animais disponíveis para adoção na ONG São Francisco. Junte-se a nós para resgatar e cuidar de animais em situação de risco.'
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://ongsfrancisco.com.br/' },

    // Twitter card
    { name: 'twitter:card', content: 'summary_large_image' }
  ],
  link: [
    { rel: 'canonical', href: 'https://ongsfrancisco.com.br/' }
  ]
});

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})
</script>