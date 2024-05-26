<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{
  active: boolean;
  disabled: boolean;
}>();

const emit = defineEmits(["update-click"]);

const handleClick = () => {
  if (props.active) {
    emit("update-click");
  }
};
</script>

<template>
  <button
    class="h-24 w-24 rounded-full"
    :class="props.active && !props.disabled ? 'bg-red-500' : 'bg-transparent'"
    @click="handleClick"
    :disabled="props.disabled"
  ></button>
</template>

<style scoped></style>
