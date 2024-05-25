<script setup lang="ts">
import { defineEmits } from "vue";

const props = defineProps<{
  placeholder: string;
}>();

const emit = defineEmits<{
  (e: "update-username", value: string): void;
}>();
</script>

<template>
  <input
    type="text"
    class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg text-lg font-bold w-64"
    :placeholder="props.placeholder"
    @input="
      (event) =>
        emit('update-username', (event.target as HTMLInputElement).value)
    "
  />
</template>

<style scoped></style>
