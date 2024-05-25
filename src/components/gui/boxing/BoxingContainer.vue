<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import AimTarget from "@/components/gui/boxing/AimTarget.vue";
import { storeBoxe } from "@/components/gui/storeBoxe.ts";

const GAME_SIZE = 5;
const TIMER = 30;
const TIMEOUT = ref(storeBoxe.state.timeout);

watch(
  () => storeBoxe.state.playable,
  (newVal) => {
    if (!newVal) {
      clearInterval(intervalId);
      clearInterval(timerId);
    } else {
      resetInterval();
      timer.value = TIMER;
      startTimer();
    }
  },
);

watch(
  () => storeBoxe.state.timeout,
  (newVal) => {
    TIMEOUT.value = newVal;
  },
);

const lastPosition = ref<{ row: number; col: number } | null>(null);

const GAME_STATE = ref<boolean[][]>(
  Array.from({ length: GAME_SIZE }, () =>
    Array.from({ length: GAME_SIZE }, () => false),
  ),
);

let intervalId: NodeJS.Timeout;
let timerId: NodeJS.Timeout;

const resetGameState = () => {
  GAME_STATE.value = Array.from({ length: GAME_SIZE }, () =>
    Array.from({ length: GAME_SIZE }, () => false),
  );
};

const getRandomPosition = () => {
  let newRow, newCol;
  do {
    newRow = Math.floor(Math.random() * GAME_SIZE);
    newCol = Math.floor(Math.random() * GAME_SIZE);
  } while (
    lastPosition.value &&
    newRow === lastPosition.value.row &&
    newCol === lastPosition.value.col
  );

  return { row: newRow, col: newCol };
};

const updateGameState = () => {
  resetGameState();
  const { row, col } = getRandomPosition();
  GAME_STATE.value[row][col] = true;
  lastPosition.value = { row, col };
  resetInterval();
};

const resetInterval = () => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  intervalId = setInterval(updateGameState, TIMEOUT.value);
};

const timer = ref(TIMER);

const handleClick = () => {
  storeBoxe.state.score++;
  updateGameState();
};

// Should last TIMER seconds
const startTimer = () => {
  timerId = setInterval(() => {
    timer.value -= 1;
    if (timer.value === 0) {
      clearInterval(timerId);
      clearInterval(intervalId);
      storeBoxe.state.playable = false;
    }
  }, 1000);
};

onMounted(() => {
  // resetInterval();
  // startTimer();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  if (timerId) {
    clearInterval(timerId);
  }
});
</script>

<template>
  <div>
    <div class="flex justify-between text-2xl text-white">
      <div>Score: {{ storeBoxe.state.score }}</div>
      <div>Temps: {{ timer }}</div>
    </div>

    <div
      class="h-[500px] w-[500px] flex flex-col backdrop-brightness-75 rounded-2xl justify-center hover:cursor-pointer"
    >
      <div
        class="flex flex-row justify-center"
        v-for="(row, rowIndex) in GAME_STATE"
        :key="rowIndex"
      >
        <AimTarget
          v-for="(cell, colIndex) in row"
          :key="`${rowIndex}-${colIndex}`"
          :active="cell"
          :disabled="timer === 0"
          @update-click="handleClick"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
