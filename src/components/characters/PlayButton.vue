<script setup lang="ts">
import { Music } from "@/utils/Music.ts";

const props = defineProps<{
  disabled: boolean;
}>();

const music = Music.getInstance("./sounds/newAccueil.mp3", 0.1);

const stopMusic = () => {
  music.stop();
};

</script>

<template>
  <button
    :disabled="props.disabled"
    class="group py-2 px-6 border-2 w-full border-blue-darker bg-blue-darker rounded-lg text-2xl text-white font-bold specific-shadow uppercase hover:bg-end-blue-gradient disabled:opacity-30 transition-all duration-300"
  >
    <span @click="stopMusic">Jouer</span>
  </button>
</template>

<style scoped>
.specific-shadow {
  box-shadow:
    -0.1em 0.1em 0 #000,
    -0.2em 0.2em 0 #000;
}
</style>
