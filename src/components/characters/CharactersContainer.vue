<script setup lang="ts">
import Character from "@/components/characters/Character.vue";
import { CHARACTERS } from "@/utils/constants.ts";

// For every characters, if enabled is a string, check in localStorage the value of its boolean.
// If the value is false, disable the character.
CHARACTERS.forEach((character) => {
  if (typeof character.enabled === "string") {
    const enabled = localStorage.getItem(character.enabled);
    if (enabled === "false") {
      character.enabled = false;
    }
  }
});
</script>

<template>
  <div class="flex gap-10 flex-wrap">
    <Character
      v-for="character in CHARACTERS"
      :key="character.path"
      :character="character"
      :enabled="character.enabled !== false"
      @select-character="$emit('select-character', character)"
    />
  </div>
</template>

<style scoped></style>
