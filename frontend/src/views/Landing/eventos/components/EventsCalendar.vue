<template>
  <div class="bg-white rounded-2xl p-6 shadow-lg">
    
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold text-ong-text">
        {{ months[currentMonth] }} {{ currentYear }}
      </h3>
      <div class="flex gap-2">
        <button @click="prevMonth" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-ong-text">
          <ChevronLeft size="20" />
        </button>
        <button @click="nextMonth" class="p-2 rounded-lg hover:bg-gray-100 transition-colors text-ong-text">
          <ChevronRight size="20" />
        </button>
      </div>
    </div>

  
    <div class="grid grid-cols-7 gap-0 mb-2">
      <div
        v-for="day in weekDays"
        :key="day"
        class="h-12 flex items-center justify-center border border-gray-200 bg-gray-50"
      >
        <span class="text-sm font-medium text-ong-text/70">{{ day }}</span>
      </div>
    </div>

    <div class="grid grid-cols-7 gap-0 rounded-lg overflow-hidden">
      <div
        v-for="(cell, index) in calendarCells"
        :key="index"
        :class="[
          'h-16 border border-gray-200 p-2 relative transition-colors cursor-pointer',
          isToday(cell.day) ? 'bg-orange-100 hover:bg-orange-200' : 'bg-white hover:bg-gray-50'
        ]"
      >
        <span
          v-if="cell.day"
          :class="[
            'text-sm font-medium',
            isToday(cell.day) ? 'text-orange-700 font-bold' : 'text-ong-text'
          ]"
        >
          {{ cell.day }}
        </span>

        <div
          v-for="event in cell.events"
          :key="event.fullDate"
          :class="[
            'absolute bottom-1 left-1 right-1 h-2 rounded',
            getEventColor(event)
          ]"
          :title="event.title"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { showToast } from '@/utils/uiAlerts/toast';

const today = new Date();
const currentMonth = ref(today.getMonth());
const currentYear = ref(today.getFullYear());
const events = ref([]);

const months = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const isToday = (day) => {
  if (!day) return false;
  return (
    day === today.getDate() &&
    currentMonth.value === today.getMonth() &&
    currentYear.value === today.getFullYear()
  );
};

const getEventColor = (event) => {
  if (event?.isNext) return 'bg-ong-secondary'; // Destaque para o próximo evento
  return 'bg-blue-300';
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

const calendarCells = computed(() => {
  const daysInMonth = getDaysInMonth(currentMonth.value, currentYear.value);
  const firstDay = getFirstDayOfMonth(currentMonth.value, currentYear.value);
  const cells = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push({ day: null, events: [] });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayEvents = events.value.filter(
      (e) => e.fullDate.getDate() === day && e.fullDate.getMonth() === currentMonth.value
    );
    cells.push({ day, events: dayEvents });
  }

  return cells;
});

async function loadEventsForMonth(year, month) {
  try {
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 2, 0);

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
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();

    const items = Array.isArray(data.items) ? data.items : [];
    const mapped = items.map((e) => ({
      fullDate: new Date(e.start_at),
      date: new Date(e.start_at).getDate(),
      title: e.name,
      isNext: false,
    }));


    const now = new Date();
    const futureEvents = mapped.filter((e) => e.fullDate >= now);
    if (futureEvents.length > 0) {
      const firstEvent = futureEvents.sort((a, b) => a.fullDate - b.fullDate)[0];
      firstEvent.isNext = true;
    }

    events.value = mapped;
  } catch (err) {
    console.error('Erro ao carregar eventos (calendar):', err);
    showToast({
      icon: 'error',
      title: 'Erro ao carregar eventos',
      description: err.message,
    });
    events.value = [];
  }
}

onMounted(() => loadEventsForMonth(currentYear.value, currentMonth.value));
watch([currentMonth, currentYear], () => loadEventsForMonth(currentYear.value, currentMonth.value));
</script>
