<script setup lang="ts">
const props = defineProps<{
  content: string[];
}>();
</script>

<template>
  <div
    class="bg-blue-100 text-blue-900 p-3 flex flex-col gap-3 rounded-lg border-black border-4"
  >
    <div class="text-2xl font-bold">Tips</div>
    <div class="flex flex-col gap-2">
      <div v-for="tip in props.content" :key="tip" class="text-lg">
        {{ tip }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
