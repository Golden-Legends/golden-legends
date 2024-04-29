<script setup lang="ts">
import { ref } from "vue";

const soundON = ref(false);

const changeSound = () => {
  soundON.value = !soundON.value;
};
</script>

<template>
  <button v-if="soundON" @click="changeSound()" class="h-14 w-14 opacity-70">
    <img src="@/assets/sound_off.png" alt="Sound icon" />
  </button>
  <button v-else @click="changeSound()" class="h-14 w-14">
    <img src="@/assets/sound_on.png" alt="Sound icon" />
  </button>
</template>

<style scoped></style>
