<script setup lang="ts">
import { timerToSMS } from "../../utils/utils.ts";

const props = defineProps({
  timer: Number,
});
</script>

<template>
  <div
    class="flex justify-between border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white w-64 items-center p-2 px-4 rounded-lg"
  >
    <img src="@/../public/timer_logo.svg" alt="timer logo" class="mr-16" />
    <div class="font-bold text-2xl">
      {{ timerToSMS(props.timer) }}
    </div>
  </div>
</template>

<style scoped></style>
