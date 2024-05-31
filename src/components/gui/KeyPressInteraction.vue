<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import CustomKBD from "./commands/CustomKBD.vue";

const props = defineProps({
  keys: {
    type: Array<string>,
    required: true,
  },
});

const pressedKeys = ref<string[]>([]);

const keyPressed = (event: KeyboardEvent) => {
  const key = event.key;
  if (!pressedKeys.value.includes(key)) {
    pressedKeys.value.push(key);
  }
};

const keyReleased = (event: KeyboardEvent) => {
  const key = event.key;
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
    <CustomKBD
      :class="{
        'opacity-100': pressedKeys.includes(key),
        'opacity-30': !pressedKeys.includes(key),
      }"
      v-for="key in props.keys"
      :keybind="key"
    />
  </div>
</template>
