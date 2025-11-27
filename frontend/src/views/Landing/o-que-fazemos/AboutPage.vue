<template>
  <section class="bg-ong-background text-ong-text min-h-screen">
    <div class="container py-12 space-y-16">
      <MissionSection />
      <CarouselSection />
      <ActivitiesSection />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import MissionSection from '@/views/Landing/o-que-fazemos/components/MissionSection.vue'
import CarouselSection from '@/views/Landing/o-que-fazemos/components/CarouselSection.vue'
import ActivitiesSection from '@/views/Landing/o-que-fazemos/components/ActivitiesSection.vue'


onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

</script>
