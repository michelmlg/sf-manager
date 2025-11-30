<template>
    <div class="container py-12 mx-auto px-4 animate-fade-in">
        <div class="text-start mb-8">
            <h2 class="text-ong-text mb-4">Eventos</h2>
        </div>
        <EventsHighlight class="mb-8"></EventsHighlight>
        <EventsCalendar />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useHead } from '@vueuse/head'
import EventsCalendar from '@/views/Landing/eventos/components/EventsCalendar.vue';
import EventsHighlight from '@/views/Landing/eventos/components/EventsHighlight.vue';

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

useHead({
  title: "Eventos — ONG São Francisco",
  meta: [
    {
      name: "description",
      content: "Confira os próximos eventos, feiras de adoção e ações sociais da ONG São Francisco. Participe e ajude a transformar vidas!"
    },
    { name: "robots", content: "index,follow" },

    // Open Graph
    { property: "og:title", content: "Eventos — ONG São Francisco" },
    {
      property: "og:description",
      content: "Conheça os eventos e feiras de adoção da ONG São Francisco. Venha participar e contribuir para o bem-estar animal!"
    },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://ongsfrancisco.com.br/eventos" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
  ],
  link: [
    {
      rel: "canonical",
      href: "https://ongsfrancisco.com.br/eventos"
    }
  ]
})

</script>
