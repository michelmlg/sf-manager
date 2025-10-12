<template>
  <div
    class="flex flex-col items-center justify-center py-24 text-ong-text/60"
    :class="wrapperClass"
  >
    <div
      class="h-10 w-10 border-4 border-ong-primary/30 border-t-ong-primary rounded-full animate-spin"
      :class="spinnerClass"
    ></div>
    <p v-if="message" class="mt-4 text-sm text-ong-text/70">{{ message }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  wrapperClass: {
    type: String,
    default: ''
  },
  spinnerClass: {
    type: String,
    default: ''
  }
})
</script>
