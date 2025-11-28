<template>
  <section aria-label="Nossos Parceiros" class="py-16 bg-ong-background/30">
    <div class="container mx-auto px-4">
      <!-- Título -->
      <div class="text-center mb-12">
        <h3 class="text-3xl md:text-4xl font-heading text-ong-text">
          Nossos Parceiros
        </h3>
        <p class="mt-3 text-ong-text/70">Marcas que confiam no nosso trabalho</p>
      </div>

      <!-- Carrossel Infinito (monotonic translate) -->
      <div class="relative group" @mouseenter="pause" @mouseleave="play">
        <!-- Botões -->
        <button
          @click="prev"
          class="absolute left-4 md:left-8 top-1/2 z-20 bg-white/95 hover:bg-white shadow-2xl rounded-full p-3 md:p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 -translate-x-12 group-hover:translate-x-0"
          aria-label="Anterior"
        >
          <svg class="w-6 h-6 md:w-8 md:h-8 text-ong-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          @click="next"
          class="absolute right-4 md:right-8 top-1/2 z-20 bg-white/95 hover:bg-white shadow-2xl rounded-full p-3 md:p-4 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0"
          aria-label="Próximo"
        >
          <svg class="w-6 h-6 md:w-8 md:h-8 text-ong-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <!-- Track -->
        <div class="overflow-hidden">
        <div
            ref="trackRef"
            class="flex track"
            :class="{ 'no-transition': !isTransitionEnabled }"
            :style="{ transform: `translateX(-${globalStep * itemWidth}%)` }"
        >
            <div
            v-for="(p, i) in repeatedPartners"
            :key="`${p.id}-${i}`"
            class="flex-shrink-0 flex items-center justify-center px-3 md:px-5 lg:px-8"
            :style="{ width: `${itemWidth}%` }"
            >
            <!-- Card individual para cada parceiro -->
            <button
                @click="onClick(p)"
                class="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm 
                    border border-ong-primary/15 hover:border-ong-primary/40
                    shadow-sm hover:shadow-lg 
                    ring-1 ring-black/5 hover:ring-ong-primary/20
                    transition-all duration-500 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ong-primary/30"
                :title="p.name"
            >
                <img
                :src="p.image"
                :alt="p.name"
                class="h-12 md:h-16 lg:h-20 object-contain grayscale opacity-75
                        group-hover:grayscale-0 group-hover:opacity-100
                        transition-all duration-500"
                draggable="false"
                />
            </button>
            </div>
        </div>
        </div>

        <!-- Dots -->
        <div class="flex justify-center gap-2 mt-10">
          <button
            v-for="(_, i) in partners.length"
            :key="i"
            @click="goToSlide(i)"
            class="w-2 h-2 rounded-full transition-all duration-300"
            :class="logicalIndex === i ? 'bg-ong-primary w-10' : 'bg-ong-text/30 hover:bg-ong-text/50'"
            :aria-current="logicalIndex === i ? 'true' : 'false'"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  partners: Array,
  cycles: { type: Number, default: 12 }, // quantas cópias do array original (ajustável)
  stepDurationMs: { type: Number, default: 600 }, // duração da animação por passo
  autoplayMs: { type: Number, default: 3000 }
})
const emit = defineEmits(['click'])


const defaultPartners = [
    { 
        name: 'Ponto Cão',     
        image: '/images/partners/Ponto cão.jpg',        
        url: ''
    },
    { 
        name: 'Kahu PetShop',     
        image: '/images/partners/Kahu-petshop.webp',        
        url: ''
    },
    { 
        name: 'Petz',     
        image: '/images/partners/petz.png',        
        url: ''
    },
    { 
        name: 'Upvet',     
        image: '/images/partners/upvet.jpg',        
        url: ''
    },
    { 
        name: 'Petland',     
        image: '/images/partners/petland.png',        
        url: ''
    },
    { 
        name: 'PetConfort',     
        image: '/images/partners/petConfort.jpg',        
        url: ''
    },
    { 
        name: 'Oh My Dog!',     
        image: '/images/partners/Oh My Dog!.jpg',        
        url: ''
    },
    { 
        name: 'Nelvet',     
        image: '/images/partners/Nelvet.jpg',        
        url: ''
    },
    { 
        name: 'GoldenPet',     
        image: '/images/partners/Golden-pet.webp',        
        url: ''
    },
    { 
        name: 'Centro Medico Veterinario Dr. Julio Cesar',     
        image: '/images/partners/Centro-Dr-Julio-Cesar.jpg',        
        url: ''
    },


]

/* data */
const partners = computed(() => (props.partners && props.partners.length ? props.partners : defaultPartners))
const partnersWithId = computed(() => partners.value.map((p, i) => ({ ...p, id: i })))
const N = computed(() => partnersWithId.value.length)

