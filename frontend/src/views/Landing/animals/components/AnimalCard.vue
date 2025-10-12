<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PetMediaCarousel from '@/views/Staff/pets/components/PetMediaCarousel.vue'

const props = defineProps({
  animal: { type: Object, required: true },
  size: { type: String, default: 'small' }, // 'small' | 'large'
  showButton: { type: Boolean, default: true },
})

const router = useRouter()

function calculateAnimalAge(dataNasc) {
  const hoje = new Date();
  const nasc = new Date(dataNasc);

  let anos = hoje.getFullYear() - nasc.getFullYear();
  let meses = hoje.getMonth() - nasc.getMonth();
  let dias = hoje.getDate() - nasc.getDate();

  if (dias < 0) {
    meses--;
    const ultimoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 0);
    dias += ultimoMes.getDate();
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  if (anos >= 1) {
    return `${anos} ano${anos > 1 ? 's' : ''}`;
  } else if (meses >= 1) {
    return `${meses} mês${meses > 1 ? 'es' : ''}`;
  } else {
    return `${dias} dia${dias > 1 ? 's' : ''}`;
  }
}

function goToAdoptionForm() {
  router.push(`/formulario-de-adocao/${props.animal.id}`)
}
function goToAnimalPage() {
  router.push(`/animal/${props.animal.id}`)
}

const isLarge = computed(() => props.size === 'large')

// Classes condicionais baseadas no tamanho
const cardPadding = computed(() => (isLarge.value ? 'p-6' : 'p-3'))
const titleClass = computed(() => (isLarge.value ? 'text-xl' : 'text-base'))
const subtitleClass = computed(() => (isLarge.value ? 'text-sm' : 'text-xs'))
const descClass = computed(() => (isLarge.value ? 'text-sm' : 'text-xs'))
const badgeClass = computed(() => (isLarge.value ? 'text-xs px-3 py-1' : 'text-[10px] px-2 py-0.5'))
const buttonClass = computed(() =>
  isLarge.value ? 'py-2 text-sm' : 'py-1 text-xs'
)
</script>

<template>
  <div
    class="bg-white rounded-2xl shadow-lg overflow-hidden card-hover cursor-pointer group transition-transform hover:-translate-y-1"
  >
    <!-- Mídia -->
    <PetMediaCarousel :pet-id="animal.id" :no-border-bottom="true" />

    <div :class="cardPadding">
      <!-- Cabeçalho -->
      <div class="flex justify-between items-start mb-3">
        <div>
          <h4
            class="text-ong-text font-semibold mb-1"
            :class="titleClass"
          >
            {{ animal.name }}
          </h4>
          <p class="text-ong-text/70 line-clamp-1" :class="subtitleClass">
            {{ animal.species?.name }} • {{ animal.breed?.name }}
          </p>
        </div>

        <span
          v-if="animal.birthDate"
          class="text-ong-primary font-medium bg-ong-secondary/30 rounded-full"
          :class="badgeClass"
        >
          {{ calculateAnimalAge(animal.birthDate) }}
        </span>
        <span v-else 
          class="text-ong-primary font-medium bg-ong-secondary/30 rounded-full"
          :class="badgeClass"
        >
          Desconhecida
        </span>
      </div>

      <!-- Descrição -->
      <p
        class="text-ong-text/80 mb-4"
        :class="[descClass, isLarge ? 'line-clamp-4 min-h-[4.5rem] max-h-[4.5rem]' : 'line-clamp-2 min-h-[2rem] max-h-[2rem]']"
      >
        {{ animal.notes || 'Sem descrição.' }}
      </p>

      <!-- Badges -->
      <div class="flex flex-wrap gap-2 mb-4">
        <span
          v-if="animal.status === 'Disponível'"
          class="bg-green-100 text-green-800 rounded-full"
          :class="badgeClass"
        >
          Disponível
        </span>
        <span
          v-if="animal.isCastrated"
          class="bg-ong-primary/20 text-ong-primary rounded-full"
          :class="badgeClass"
        >
          Castrado
        </span>
      </div>

      <!-- Botão -->
      <button
        v-if="showButton"
        @click.stop="goToAnimalPage"
        class="w-full btn-primary hover:bg-ong-accent transition-colors duration-300 rounded-lg font-medium"
        :class="buttonClass"
      >
        Quero Adotar
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-hover {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.card-hover:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15);
}
</style>
