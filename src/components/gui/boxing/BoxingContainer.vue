<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import AimTarget from "@/components/gui/boxing/AimTarget.vue";

const TIMER = 30;
const GAME_SIZE = 5;
const TIMEOUT = 1000;

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
  intervalId = setInterval(updateGameState, TIMEOUT);
};

const counter = ref(0);
const timer = ref(TIMER);

const handleClick = () => {
  counter.value += 1;
  updateGameState();
};

// Should last TIMER seconds
const startTimer = () => {
  timerId = setInterval(() => {
    timer.value -= 1;
    if (timer.value === 0) {
      clearInterval(timerId);
      clearInterval(intervalId); // Stop game when timer ends
    }
  }, 1000);
};

onMounted(() => {
  resetInterval();
  startTimer();
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
    <div class="flex justify-between">
      <div>Score: {{ counter }}</div>
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
