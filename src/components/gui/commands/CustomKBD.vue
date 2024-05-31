<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  keybind: String || Number,
});

const key = ref(props.keybind);

if (key.value === "ArrowDown") {
  key.value = "↓";
} else if (key.value === "ArrowUp") {
  key.value = "↑";
} else if (key.value === "ArrowLeft") {
  key.value = "←";
} else if (key.value === "ArrowRight") {
  key.value = "→";
}
</script>

<template>
  <div
    class="border-4 border-black bg-neutral-900 rounded-lg h-12 w-fit min-w-[3rem]"
  >
    <div
      class="border-4 border-color w-full h-full rounded p-1 px-2 flex items-center justify-center"
    >
      <span class="font-black font-sans text-2xl uppercase text-white">
        {{ key }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.border-color {
  border-bottom-color: rgb(40, 39, 41);
  border-left-color: rgb(40, 39, 41);
  border-top-color: rgb(97, 96, 99);
  border-right-color: rgb(97, 96, 99);
}
</style>
