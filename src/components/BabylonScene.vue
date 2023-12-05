<template>
  <canvas ref="bjsCanvas" />
  <StatsInfos :fps="fps" :nbMesh="nbMesh"/>
  <MainOptions />
</template>

<script setup lang="ts">
import {ref, onMounted, Ref} from "vue";
import MainOptions from "./MainOptions.vue";
import StatsInfos from "./StatsInfos.vue";
import App from "../../src/models/scene/App.ts";

const bjsCanvas = ref<HTMLCanvasElement | null>(null);
const fps : Ref<string> = ref("");
const nbMesh : Ref<number> = ref(0);

onMounted(() => {
  if (bjsCanvas.value) {
    const fpsCallback = (fpsParam: string) => {
      fps.value = fpsParam;
    };
    const nbMeshCallback = (nbMeshParam: number) => {
      nbMesh.value = nbMeshParam;
    };

    const app = new App(bjsCanvas.value);

  }
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>