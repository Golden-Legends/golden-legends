<script setup lang="ts">
const props = defineProps({
  text: String,
  subText: {
    type: String,
    default: ''
  },
});
</script>

<template>
  <div
    class="text-8xl text-white font-black text-center uppercase"
  >
    <div class="text-stroke-blue-6">
      {{ props.text }}
    </div>
    <div v-if="props.subText" class="text-4xl text-white text-center uppercase">
      {{ props.subText }}
    </div>
  </div>
</template>

<style scoped></style>