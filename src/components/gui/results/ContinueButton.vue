<script setup lang="ts">
const props = defineProps({
  name: String,
});
</script>

<template>
  <button
    v-if="!props.name"
    class="group py-2 px-6 border-2 border-white bg-blue-darker rounded-lg text-white text-2xl font-bold w-64 specific-shadow hover:bg-end-blue-gradient transition-all duration-300"
  >
    <span>Retour ville</span>
  </button>
  <button
    v-else
    class="group py-2 px-6 border-2 border-blue-darker bg-blue-lighter text-black rounded-lg text-2xl font-bold w-64 specific-shadow hover:bg-blue-darker hover:border-blue-lighter transition-all duration-300"
  >
    <span class="group-hover:text-white transition-all duration-300">{{
      props.name
    }}</span>
  </button>
</template>

<style scoped></style>
