<script setup lang="ts">
const props = defineProps<{
  placeholder: string;
}>();
</script>

<template>
  <input
    type="text"
    class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg text-lg font-bold w-64"
    :placeholder="props.placeholder"
  />
</template>

<style scoped></style>
