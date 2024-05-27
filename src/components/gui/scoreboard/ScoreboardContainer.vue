<template>
  <div
    class="relative w-[600px] h-[700px] bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient border-4 border-black rounded-lg mt-4"
  >
    <div class="flex justify-center mt-4">
      <span class="text-4xl text-white font-bold">Records</span>
    </div>
    <div
      v-if="isReady"
      class="flex justify-between gap-4 text-white p-2 px-4 w-full h-full rounded-lg"
    >
      <button
        @click="prev"
        :disabled="currentIndex === 0"
        class="disabled:opacity-30 p-4 rounded-full backdrop-brightness-50 w-16 h-16 mt-64"
      >
        <img :src="arrow" alt="left-arrow" class="w-12 h-8" />
      </button>
      <div class="flex justify-center">
        <Scoreboard
          :result="currentResult"
          :title="currentTitle as Collection"
        />
      </div>
      <button
        @click="next"
        :disabled="currentIndex === games.length - 1"
        class="disabled:opacity-30 p-4 rounded-full backdrop-brightness-50 w-16 h-16 rotate-180 mt-64"
      >
        <img :src="arrow" alt="left-arrow" class="w-12 h-8" />
      </button>
    </div>
    <div v-else>
      <div class="flex justify-center mt-4">
        <span class="text-2xl text-white">Chargement...</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { Collection, fetchResults } from "@/services/result-service.ts";
import Scoreboard from "@/components/gui/scoreboard/Scoreboard.vue";
import arrow from "/arrow.svg";

// List of games
const games: Collection[] = [
  "running",
  "swimming",
  "boxing",
  "diving",
  "archery",
  "javelin",
  "jump",
];
const results = ref<{ [key: string]: any[] }>({});

// Current index for the carousel
const currentIndex = ref(0);

// Fetch results for the current game when the index changes
watchEffect(async () => {
  const currentGame = games[currentIndex.value];
  if (!results.value[currentGame]) {
    results.value[currentGame] = await fetchResults(currentGame);
  }
});

// Computed properties
const currentKey = computed(() => games[currentIndex.value]);
const currentResult = computed(() => results.value[currentKey.value]);
const currentTitle = computed(() => currentKey.value);

const isReady = computed(() => {
  return !!currentResult.value;
});

// Navigation functions
const next = () => {
  if (currentIndex.value < games.length - 1) {
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
