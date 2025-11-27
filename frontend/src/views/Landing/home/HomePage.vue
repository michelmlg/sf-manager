<template>
<HeroSection></HeroSection>
<AnimalAdoptionGrid></AnimalAdoptionGrid>
<PartnersCarouselSection></PartnersCarouselSection>
<MissionSection></MissionSection>
<ImpactSection></ImpactSection>
</template>
<script setup>
import { onMounted } from 'vue';
import HeroSection from '@/views/Landing/home/components/HeroSection.vue';
import AnimalAdoptionGrid from '@/views/Landing/home/components/AnimalAdoptionGrid.vue';
import MissionSection from '@/views/Landing/home/components/MissionSection.vue';
import ImpactSection from '@/views/Landing/home/components/ImpactSection.vue';
import PartnersCarouselSection from '@/views/Landing/home/components/PartnersCarouselSection.vue';

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})
</script>