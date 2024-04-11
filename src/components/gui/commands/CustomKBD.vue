<script setup lang="ts">
const props = defineProps({
  keybind: String,
});
</script>

<template>
  <kbd
    class="border-2 border-black bg-gray-400 text-white text-2xl font-black p-1 px-2 rounded-lg h-12 w-fit min-w-[3rem] flex items-center justify-center font-sans"
  >
    <span class="font-black text-2xl uppercase">{{ props.keybind }}</span>
  </kbd>
</template>

<style scoped></style>
