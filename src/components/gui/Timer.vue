<script setup lang="ts">
import { onMounted, ref } from "vue";

const timer = ref(0);

const timerToSMS = (time: number): string => {
  const seconds = Math.floor(time / 100);
  const milliseconds = time % 100;
  return `${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
};

const startTimer = () => {
  setInterval(() => {
    if (timer.value < 1000) {
      timer.value += 1;
    } else {
      clearTimeout(this);
    }
  }, 10);
};

onMounted(() => {
  startTimer();
});
</script>

<template>
  <div
    class="flex justify-between border-4 border-black bg-gradient-to-b from-begin-gradient to-end-gradient text-white w-64 items-center p-2 px-4 rounded-lg"
  >
    <img src="@/assets/timer_logo.svg" alt="timer logo" class="mr-16" />
    <div class="font-bold text-2xl">
      {{ timerToSMS(timer) }}
    </div>
  </div>
</template>

<style scoped></style>
