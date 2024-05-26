<template>
  <div v-if="isReady" class="flex justify-between gap-4 w-[400px] h-[400px]">
    <button @click="prev" :disabled="currentIndex === 0">⬅️</button>
    <div class="flex justify-center items-center">
      <Scoreboard :result="currentResult" :title="currentTitle as Collection" />
    </div>
    <button @click="next" :disabled="currentIndex === totalScoreboards - 1">
      ➡️
    </button>
  </div>
  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Collection, fetchAllResults } from "@/services/result-service.ts";
import Scoreboard from "@/components/gui/scoreboard/Scoreboard.vue";

// Initialize results with a type
const results = ref<{ [key: string]: any[] }>({});

// Fetch results and assign to the ref
fetchAllResults().then((data) => {
  results.value = data;
});

const currentIndex = ref(0);

const totalScoreboards = computed(() => Object.keys(results.value).length);

const currentKey = computed(
  () => Object.keys(results.value)[currentIndex.value],
);
const currentResult = computed(() => results.value[currentKey.value]);
const currentTitle = computed(() => currentKey.value);

const isReady = computed(() => {
  return currentKey.value && currentResult.value && currentTitle.value;
});

const next = () => {
  if (currentIndex.value < totalScoreboards.value - 1) {
    currentIndex.value += 1;
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};
</script>

<style scoped>
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
