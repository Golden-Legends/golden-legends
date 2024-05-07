<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  difficulty: {
    type: String,
    required: true,
  },
});

const colors = {
  easy: "enabled:hover:bg-green-600",
  medium: "enabled:hover:bg-yellow-600",
  hard: "enabled:hover:bg-red-700",
};
</script>

<template>
  <button
    class="bg-white w-full h-fit text-blue-darker enabled:hover:text-white border-2 font-bold py-2 px-4 rounded disabled:opacity-50 uppercase text-lg transition-all"
    :disabled="props.disabled"
    :class="[
      colors[props.difficulty],
      { 'cursor-not-allowed': props.disabled },
    ]"
  >
    {{ props.name }}
  </button>
</template>
