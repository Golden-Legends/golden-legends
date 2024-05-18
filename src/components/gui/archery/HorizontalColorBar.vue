<script setup lang="ts"></script>

<template>
  <div class="h-12 w-80 rounded-lg custom-gradient"></div>
</template>

<style scoped>
.custom-gradient {
  background: rgb(255, 0, 0);
  background: linear-gradient(
    90deg,
    rgba(255, 0, 0, 1) 0%,
    rgba(244, 255, 31, 1) 30%,
    rgba(72, 204, 36, 1) 50%,
    rgba(244, 255, 31, 1) 70%,
    rgba(255, 0, 0, 1) 100%
  );
}
</style>
