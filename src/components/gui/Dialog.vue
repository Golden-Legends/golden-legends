<script setup lang="ts">
const props = defineProps({
  name: String,
  text: String,
});
</script>

<template>
  <div
    class="border-4 border-black bg-gradient-to-b bg-neutral-800 bg-opacity-80 text-white w-[600px] h-fit px-4 pb-3 rounded-lg mt-2"
  >
    <div class="relative">
      <span
        class="text-2xl absolute font-bold -top-5 left-0 bg-neutral-900 px-6 py-1 rounded-2xl"
        >{{ props.name }}</span
      >
    </div>
    <br />
    <span class="font-bold text-xl">{{ props.text }}</span>
  </div>
</template>

<style scoped></style>
