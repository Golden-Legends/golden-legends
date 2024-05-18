<script setup lang="ts">
const props = defineProps({
  text: String,
});
</script>

<template>
  <div class="text-2xl font-bold">{{ props.text }}</div>
</template>

<style scoped></style>
