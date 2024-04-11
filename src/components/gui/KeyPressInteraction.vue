<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps({
  keys: {
    type: Array<string>,
    required: true,
  },
});

const pressedKeys = ref<string[]>([]);

const keyPressed = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  if (!pressedKeys.value.includes(key)) {
    pressedKeys.value.push(key);
  }
};

const keyReleased = (event: KeyboardEvent) => {
  const key = event.key.toLowerCase();
  const index = pressedKeys.value.indexOf(key);
  if (index !== -1) {
    pressedKeys.value.splice(index, 1);
  }
};

const addListeners = () => {
  window.addEventListener("keydown", keyPressed);
  window.addEventListener("keyup", keyReleased);
};

const removeListeners = () => {
  window.removeEventListener("keydown", keyPressed);
  window.removeEventListener("keyup", keyReleased);
};

// Add listeners on mounted
onMounted(() => {
  addListeners();
});

// Remove listeners on unmounted
onUnmounted(() => {
  removeListeners();
});
</script>

<template>
  <div class="relative flex gap-4">
    <div
      class="hidden absolute text-3xl font-bold uppercase text-red-800 -top-12 left-1/2 -translate-x-1/2"
      id="bad-keypress"
    >
      Dommage
    </div>
    <div
      class="hidden absolute text-3xl font-bold uppercase text-green-800 -top-12 left-1/2 -translate-x-1/2"
      id="good-keypress"
    >
      Parfait
    </div>
    <div
      class="uppercase text-xl font-black w-16 h-16 rounded-lg inline-flex items-center justify-center border-4 border-neutral-400"
      :class="{
        'bg-neutral-900 text-white opacity-100': pressedKeys.includes(key),
        'bg-neutral-200 text-black opacity-30': !pressedKeys.includes(key),
      }"
      v-for="key in props.keys"
      :key="key"
    >
      {{ key }}
    </div>
  </div>
</template>
