<template>
  <section class="bg-ong-background text-ong-text min-h-screen">
    <div class="container py-12 space-y-16 animate-fade-in">
      <MissionSection />
      <CarouselSection />
      <ActivitiesSection />
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHead } from '@vueuse/head'
import MissionSection from '@/views/Landing/o-que-fazemos/components/MissionSection.vue'
import CarouselSection from '@/views/Landing/o-que-fazemos/components/CarouselSection.vue'
import ActivitiesSection from '@/views/Landing/o-que-fazemos/components/ActivitiesSection.vue'

useHead({
  title: "O que fazemos — ONG São Francisco",
  meta: [
    {
      name: "description",
      content:
        "Conheça o trabalho da ONG São Francisco: resgate, cuidado, educação, feiras de adoção e ações de apoio ao bem-estar animal."
    },
    { name: "robots", content: "index,follow" },

    // Open Graph
    { property: "og:title", content: "O que fazemos — ONG São Francisco" },
    {
      property: "og:description",
      content:
        "Saiba como a ONG São Francisco atua em resgates, adoção responsável, educação e projetos que ajudam animais em situação de risco."
    },
    { property: "og:type", content: "website" },
    {
      property: "og:url",
      content: "https://ongsfrancisco.com.br/o-que-fazemos"
    },
    {
      property: "og:image",
      content: "https://ongsfrancisco.com.br/default-o-que-fazemos.jpg"
    }
  ],
  link: [
    {
      rel: "canonical",
      href: "https://ongsfrancisco.com.br/o-que-fazemos"
    }
  ]
})

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

</script>
