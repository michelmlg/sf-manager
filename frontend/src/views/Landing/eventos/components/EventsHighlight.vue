<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg h-full">
    <div class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-300">
      
      <!-- Próximo Evento -->
      <div class="pr-0 md:pr-6 pb-6 md:pb-0">
        <h5 class="text-ong-text mb-4 flex items-center gap-2">
          <Calendar size="24" />
          Próximo Evento
        </h5>

        <EventCard 
          v-if="nextEvent" 
          :event="nextEvent" 
          :isHighlighted="true" 
          :isNext="true"
        />
        <div v-else class="text-sm text-ong-text/70">Nenhum evento futuro cadastrado.</div>
      </div>

      <!-- Outros Eventos -->
      <div class="pl-0 md:pl-6 pt-6 md:pt-0">
        <h5 class="text-ong-text mb-6 flex items-center gap-2">
          <Calendar size="24" />
          Outros Eventos
        </h5>

        <div v-if="loading" class="text-sm text-ong-text/70">Carregando eventos...</div>

        <div v-else class="space-y-4 max-h-48 overflow-y-auto">
          <EventCard 
            v-for="event in upcomingEvents" 
            :key="event.id" 
            :event="event" 
          />
          <div v-if="upcomingEvents.length === 0" class="text-sm text-ong-text/70">
            Nenhum outro evento no momento.
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Calendar } from 'lucide-vue-next';
import EventCard from './EventCard.vue';
import { showToast } from '@/utils/uiAlerts/toast';

const events = ref([]);
const loading = ref(true);

function mapToCard(e) {
  const start = new Date(e.start_at);
  const end = new Date(e.end_at);

  return {
    id: e.id,
    title: e.name,
    date: start.toLocaleDateString('pt-BR'),
    time: `${start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`,
    description: e.description,
    location: e.place,
    type: 'general',
    startAt: start, 
  };
}

const nextEvent = computed(() => events.value[0] || null);
const upcomingEvents = computed(() => events.value.slice(1));

async function loadEvents() {
  loading.value = true;

  try {
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() + 2, 0); // até o fim do próximo mês

    const filters = {
      dateFilters: {
        start_at: {
          from: startDate.toISOString(),
          to: endDate.toISOString(),
        },
      },
    };

    const params = new URLSearchParams({
      page: '1',
      pageSize: '200',
      filters: JSON.stringify(filters),
    });

    const res = await fetch(`/api/event?${params.toString()}`);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    const data = await res.json();

    const items = Array.isArray(data.items) ? data.items : [];

    const mapped = items
      .map(mapToCard)
      .filter(e => e.startAt >= now) 
      .sort((a, b) => a.startAt - b.startAt);

    events.value = mapped;
  } catch (err) {
    console.error('Erro ao carregar eventos:', err);
    showToast({
      icon: 'error',
      title: 'Erro ao carregar eventos',
      description: err.message,
    });
  } finally {
    loading.value = false;
  }
}

onMounted(loadEvents);
</script>
