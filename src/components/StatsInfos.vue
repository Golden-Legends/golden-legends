<template>
  <div class="absolute top-0 left-0 text-white bg-neutral-800 p-4 text-lg">
    <div class="flex flex-col gap-2">
      <span>FPS : {{ fps }}</span>
      <span>NB_MESH : {{ nbMesh }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  fps: {
    type: String,
  },
  nbMesh: {
    type: Number,
  },
});
</script>
