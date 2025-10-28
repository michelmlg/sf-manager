<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Search, Plus, Edit, Trash2 } from 'lucide-vue-next';
import Pagination from '@/components/Pagination.vue';
import { showToast } from '@/utils/uiAlerts/toast';

const events = ref([]);
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const search = ref('');
const dateFrom = ref(null);
const dateTo = ref(null);
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const newEvent = ref({
  name: '',
  description: '',
  place: '',
  date: '',
  start_time: '',
  end_time: ''
});

// --- WATCHERS ---
watch([page, pageSize, search, dateFrom, dateTo], fetchEvents, { immediate: true });

// --- FUNÇÕES ---
async function fetchEvents() {
  loading.value = true;
  try {
    const filters = {};

    if (search.value) {
      filters.search = search.value;
      filters.searchFields = ['name', 'place', 'description'];
    }

    if (dateFrom.value || dateTo.value) {
      filters.dateFilters = {
        start_at: { from: dateFrom.value, to: dateTo.value }
      };
    }

    const params = new URLSearchParams({
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      filters: JSON.stringify(filters)
    });

    const res = await fetch(`/api/event?${params}`);
    if (!res.ok) throw new Error(`Erro: ${res.status}`);
    const data = await res.json();

    events.value = data.items;
    total.value = data.total;
    page.value = data.page;
    pageSize.value = data.pageSize;
  } catch (err) {
    console.error('Erro ao carregar eventos:', err);
    showToast({ icon: 'error', title: 'Erro ao carregar eventos', description: err.message });
  } finally {
    loading.value = false;
  }
}

function openCreateModal() {
  resetForm();
  isEditing.value = false;
  isModalOpen.value = true;
}

function startEdit(event) {
  isEditing.value = true;
  editingId.value = event.id;
  newEvent.value = {
    name: event.name,
    description: event.description,
    place: event.place,
    date: event.start_at ? event.start_at.slice(0, 10) : '',
    start_time: event.start_at ? new Date(event.start_at).toISOString().slice(11, 16) : '',
    end_time: event.end_at ? new Date(event.end_at).toISOString().slice(11, 16) : ''
  };
  isModalOpen.value = true;
}

function resetForm() {
  newEvent.value = { name: '', description: '', place: '', date: '', start_time: '', end_time: '' };
}

function closeModal() {
  isModalOpen.value = false;
  resetForm();
}

async function createEvent() {
  try {
    const payload = {
      name: newEvent.value.name,
      place: newEvent.value.place,
      description: newEvent.value.description,
      start_at: `${newEvent.value.date}T${newEvent.value.start_time}`,
      end_at: `${newEvent.value.date}T${newEvent.value.end_time}`
    };

    const res = await fetch('/api/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Erro ao criar evento');
    await fetchEvents();
    showToast({ icon: 'success', title: 'Evento criado com sucesso' });
    closeModal();
  } catch (err) {
    console.error(err);
    showToast({ icon: 'error', title: 'Erro ao criar evento', description: err.message });
  }
}

