<template>
  <div
    class="relative w-[800px] h-[650px] bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient border-4 border-black rounded-lg mt-4"
  >
    <button
      id="close-records"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img
        src="../../../../public/close.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>

    <div
      v-if="isReady"
      class="flex justify-between gap-4 text-white p-2 px-4 w-full h-full rounded-lg pt-4"
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
  "tennis",
  "jump",
];
const results = ref<{ [key: string]: any[] }>({});

// Current index for the carousel
const currentIndex = ref(0);

// Fetch results for the current game when the index changes
watchEffect(async () => {
  const currentGame = games[currentIndex.value];
  results.value[currentGame] = await fetchResults(currentGame);
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