/* responsive visible count */
const visibleCount = ref(1)
const updateVisibleCount = () => {
  if (window.innerWidth >= 1280) visibleCount.value = 5
  else if (window.innerWidth >= 768) visibleCount.value = 3
  else visibleCount.value = 1
}
const itemWidth = computed(() => 100 / visibleCount.value) // percent per item

/* repeated partners (cycles copies) */
const repeatedPartners = computed(() => {
  const arr = []
  const cycles = Math.max(2, Math.floor(props.cycles))
  for (let c = 0; c < cycles; c++) {
    for (let i = 0; i < partnersWithId.value.length; i++) {
      arr.push(partnersWithId.value[i])
    }
  }
  return arr
})

/* global step (monotonic) — increments only */
const globalStep = ref(0) // how many single-item steps moved since mount (monotonic increasing)
const logicalIndex = ref(0) // which logical item is active (0..N-1) for dots

/* transition control */
const isTransitionEnabled = ref(true)
const isAnimating = ref(false)
let autoplayTimer = null

/* track ref */
const trackRef = ref(null)

/* step timing */
const stepDurationMs = computed(() => Math.max(100, props.stepDurationMs))

/* next: advance by 1 (monotonic increment) */
const next = async () => {
  if (N.value <= visibleCount.value) return
  if (isAnimating.value) return
  isAnimating.value = true
  isTransitionEnabled.value = true

  globalStep.value += 1
  // update logicalIndex (the "active" item seen by user)
  logicalIndex.value = (logicalIndex.value + 1) % Math.max(1, N.value)

  // when animation ends we set isAnimating = false (listener)
}


const prev = async () => {
  if (N.value <= visibleCount.value) return
  if (isAnimating.value) return
  isAnimating.value = true
  isTransitionEnabled.value = true

  // advance enough steps so the previous item becomes visible
  const steps = (N.value - 1) % N.value
  globalStep.value -= steps
  logicalIndex.value = (logicalIndex.value - 1 + N.value) % N.value
}

/* goToSlide: compute minimal monotonic steps to reach target logically */
const goToSlide = (target) => {
  if (N.value === 0) return
  const cur = logicalIndex.value
  if (target === cur) return

  // distance forward (how many next steps needed) in circular manner
  const dist = (target - cur + N.value) % N.value
  // Do dist steps at once
  globalStep.value += dist
  logicalIndex.value = target % N.value
}

/* autoplay */
const start = () => {
  stop()
  autoplayTimer = setInterval(() => next(), Math.max(200, props.autoplayMs))
}
const stop = () => {
  if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null }
}
const pause = () => stop()
const play = () => { if (!autoplayTimer && N.value > visibleCount.value) start() }

/* click */
const onClick = (p) => {
  emit('click', p)
  if (p.url && p.url !== '#') window.open(p.url, '_blank', 'noopener')
}

/* When the transition ends (one step), clear animating.
   Also detect when globalStep is getting too close to repeatedPartners.length - visibleCount,
   and perform a safe reset (subtract a chunk) without visible jump. */
const onTransitionEnd = (e) => {
  if (!trackRef.value || e.target !== trackRef.value) return
  isAnimating.value = false

  // Reset guard: keep a comfortable margin so we don't run out of items
  const total = repeatedPartners.value.length
  const margin = Math.max(20, N.value * 3) // safe margin
  if (globalStep.value > total - margin) {
    // compute reduction: subtract a whole number of original cycles so DOM items still line up
    const reduceByCycles = Math.floor(props.cycles / 2) || 1
    const reduceBy = reduceByCycles * N.value
    // temporarily disable transition, reduce globalStep, then re-enable
    isTransitionEnabled.value = false
    globalStep.value = Math.max(0, globalStep.value - reduceBy)
    // force repaint then re-enable transitions
    nextTick(() => requestAnimationFrame(() => { isTransitionEnabled.value = true }))
  }
}

/* resize handler */
let resizeTimer = null
const onResize = () => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    const prev = visibleCount.value
    updateVisibleCount()
    if (prev !== visibleCount.value) {
      // adjust nothing else — itemWidth reactive and layout will adapt
    }
  }, 120)
}

/* lifecycle */
onMounted(() => {
  updateVisibleCount()
  // attach transitionend listener on the track element
  if (trackRef.value) {
    trackRef.value.addEventListener('transitionend', onTransitionEnd)
  }
  window.addEventListener('resize', onResize)
  if (N.value > visibleCount.value) start()
})

onUnmounted(() => {
  stop()
  if (trackRef.value) trackRef.value.removeEventListener('transitionend', onTransitionEnd)
  window.removeEventListener('resize', onResize)
  clearTimeout(resizeTimer)
})
</script>

<style scoped>
.track {
  transition: transform 600ms cubic-bezier(.2,.9,.2,1);
  will-change: transform;
}
.no-transition {
  transition: none !important;
}
</style>