async function saveEdit() {
  try {
    const res = await fetch(`/api/event/${editingId.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newEvent.value.name,
        place: newEvent.value.place,
        description: newEvent.value.description,
        start_at: `${newEvent.value.date}T${newEvent.value.start_time}`,
        end_at: `${newEvent.value.date}T${newEvent.value.end_time}`
      })
    });

    if (!res.ok) throw new Error('Erro ao atualizar evento');
    await fetchEvents();
    showToast({ icon: 'success', title: 'Evento atualizado' });
    closeModal();
  } catch (err) {
    showToast({ icon: 'error', title: 'Erro ao atualizar evento', description: err.message });
  }
}

async function deleteEvent(id) {
  if (!confirm('Tem certeza que deseja excluir este evento?')) return;
  try {
    const res = await fetch(`/api/event/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir evento');
    await fetchEvents();
    showToast({ icon: 'success', title: 'Evento excluído com sucesso' });
  } catch (err) {
    showToast({ icon: 'error', title: 'Erro ao excluir evento', description: err.message });
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h1 class="text-3xl font-heading text-ong-text">Eventos</h1>
        <p class="text-muted-foreground mt-2">Gerencie os eventos da ONG</p>
      </div>
      <button
        @click="openCreateModal"
        class="flex items-center gap-2 px-4 py-2 bg-ong-primary text-white rounded-lg shadow hover:bg-ong-accent transition"
      >
        <Plus class="w-4 h-4" /> Adicionar Evento
      </button>
    </div>

    <Pagination
      :total="total"
      :page="page"
      :pageSize="pageSize"
      :search="search"
      :dateRange="{
        from: dateFrom,
        to: dateTo,
        onFromChange: val => { dateFrom.value = val; page.value = 1 },
        onToChange: val => { dateTo.value = val; page.value = 1 }
      }"
      @update:page="val => (page = val)"
      @update:pageSize="val => { pageSize = val; page = 1 }"
      @update:search="val => { search = val; page = 1 }"
    />

    <!-- Table -->
    <div class="overflow-x-auto bg-card rounded-lg shadow-sm animate-fade-in mt-6">
      <table class="w-full table-auto text-sm">
        <thead class="text-muted-foreground bg-ong-popover uppercase text-xs">
          <tr>
            <th class="px-4 py-3 text-left">Nome</th>
            <th class="px-4 py-3 text-left">Local</th>
            <th class="px-4 py-3 text-left">Início</th>
            <th class="px-4 py-3 text-left">Fim</th>
            <th class="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="5" class="p-4 text-center text-muted-foreground">Carregando...</td>
          </tr>
          <tr v-else-if="events.length === 0">
            <td colspan="5" class="p-4 text-center text-muted-foreground">Nenhum evento encontrado.</td>
          </tr>
          <tr
            v-for="event in events"
            :key="event.id"
            class="border-t hover:bg-ong-background/60 transition"
          >
            <td class="p-3 font-medium text-foreground">{{ event.name }}</td>
            <td class="p-3 text-muted-foreground">{{ event.place }}</td>
            <td class="p-3 text-muted-foreground">{{ new Date(event.start_at).toLocaleString('pt-BR') }}</td>
            <td class="p-3 text-muted-foreground">{{ new Date(event.end_at).toLocaleString('pt-BR') }}</td>
            <td class="p-3 text-right">
              <div class="flex justify-end gap-2">
                <button @click="startEdit(event)" class="p-1 hover:text-yellow-600"><Edit class="w-4 h-4" /></button>
                <button @click="deleteEvent(event.id)" class="p-1 hover:text-red-600"><Trash2 class="w-4 h-4" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div class="bg-white p-6 rounded-xl w-full max-w-2xl shadow-lg">
        <h2 class="text-lg font-semibold mb-4">
          {{ isEditing ? 'Editar Evento' : 'Adicionar Evento' }}
        </h2>

        <form @submit.prevent="isEditing ? saveEdit() : createEvent()">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-600 mb-1">Nome</label>
              <input v-model="newEvent.name" type="text" class="border p-2 rounded w-full" required />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Local</label>
              <input v-model="newEvent.place" type="text" class="border p-2 rounded w-full" required />
            </div>
            <div>
              <label class="block text-sm text-gray-600 mb-1">Dia</label>
              <input v-model="newEvent.date" type="date" class="border p-2 rounded w-full" required />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-gray-600 mb-1">Início</label>
                <input v-model="newEvent.start_time" type="time" class="border p-2 rounded w-full" required />
              </div>
              <div>
                <label class="block text-sm text-gray-600 mb-1">Fim</label>
                <input v-model="newEvent.end_time" type="time" class="border p-2 rounded w-full" required />
              </div>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm text-gray-600 mb-1">Descrição</label>
              <textarea v-model="newEvent.description" class="border p-2 rounded w-full" rows="3" required></textarea>
            </div>
          </div>

          <div class="mt-6 flex justify-end gap-2">
            <button type="button" @click="closeModal" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" class="px-4 py-2 rounded bg-ong-primary text-white hover:bg-ong-accent">
              {{ isEditing ? 'Salvar' : 'Adicionar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
