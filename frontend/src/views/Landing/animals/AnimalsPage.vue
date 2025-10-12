<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import PetMediaCarousel from '@/views/Staff/pets/components/PetMediaCarousel.vue'

const router = useRouter()

// Estado
const animals = ref([])
const loading = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const search = ref(null)
const genderFilter = ref('all');
const speciesFilter = ref('all');
const dateFrom = ref(null);
const dateTo = ref(null);

// Função utilitária
function calculateAnimalAge(dataNasc) {
  if (!dataNasc) return 'Idade desconhecida'
  const hoje = new Date()
  const nasc = new Date(dataNasc)
  let anos = hoje.getFullYear() - nasc.getFullYear()
  let meses = hoje.getMonth() - nasc.getMonth()
  if (meses < 0 || (meses === 0 && hoje.getDate() < nasc.getDate())) anos--
  return anos >= 1 ? `${anos} ano${anos > 1 ? 's' : ''}` : 'Menos de 1 ano'
}

// Busca paginada
async function fetchAnimals() {
  loading.value = true
  try {
    const filters = {};
    filters.includeAssociations = ["species", "breed"];

    // Busca genérica
    if (search.value) {
      filters.search = search.value;
      filters.searchFields = ["name", "notes"];
    }

    // Filtros diretos (fieldFilters)
    const fieldFilters = {};
    if (genderFilter.value !== "all") fieldFilters.gender = genderFilter.value;
    if (speciesFilter.value !== "all") fieldFilters.speciesId = speciesFilter.value;

    if (Object.keys(fieldFilters).length) filters.fieldFilters = fieldFilters;

    // Filtros de data (dateFilters)
    const dateFilters = {};
    if (dateFrom.value || dateTo.value) {
      dateFilters.birthDate = {
        from: dateFrom.value || undefined,
        to: dateTo.value || undefined,
      };
    }

    if (Object.keys(dateFilters).length) filters.dateFilters = dateFilters;

    const params = new URLSearchParams({
      page: page.value.toString(),
      pageSize: pageSize.value.toString(),
      filters: JSON.stringify(filters),
    });

    const res = await fetch(`/api/animal?${params.toString()}`)
    if (!res.ok) throw new Error(`Erro: ${res.status}`)
    const data = await res.json()

    animals.value = data.items
    total.value = data.total
  } catch (err) {
    console.error('Erro ao buscar animais:', err)
  } finally {
    loading.value = false
  }
}

function goToAdoptionForm(animalId) {
  router.push(`/formulario-de-adocao/${animalId}`)
}

watch(
  [page, pageSize, search, genderFilter, speciesFilter, dateFrom, dateTo],
  fetchAnimals,
    { immediate: true, deep: true }
);

onMounted(fetchAnimals)
</script>

<template>
  <section class="py-20 bg-gradient-to-br from-ong-background to-white">
    <div class="container mx-auto px-4 min-h-[100vh]">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-ong-text mb-6">Animais Disponíveis para Adoção</h2>
        <p class="text-lg text-ong-text/80">
          Conheça nossos amigos especiais que estão esperando por uma família.
        </p>
      </div>

      <div class="mb-6">
           <Pagination
                :total="total"
                :page="page"
                :pageSize="pageSize"
                :search="search"

                :filters="[
                    {
                    label: 'Sexo',
                    value: genderFilter,
                    options: [
                        { label: 'Todos', value: 'all' },
                        { label: 'Macho', value: 'M' },
                        { label: 'Fêmea', value: 'F' }
                    ]
                    },
                    {
                    label: 'Espécie',
                    value: speciesFilter,
                    options: [
                        { label: 'Todas', value: 'all' },
                        { label: 'Cachorro', value: '1' },
                        { label: 'Gato', value: '2' }
                    ]
                    }
                ]"

                :dateRange="{
                    from: dateFrom,
                    to: dateTo,
                    onFromChange: val => { dateFrom.value = val; page.value = 1; },
                    onToChange: val => { dateTo.value = val; page.value = 1; }
                }"

                @update:page="val => { page = val }"
                @update:pageSize="val => { pageSize = val; page = 1 }"
                @update:search="val => { search = val }"
                @update:dynamic-filter="({ label, value }) => {
                    if (label === 'Status') statusFilter = value;
                    else if (label === 'Sexo') genderFilter = value;
                    else if (label === 'Espécie') speciesFilter = value;
                    page = 1;
                    fetchAnimals();
                }"

                />
      </div>

      <!-- Grid de animais -->
      <div v-if="!loading" class="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
        <div
          v-for="animal in animals"
          :key="animal.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden card-hover cursor-pointer group"
        >
          <PetMediaCarousel :pet-id="animal.id" :no-border-bottom="true" />

          <div class="p-6">
            <div class="flex justify-between items-start mb-3">
              <div>
                <h4 class="text-ong-text mb-1">{{ animal.name }}</h4>
                <p class="text-ong-text/70 text-sm">
                  {{ animal.species?.name }} • {{ animal.breed?.name }}
                </p>
              </div>

              <span
                class="text-ong-primary font-medium text-sm bg-ong-secondary/30 px-3 py-1 rounded-full"
              >
                {{ calculateAnimalAge(animal.birthDate) }}
              </span>
            </div>

            <p class="text-ong-text/80 text-sm mb-4 line-clamp-2">
              {{ animal.notes || 'Sem descrição.' }}
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
              <span
                v-if="animal.status === 'Disponível'"
                class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full"
              >
                Disponível
              </span>
              <span
                v-if="animal.isCastrated"
                class="text-xs bg-ong-primary/20 text-ong-primary px-2 py-1 rounded-full"
              >
                Castrado
              </span>
            </div>

            <button
              @click.stop="goToAdoptionForm(animal.id)"
              class="w-full btn-primary hover:bg-ong-accent transition-colors duration-300"
            >
              Quero Adotar
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-ong-text/60">Carregando...</div>
    </div>
  </section>
</template>
