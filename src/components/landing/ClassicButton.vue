<script setup lang="ts">
const props = defineProps<{
  text: string;
}>();
</script>

<template>
<button class="py-2 px-6 border-2 border-blue-darker bg-blue-lighter rounded-lg text-2xl font-bold w-64 specific-shadow">
  <span class="shadow-white shadow-2xl">{{ props.text }}</span>
</button>
</template>

<style scoped>
.specific-shadow {
  box-shadow:
  -.1em .1em 0 #000,
  -.2em .2em 0 #000;
}
</style>