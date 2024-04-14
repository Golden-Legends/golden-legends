<script setup lang="ts">
import ClassicButton from "@/components/landing/ClassicButton.vue";
import router from "@/router/routes.ts";
import CharactersContainer from "@/components/characters/CharactersContainer.vue";
import { ref } from "vue";
import { CHARACTERS } from "@/utils/constants.ts";
import PlayButton from "@/components/characters/PlayButton.vue";

const pathCharacter = ref(null as string | null);

const getNameFromPath = (path: string) => {
  const character = CHARACTERS.find((character) => character.path === path);
  return character?.name;
};

const getDescriptionFromPath = (path: string) => {
  const character = CHARACTERS.find((character) => character.path === path);
  return character?.description;
};

const getUsernameFromLocalStorage = () => {
  return localStorage.getItem("username");
};
</script>

<template>
  <div class="h-screen w-screen bg-white flex">
    <div
      class="w-3/5 h-screen bg-primary p-14 flex flex-col gap-12 overflow-auto"
    >
      <div class="flex flex-col gap-16">
        <ClassicButton
          text="Retour"
          @click="router.push({ name: 'Landing' })"
        />
        <span class="flex text-4xl font-bold">
          {{ getUsernameFromLocalStorage() }}, choisis ton personnage !
        </span>
      </div>
      <CharactersContainer
        class="w-full"
        @select-character="pathCharacter = $event"
      />

      <PlayButton
        :disabled="!pathCharacter"
        @click="
          router.push({ name: 'Game', params: { character: pathCharacter } })
        "
      />
    </div>

    <div class="w-2/5 h-screen p-14 flex flex-col">
      <span
        class="text-8xl font-black uppercase text-blue-darker"
        v-if="pathCharacter"
        >{{ getNameFromPath(pathCharacter) }}</span
      >
      <span class="text-xl font-bold text-black" v-if="pathCharacter"
        >{{ getDescriptionFromPath(pathCharacter) }}
      </span>
      <div class="flex items-center gap-4">
        <video autoplay :src="`/src/assets/characters/${pathCharacter}.mp4`" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
