<script setup lang="ts">
import { Toaster } from "vue-sonner";
</script>

<template>
  <Toaster closeButton position="top-right" />
  <router-view></router-view>
  <!-- <SoundButton id="sound-button" class="absolute bottom-6 left-8 z-10"/> -->
</template>
