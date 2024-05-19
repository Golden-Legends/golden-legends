<script setup lang="ts">
const props = defineProps({
  keybind: String,
});
</script>

<template>
  <div
    class="border-4 border-black bg-neutral-900 rounded-lg h-12 w-fit min-w-[3rem]"
  >
    <div
      class="border-4 border-color w-full h-full rounded p-1 px-2 flex items-center justify-center"
    >
      <span class="font-black font-sans text-2xl uppercase text-white">
        {{ props.keybind }}
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
