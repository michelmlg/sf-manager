<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { VenusAndMars, Heart, CalendarFold } from 'lucide-vue-next'
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
    const res = await fetch(`/api/animal/${id}`)
    if (!res.ok) throw new Error('Animal não encontrado')
    animal.value = await res.json()
  } catch (err) {
    console.error('Erro ao buscar animal:', err)
    router.push('/') // redireciona caso não encontre
  } finally {
    loading.value = false
  }
}

function goToAdoptionForm() {
  if (animal.value) router.push(`/formulario-de-adocao/${animal.value.id}`)
}

onMounted(fetchAnimal)
</script>

<template>
  <section class="min-h-screen bg-gradient-to-br from-ong-background to-white py-12 mr-8 ml-8">
    <div class="container mx-auto px-4">
      
      <!-- Botão voltar -->
      <button
        @click="router.back()"
        class="mb-6 text-ong-primary flex items-center gap-1 hover:text-ong-accent"
      >
        &larr; Voltar
      </button>

      <div v-if="loading" class="flex justify-center py-24">
        <LoadingSpinner />
      </div>

      <div v-else class="grid lg:grid-cols-2 gap-8 bg-white rounded-3xl shadow-xl overflow-hidden">
        <!-- Left: Carousel e Nome/Status -->
        <div class="bg-gradient-to-br from-ong-background to-ong-secondary/30 p-8 flex flex-col justify-center">
          <div class="flex justify-center">
              <PetMediaCarousel :pet-id="animal.id" class="shadow-lg"  style="width: 90%; height: 450px;"/>
          </div> 

          <div class="mt-6 text-center">
            <h1 class="text-4xl font-bold mb-2">{{ animal.name }}</h1>
            <p class="text-xl text-ong-text/70 mb-3">{{ animal.breed?.name }}</p>
            <div class="flex justify-center gap-2">
              <span class="px-4 py-1.5 text-sm bg-ong-primary text-white rounded-full">{{ animal.status || 'Disponível' }}</span>
              <span class="px-4 py-1.5 text-sm border border-ong-primary text-ong-primary rounded-full">{{ animal.species?.name }}</span>
            </div>
          </div>
        </div>

        <!-- Right: Informações detalhadas -->
        <div class="p-8 flex flex-col justify-between space-y-6">
          
          <!-- Estatísticas rápidas -->
          <div class="grid grid-cols-2 gap-4">
            <div class="border-2 border-ong-primary/20 rounded-lg p-4 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-ong-primary/10 flex items-center justify-center">
                <CalendarFold/>
              </div>
              <div>
                <p class="text-sm text-ong-text/70">Idade</p>
                <p class="font-semibold text-lg">{{ animal.age || 'Desconhecido' }}</p>
              </div>
            </div>

             <div class="border-2 border-ong-primary/20 rounded-lg p-4 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <VenusAndMars /> <!-- substituir pelo ícone Heart -->
              </div>
              <div>
                <p class="text-sm text-ong-text/70">Sexo</p>
                <p class="font-semibold text-lg">{{ animal.gender || 'Desconhecido' }}</p>
              </div>
            </div>

            <!-- <div class="border-2 border-ong-primary/20 rounded-lg p-4 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-ong-accent/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-ong-accent"></svg>
              </div>
              <div>
                <p class="text-sm text-ong-text/70">Peso</p>
                <p class="font-semibold text-lg">{{ animal.weight || 'Desconhecido' }}</p>
              </div>
            </div> -->

<!-- 
            <div class="border-2 border-ong-primary/20 rounded-lg p-4 flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600"> </svg>
              </div>
              <div>
                <p class="text-sm text-ong-text/70">Localização</p>
                <p class="font-semibold text-sm">{{ animal.location || 'Desconhecido' }}</p>
              </div>
            </div> -->
          </div> 

          <!-- Personalidade -->
          <!-- <div>
            <h3 class="text-xl font-semibold mb-3">Personalidade</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="trait in animal.personality || []"
                :key="trait"
                class="px-3 py-1.5 bg-ong-secondary/50 rounded-full text-sm"
              >
                {{ trait }}
              </span>
            </div>
          </div> -->

          <!-- Observações -->
          <div>
            <h3 class="text-xl font-semibold mb-3">Sobre {{ animal.name }}</h3>
            <p class="text-ong-text/80 leading-relaxed">{{ animal.notes || 'Sem observações.' }}</p>
          </div>

          <!-- Status de saúde -->
          <div class="border-2 border-ong-primary bg-white rounded-lg p-4">
            <h4 class="flex items-center gap-2 font-semibold mb-3">
              <!-- ícone Shield -->
              Saúde e Cuidados
            </h4>
            <div class="flex flex-col gap-2">
              <!-- <div class="flex justify-between items-center p-2 bg-ong-background/30 rounded-lg">
                <span>Vacinação</span>
                <span :class="animal.vaccinated ? 'text-green-700 font-semibold' : 'text-gray-400'">
                  {{ animal.vaccinated ? 'Completa' : 'Pendente' }}
                </span>
              </div> -->
              <div class="flex justify-between items-center p-2 bg-ong-background/30 rounded-lg">
                <span>Castração</span>
                <span :class="animal.isCastrated ? 'text-blue-700 font-semibold' : 'text-gray-400'">
                  {{ animal.isCastrated ? '✓ Castrado' : 'Não castrado' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Botões de ação -->
          <div class="flex flex-col gap-3 pt-4">
            <button
              @click="goToAdoptionForm()"
              class="btn-primary w-full py-3 text-lg flex items-center justify-center gap-2"
            >
                <Heart class="w-5 h-5 text-white" />
                Quero Adotar {{ animal.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
