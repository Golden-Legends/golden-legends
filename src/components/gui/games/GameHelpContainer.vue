<script setup lang="ts">
const props = defineProps<{
  title: string;
}>();
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[800px]"
  >
    <div class="text-4xl font-bold text-center mt-2 mb-4">
      {{ props.title }}
    </div>

    <div class="flex flex-col gap-2">
      <span class="text-2xl font-bold">How to play ?</span>
      <div class="flex gap-2">
        <slot name="commands" />
      </div>

      <slot name="tips" />
    </div>

    <slot></slot>
  </div>
</template>

<style scoped></style>
