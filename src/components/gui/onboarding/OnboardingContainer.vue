<script setup lang="ts">
import { ref } from "vue";
import arrow from "@/assets/arrow.svg";
import CarouselContent from "@/components/gui/onboarding/CarouselContent.vue";
import CommandContainer from "@/components/gui/commands/CommandContainer.vue";
import Title from "@/components/gui/onboarding/Title.vue";

const carousel = ref(0);
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[700px]"
  >
    <div class="text-4xl font-bold text-center mt-2 mb-8">
      Bienvenue sur GoldenLegends !
    </div>
    <div class="w-full h-fit flex justify-between items-center">
      <button
        :disabled="carousel === 0"
        @click="carousel--"
        class="disabled:opacity-50 mr-8 w-12 h-12"
      >
        <img :src="arrow" alt="left-arrow" class="w-12 h-12" />
      </button>
      <CarouselContent v-if="carousel === 0">
        <div>
          <Title text="Des portails ?"></Title>
          <span>Ils servent à accéder à nos différentes épreuves.</span>
        </div>

        <div>
          <Title text="Comment les utiliser ?"></Title>
          <span>Vous n'avez qu'à aller devant pour tester 😄</span>
        </div>

        <div>
          <Title text="Quelles sont les touches ?"></Title>
          <span
            >Chaque jeu à des touches différentes, n'oubliez pas de les
            consulter! Voici comment cela sera affiché :
          </span>
          <CommandContainer
            name="COURIR"
            :keys="['s', 'd']"
            class="w-fit my-4"
          />
        </div>
      </CarouselContent>
      <CarouselContent v-if="carousel === 1">
        <div>
          <Title text="Où suis-je ?"></Title>
          <span>À Paris, à notre façon.</span>
        </div>
        <div>
          <Title text="Mais qu'est-ce que je peux bien faire ?"></Title>
          <span
            >Tu peux visiter la carte, découvrir des lieux emblématiques,
            trouver d'autres mini-jeux ou des objets cachés...</span
          >
        </div>
      </CarouselContent>
      <button
        :disabled="carousel === 1"
        @click="carousel++"
        class="disabled:opacity-50 ml-8 w-12 h-12"
      >
        <img :src="arrow" alt="right-arrow" class="w-12 h-12 rotate-180" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
