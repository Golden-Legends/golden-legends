<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>
<template>
  <div
    class="border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white p-4 rounded-lg h-fit w-80"
  >
    <div class="pb-4">
      <h1 class="text-3xl font-bold">{{ props.title }}</h1>
    </div>
    <div class="w-full flex gap-8">
      <div class="flex flex-col items-center gap-4 w-full">
        <slot />
      </div>
    </div>
  </div>
</template>
