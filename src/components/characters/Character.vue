<script setup lang="ts">
const props = defineProps<{
  character: {
    name: string;
    path: string;
  };
  enabled: boolean;
}>();

const getAsset = (name: string) => {
  return `/src/assets/characters/${name}.png`;
};
</script>

<template>
  <button
    class="w-40 h-40 rounded-2xl bg-blue-lighter flex items-center justify-center transition duration-500 group enabled:hover:rotate-12 specific-shadow disabled:opacity-30 disabled:cursor-not-allowed"
    @click="$emit('select-character', props.character.path)"
    :disabled="!props.enabled"
  >
    <img
      class="w-full h-full rounded-full scale-125 enabled:group-hover:scale-150 transition duration-500 pointer-events-none"
      :src="getAsset(props.character.path)"
      alt="character"
    />
  </button>
</template>

<style scoped>
.specific-shadow {
  box-shadow: -0.4em 0.4em 0 #005988;
}
</style>
