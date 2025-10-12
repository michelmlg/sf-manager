<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PetMediaCarousel from '@/views/Staff/pets/components/PetMediaCarousel.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()

const animal = ref(null)
const loading = ref(true)

async function fetchAnimal() {
  loading.value = true
  try {
    const id = route.params.petId
    const response = await fetch(`/api/animal/${id}`)
    if (!response.ok) throw new Error('Animal não encontrado')
    
    console.log(response);
    animal.value = await response.json()
  } catch (err) {
    console.error('Erro ao buscar animal:', err)
    // Redireciona caso não encontre

  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}


function goToAdoptionForm() {
  if (animal.value) router.push(`/formulario-de-adocao/${animal.value.id}`)
}

onMounted(fetchAnimal)
</script>

<template>
  <section class="py-12 container mx-auto px-4 min-h-[900px]">
    <button @click="router.back()" class="mb-4 text-ong-primary">&larr; Voltar</button>

    <div v-if="loading" class="flex justify-center py-24">
      <LoadingSpinner />
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Carrossel de imagens -->
      <PetMediaCarousel :pet-id="animal.id" style="width: 100%; height: 600px;" />

      <!-- Informações do animal -->
      <div class="flex flex-col justify-between">
        <div>
          <h1 class="font-bold mb-2">{{ animal.name }}</h1>
          <p class="text-ong-text/70 mb-2">{{ animal.species?.name }} - {{ animal.breed?.name }}</p>

          <!-- Status badges -->
          <div class="flex gap-2 mb-4">
            <span v-if="animal.isVaccinated" class="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Vacinado</span>
            <span v-if="animal.isCastrated" class="px-2 py-1 bg-ong-primary/20 text-ong-primary rounded-full text-sm">Castrado</span>
          </div>

          <!-- Detalhes -->
          <p class="text-ong-text/80 mb-4">
            Nascimento: {{ formatDate(animal.birthDate) || 'Desconhecido' }} <br>
            Sexo: {{ animal.gender || 'Desconhecido' }} <br>
            Porte: {{ animal.size || 'Desconhecido' }}
          </p>

          <!-- Observações -->
          <div class="text-ong-text/80 mb-6">
            <h3 class="font-semibold mb-1">Observações</h3>
            <p>{{ animal.notes || 'Sem observações.' }}</p>
          </div>
        </div>

        <!-- Botão de adoção -->
        <button
          @click="goToAdoptionForm"
          class="mt-4 btn-primary w-full text-lg py-3 hover:bg-ong-accent transition-colors"
        >
          Quero Adotar
        </button>
      </div>
    </div>
  </section>
</template>
