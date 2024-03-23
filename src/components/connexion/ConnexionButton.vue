<script setup lang="ts">
const props = defineProps({
  text: String,
});
</script>

<template>
  <button
    class="group py-2 px-6 border-2 border-blue-darker bg-blue-darker rounded-lg text-lg text-white font-bold w-64 hover:bg-blue-darker/80 transition-all duration-300"
  >
    <span>{{ props.text }}</span>
  </button>
</template>

<style scoped></style>
