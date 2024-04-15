<script setup lang="ts">
import { store } from "@/components/gui/store.ts";

const timerToSMS = (time: number): string => {
  
  const seconds = Math.floor(time / 1000);
  const milliseconds = time % 100;
  return `${seconds}.${milliseconds < 10 ? "0" : ""}${milliseconds}`;
};

</script>

<template>
  <div
    class="flex justify-between border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white w-64 items-center p-2 px-4 rounded-lg"
  >
    <img src="@/assets/timer_logo.svg" alt="timer logo" class="mr-16" />
    <div class="font-bold text-2xl">
      {{ timerToSMS(store.state.timer) }}
    </div>
  </div>
</template>

<style scoped></style>
