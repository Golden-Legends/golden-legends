<script setup lang="ts">
import CustomKBD from "@/components/gui/commands/CustomKBD.vue";

const props = defineProps({
  name: String,
  keys: Array<string>,
  width: String,
});
</script>

<template>
  <div
    class="relative mb-4 justify-between border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white min-w-[160px] min-h-[64px] items-center p-2 px-4 rounded-lg"
    :style="{ width: `${props.width}px` }"
  >
    <div
      class="absolute -top-4 text-3xl font-black rounded-lg text-stroke-2 left-1/2 -translate-x-1/2 w-full text-center"
    >
      {{ props.name }}
    </div>
    <div class="absolute -bottom-4 left-1/2 -translate-x-1/2">
      <div class="flex gap-2">
        <CustomKBD v-for="key in props.keys" :keybind="key" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
