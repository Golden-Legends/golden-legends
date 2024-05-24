<script setup lang="ts">
import { computed, defineProps, ref } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  game: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
});
// add a ref 
const difficulty = ref(localStorage.getItem(props.game));

const disabled = computed(() => {
  if (difficulty === null) {
    return true;
  }
  else if (difficulty.value === props.difficulty) {
    return false;
  }
  else if(difficulty.value === "easy" && props.difficulty === "intermediate") {
    return true;
  }
  else if(difficulty.value === "easy" && props.difficulty === "hard") {
    return true;
  }
  else if(difficulty.value === "intermediate" && props.difficulty === "hard") {
    return true;
  }
  return false;
});

const colors = {
  easy: "enabled:hover:bg-green-600",
  intermediate: "enabled:hover:bg-yellow-600",
  hard: "enabled:hover:bg-red-700",
};
</script>

<template>
  <button
    class="bg-white w-full h-fit text-blue-darker enabled:hover:text-white border-2 font-bold py-2 px-4 rounded disabled:opacity-50 uppercase text-lg transition-all"
    :disabled="disabled"
    :class="[
      colors[props.difficulty],
      { 'cursor-pointer': !disabled}
    ]"
  >
    {{ props.name }}
  </button>
</template>
