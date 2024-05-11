<script setup lang="ts">
import { ref } from "vue";
import CustomKBD from "./commands/CustomKBD.vue";

const props = defineProps({
  keys: {
    type: Array<string>,
    required: true,
  },
});

const pressedKeys = ref<string[]>([]);


</script>

<template>
  <div class="relative flex gap-4">
    <CustomKBD :class="{
        'opacity-90': pressedKeys.includes(key),
        'opacity-100': !pressedKeys.includes(key),
      }" v-for="key in props.keys" :keybind="key" />
  </div>
</template>
