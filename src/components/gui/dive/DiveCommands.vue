<script setup lang="ts">
const props = defineProps({
  keybinds: {
    type: Array<String | undefined>,
    required: true,
    default : [],
  },
  index: {
    type: Number,
    required: true,
  },
  resultState: {
    type: Array<boolean | null>,
    required: true,
    default : [],
  },
});


</script>

<template>
  <div class="relative">
    <div class="flex gap-2 justify-center">
      <div
        v-for="(keybind, index) in props.keybinds"
        class="border-4 mt-4 border-black rounded-lg h-12 w-fit min-w-[3rem]"
        :class="{
          'bg-green-700': props.resultState[index],
          'bg-red-700': props.resultState[index] === false,
          'border-black animate-bounce	': index === props.index,
          'border-neutral-300': index !== props.index,
        }"
      >
        <div
          class="w-full h-full rounded p-1 px-2 flex items-center justify-center"
        >
          <span
            v-if="index < props.index"
            class="font-black font-sans text-2xl uppercase text-white"
          >
            {{ keybind }}
          </span>
        </div>
      </div>
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
