<script setup lang="ts">
import Character from "@/components/characters/Character.vue";
import { CHARACTERS } from "@/utils/constants.ts";
</script>

<template>
  <div class="flex gap-12 flex-wrap">
    <Character
      v-for="character in CHARACTERS"
      :key="character.path"
      :character="character"
      @select-character="$emit('select-character', character.path)"
    />
  </div>
</template>

<style scoped></style>
