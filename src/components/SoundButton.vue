<script setup lang="ts">
import { storeSound } from "@/components/gui/storeSound.ts";


const changeSound = () => {
  storeSound.state.etat = !storeSound.state.etat;
};
</script>

<template>
  <button v-if="storeSound.state.etat" @click="changeSound()" class="h-14 w-14 opacity-70">
    <img src="@/../public/sound_off.png" alt="Sound icon" />
  </button>
  <button v-else @click="changeSound()" class="h-14 w-14">
    <img src="@/../public/sound_on.png" alt="Sound icon" />
  </button>
</template>

<style scoped></style>