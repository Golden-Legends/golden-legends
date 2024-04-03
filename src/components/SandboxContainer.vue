<script setup lang="ts">
const props = defineProps({
  name: String,
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-xl">{{ props.name }}</span>
    <div class="flex gap-2 overflow-auto p-2">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
