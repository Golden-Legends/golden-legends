<script setup lang="ts">
import ClassicButton from "@/components/landing/ClassicButton.vue";
import router from "@/router/routes.ts";
import CharactersContainer from "@/components/characters/CharactersContainer.vue";
import { ref } from "vue";
import { CHARACTERS } from "@/utils/constants.ts";
import PlayButton from "@/components/characters/PlayButton.vue";

const pathCharacter = ref("1");

const getNameFromPath = (path: string) => {
  const character = CHARACTERS.find((character) => character.path === path);
  return character?.name;
};
</script>

<template>
  <div class="h-screen w-screen bg-white flex">
    <div class="w-1/2 bg-primary h-full p-14 flex flex-col gap-16">
      <ClassicButton text="Retour" @click="router.push({ name: 'Landing' })" />
      <span class="text-4xl font-bold"> Choisissez votre personnage</span>
      <CharactersContainer @select-character="pathCharacter = $event" />

      <PlayButton
        @click="
          router.push({ name: 'Game', params: { character: pathCharacter } })
        "
      />
    </div>

    <div class="w-1/2 h-full p-14 flex flex-col">
      <span class="text-8xl font-bold uppercase text-blue-darker">{{
        getNameFromPath(pathCharacter)
      }}</span>
      <div class="flex items-center gap-4">
        <video autoplay :src="`/src/assets/characters/${pathCharacter}.mp4`" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
