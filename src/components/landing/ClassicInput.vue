<script setup lang="ts">
const props = defineProps<{
  placeholder: string;
}>();
</script>

<template>
  <input type="text" class="py-2 px-6 border-2 border-blue-darker bg-blue-lighter rounded-lg text-lg font-bold w-64 specific-shadow" :placeholder="props.placeholder" />
</template>

<style scoped>
</style>