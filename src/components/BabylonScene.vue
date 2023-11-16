<template>
  <canvas ref="bjsCanvas" />
  <MainOptions />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createScene } from "../scenes/MainScene.ts";
import MainOptions from "./MainOptions.vue";

const bjsCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (bjsCanvas.value) {
    createScene(bjsCanvas.value);
  }
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>