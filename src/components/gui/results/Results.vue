<script setup lang="ts">
import ContinueButton from "@/components/gui/results/ContinueButton.vue";

const props = defineProps({
  title: String,
});
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[400px] h-min-[100px]"
  >
    <div class="w-full mt-1">
      <div class="uppercase text-4xl font-black text-stroke-2">
        {{ props.title }}
      </div>
    </div>

    <div class="flex flex-col gap-4 my-4">
      <slot />
    </div>

    <div class="flex flex-col items-center gap-4 my-4">
      <ContinueButton id="continue-button" />
    </div>
  </div>
</template>

<style scoped></style>
