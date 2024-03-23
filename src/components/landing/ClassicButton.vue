<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>

<template>
  <button
    class="group py-2 px-6 border-2 border-blue-darker bg-blue-lighter rounded-lg text-2xl font-bold w-64 specific-shadow hover:bg-blue-darker hover:border-blue-lighter transition-all duration-300"
  >
    <span class="group-hover:text-white transition-all duration-300">{{
      props.text
    }}</span>
  </button>
</template>

<style scoped>
.specific-shadow {
  box-shadow:
    -0.1em 0.1em 0 #000,
    -0.2em 0.2em 0 #000;
}
</style>
