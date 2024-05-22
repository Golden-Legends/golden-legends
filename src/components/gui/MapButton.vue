<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>

<template>
  <button
    class="py-4 px-8 border-2 border-white bg-blue-darker rounded-2xl text-white text-4xl font-bold w-64 hover:bg-end-blue-gradient transition-all duration-300 hover:scale-110"
  >
    {{ props.text }}
  </button>
</template>

<style scoped></style>
