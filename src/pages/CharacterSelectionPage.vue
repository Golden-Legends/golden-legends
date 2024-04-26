<script setup lang="ts">
import ClassicButton from "@/components/landing/ClassicButton.vue";
import router from "@/router/routes.ts";
import CharactersContainer from "@/components/characters/CharactersContainer.vue";
import { ref } from "vue";
import PlayButton from "@/components/characters/PlayButton.vue";

interface Character {
  name: string;
  path: string;
  pathGlb: string;
  description: string;
}

const defaultCharacter = {
  name: "default",
  path: "1",
  pathGlb: "perso.glb",
  description: "default character",
};

const character = ref(null as Character | null);

const getUsernameFromLocalStorage = () => {
  return localStorage.getItem("username");
};

const setPathCharacterLocalStorage = (path: Character | null) => {
  if (!path) {
    path = defaultCharacter;
  }
  localStorage.setItem("pathCharacter", path.pathGlb);
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
        @select-character="character = $event"
      />

      <PlayButton
        :disabled="!character"
        @click="
          router.push({ name: 'Game', params: { characterPath: character?.path } }); 
          setPathCharacterLocalStorage(character);
        "
      />
    </div>

    <div class="w-2/5 h-screen p-14 flex flex-col bg-[#fdfdfd]">
      <span
        class="text-8xl font-black uppercase text-blue-darker"
        v-if="character"
        >{{ character.name }}</span
      >
      <span class="text-xl font-bold text-black" v-if="character"
        >{{ character?.description }}
      </span>
      <div class="flex items-center gap-4">
        <video autoplay :src="`/src/assets/characters/${character?.path}.mp4`" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
