<script setup lang="ts">

const props = defineProps({
  score: Number,
});

const scoreToSMS = (score: number | undefined): number => {
  if (score === undefined) { 
    return 0;
  }
  return score;
};

</script>

<template>
  <div
    class="flex justify-between border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white w-64 items-center p-2 px-4 rounded-lg"
  >
    <img src="@/assets/timer_logo.svg" alt="timer logo" class="mr-16" />
    <div class="font-bold text-2xl">
      {{ scoreToSMS(props.score) }}
    </div>
  </div>
</template>

<style scoped></style>
