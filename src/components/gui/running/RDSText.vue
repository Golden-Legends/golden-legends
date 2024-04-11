<script setup lang="ts">
const props = defineProps({
  text: String,
});
</script>

<template>
  <div
    class="text-8xl text-white text-stroke-blue-6 font-black text-center uppercase"
  >
    {{ props.text }}
  </div>
</template>

<style scoped></style>
