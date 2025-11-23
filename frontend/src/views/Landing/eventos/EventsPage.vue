<template>
    <div class="container mx-auto px-4 py-8">
        <div class="text-start mb-8">
            <h1 class="text-ong-text mb-4">Eventos</h1>
        </div>
        <EventsHighlight class="mb-8"></EventsHighlight>
        <EventsCalendar />
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import EventsCalendar from '@/views/Landing/eventos/components/EventsCalendar.vue';
import EventsHighlight from '@/views/Landing/eventos/components/EventsHighlight.vue';

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})

</script>
