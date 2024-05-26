<script setup lang="ts">
import HomeButton from "@/components/gui/options/HomeButton.vue";
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[400px] h-min-[100px]"
  >
    <div class="w-full mt-1">
      <div class="uppercase text-4xl font-black text-stroke-2">Menu</div>
    </div>

    <div class="flex flex-col gap-4 my-4">
      <slot />
    </div>

    <div class="flex flex-col gap-4 my-4">
      <HomeButton />
    </div>
  </div>
</template>

<style scoped></style>
