<script setup lang="ts">
import { computed, defineProps, ref, watch } from "vue";

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
const is1v1 = computed(() => props.name === "1v1");

const disabled = computed(() => {
  if (is1v1.value) {
    return false;
  }
  if (!difficulty.value) {
    // Wait 10sec and try again until localStorage is ready
    setTimeout(() => {
      difficulty.value = localStorage.getItem(props.game);
    }, 10000);
    return true;
  } else if (difficulty.value === props.difficulty) {
    return false;
  } else if (
    difficulty.value === "easy" &&
    props.difficulty === "intermediate"
  ) {
    return true;
  } else if (difficulty.value === "easy" && props.difficulty === "hard") {
    return true;
  } else if (
    difficulty.value === "intermediate" &&
    props.difficulty === "hard"
  ) {
    return true;
  }
  return false;
});

const colors = {
  easy: "enabled:hover:bg-green-600",
  intermediate: "enabled:hover:bg-yellow-600",
  hard: "enabled:hover:bg-red-700",
};

const displayScore = () => {
  const sportsWithMultiplier = ["levelPlongeon", "levelTirArc"];
  if (sportsWithMultiplier.includes(props.game)) {
    if (props.difficulty === "intermediate") {
      return "(score x1.5)";
    } else if (props.difficulty === "hard") {
      return "(score x2)";
    }
  }
  return "";
};
</script>

<template>
  <button
    class="bg-white w-full h-full text-blue-darker enabled:hover:text-white border-2 font-bold py-2 px-4 rounded disabled:opacity-50 uppercase text-lg transition-all"
    :disabled="disabled"
    :class="{
      'hover:bg-neutral-700': is1v1,
      [colors[props.difficulty]]: !is1v1,
      'cursor-pointer': !disabled,
    }"
  >
    {{ props.name }}
    <span class="text-sm normal-case">{{ displayScore() }}</span>
  </button>
</template>
