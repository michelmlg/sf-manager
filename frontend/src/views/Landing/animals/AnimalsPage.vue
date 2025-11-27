<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Pagination from '@/components/Pagination.vue'
import AnimalCard from '@/views/Landing/animals/components/AnimalCard.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

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

let searchTimeout = null;

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
  [page, pageSize, genderFilter, speciesFilter, dateFrom, dateTo],
  fetchAnimals,
    { immediate: true, deep: true }
);

watch(
  () => search.value,
  () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      page.value = 1
      fetchAnimals()
    }, 600) // delay de 600ms (ajustável)
  }
)

onMounted(fetchAnimals)

onMounted(() => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
})
</script>

<template>
  <section class="py-16 bg-gradient-to-br from-ong-background to-white">
    <div class="container mx-auto px-4 min-h-[100vh]">
      <div class="text-center max-w-3xl mx-auto mb">
        <h2 class="text-ong-text mb-6">Animais para Adoção</h2>
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

      <!-- Estados: carregando / lista / vazio -->
      <div class="mb-12">
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-24">
          <LoadingSpinner />
        </div>

        <!-- Grid com animais -->
        <div v-else-if="animals && animals.length > 0" class="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <AnimalCard
            v-for="animal in animals"
            :key="animal.id"
            :animal="animal"
            size="small"
          />
        </div>

        <!-- Mensagem quando não há animais -->
        <div v-else class="flex justify-center items-center py-3">
          <div class="bg-white shadow-lg px-10 py-12 rounded-2xl text-center max-w-xl">
            <h3 class="text-2xl font-heading text-ong-primary mb-4">
              Nenhum animal disponível no momento
            </h3>
            <p class="text-ong-text/70 mb-6">
              No momento não temos animais disponíveis para adoção. Novos amiguinhos podem aparecer em breve — volte mais tarde ou confira nossas próximas feiras e eventos.
            </p>

            <div class="flex flex-col sm:flex-row justify-center gap-3">
              <router-link to="/eventos" class="inline-flex items-center justify-center btn-secondary px-6 py-2">
                Ver Eventos
              </router-link>

              <router-link to="/contato" class="inline-flex items-center justify-center btn-primary px-6 py-2">
                Entrar em Contato
              </router-link>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>
