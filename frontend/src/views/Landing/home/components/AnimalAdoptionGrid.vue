<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Heart, MapPin, Calendar, ChevronDown, ChevronUp } from 'lucide-vue-next'
import AnimalCard from '@/views/Landing/animals/components/AnimalCard.vue'

const router = useRouter()
const showAll = ref(false)
const favorites = ref([])

// Animal Pagination 
const loading = ref(false);
const total = ref(0);
const page = ref(1);
const pageSize = ref(10);

const animals = ref([]);

async function fetchAnimals() {
  const filters = {};
  filters.includeAssociations = ["species", "breed"];
  filters.fieldFilters = {
    status: "Disponível"
  };
  filters.sort = [{ field: "entryDate", direction: "desc"}];

  const params = new URLSearchParams({
    page: page.value.toString(),
    pageSize: pageSize.value.toString(),
    filters: JSON.stringify(filters),
  });

  const url = `/api/animal?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Erro: ${res.status}`);
  const data = await res.json();

  animals.value = data.items;
  total.value = data.total;
  page.value = data.page;
  pageSize.value = data.pageSize;

}

const displayedAnimals = computed(() => showAll.value ? animals.value : animals.value.slice(0, 3))

// function toggleFavorite(animalId) {
//   if (favorites.value.includes(animalId)) {
//     favorites.value = favorites.value.filter(id => id !== animalId)
//   } else {
//     favorites.value.push(animalId)
//   }
// }

function toggleShowAll() {
  showAll.value = !showAll.value
}

function goToAdoptionForm(animalId) {
  router.push(`/formulario-de-adocao/${animalId}`)
}




// Eventos Vue

onMounted(() => {
  fetchAnimals();
});


</script>

<template>
  <section class="py-20 bg-gradient-to-br from-ong-background to-white">
    <div class="container mx-auto px-4">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-ong-text mb-6">Procurando um Lar</h2>
        <p class="text-lg text-ong-text/80">
          Conheça nossos amigos especiais que estão esperando por uma família.
          Cada um tem sua personalidade única e muito amor para dar.
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <AnimalCard
          v-for="animal in displayedAnimals"
          :key="animal.id"
          :animal="animal"
          size="large"
        />
      </div>

      <!-- <div class="text-center">
        <button @click="showAll = !showAll" class="inline-flex items-center gap-2 btn-secondary">
          <span v-if="showAll">Ver Menos <ChevronUp size="20" /></span>
          <span v-else>Ver Todos os Animais <ChevronDown size="20" /></span>
        </button>
      </div> -->

      <div class="text-center">
      <template v-if="!showAll">
        <!-- Estado fechado -->
        <button @click="toggleShowAll" class="inline-flex items-center gap-2 btn-secondary">
          Ver Mais <ChevronDown size="20" />
        </button>
      </template>

      <template v-else>
        <!-- Estado aberto parcial -->
        <div class="flex justify-center gap-4">
          <button @click="toggleShowAll" class="inline-flex items-center gap-2 btn-secondary">
            Ver Menos <ChevronUp size="20" />
          </button>

          <router-link to="/animals" class="inline-flex items-center gap-2 btn-primary">
            Ver Todos Animais
          </router-link>
        </div>
      </template>
    </div>


      <div class="mt-16 text-center">
        <div class="inline-flex items-center gap-6 bg-white px-8 py-4 rounded-2xl shadow-lg">
          <div class="text-center">
            <div class="text-2xl font-heading text-ong-primary mb-1">{{ animals.length }}</div>
            <div class="text-sm text-ong-text/70">Animais Disponíveis</div>
          </div>
          <div class="w-px h-12 bg-ong-text/20"></div>
          <div class="text-center">
            <div class="text-2xl font-heading text-ong-primary mb-1">847</div>
            <div class="text-sm text-ong-text/70">Adoções Realizadas</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>