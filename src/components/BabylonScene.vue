<template>
  <canvas ref="bjsCanvas" />
  <Dialog
    name="Gladiator"
    :text="jumpGameText"
    id="jump-game-dialog"
    class="hidden absolute bottom-12 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
  />
  <MainOptions />
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MainOptions from "./MainOptions.vue";
import App from "../../src/models/App.ts";
import Dialog from "@/components/gui/Dialog.vue";

const bjsCanvas = ref<HTMLCanvasElement | null>(null);
const jumpGameText = "Appuie sur Espace pour commencer le jeu !";
onMounted(() => {
  if (bjsCanvas.value) {
    new App(bjsCanvas.value);
  }
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>
