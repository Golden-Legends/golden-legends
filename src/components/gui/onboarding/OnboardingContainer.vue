<script setup lang="ts">
import { ref } from "vue";
import arrow from "/arrow.svg";
import CarouselContent from "@/components/gui/onboarding/CarouselContent.vue";
import CommandContainer from "@/components/gui/commands/CommandContainer.vue";
import Title from "@/components/gui/onboarding/Title.vue";
import map_overview from "/map_overview.png";
import lobby from "/lobby.png";
import scoreboard from "/scoreboard.png";

const carousel = ref(0);
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[1000px]"
  >
    <button
      id="close-onboarding"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img
        src="../../../../public/close.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>
    <div class="text-4xl font-bold text-center mt-2 mb-4">
      Welcome to Golden Legends !
    </div>
    <div class="w-full h-fit flex justify-between items-center">
      <button
        :disabled="carousel === 0"
        @click="carousel--"
        class="disabled:opacity-30 mr-8 p-4 rounded-full backdrop-brightness-50 w-20"
      >
        <img :src="arrow" alt="left-arrow" class="w-12 h-8" />
      </button>
      <div class="rounded-xl backdrop-brightness-75 px-4 py-4 w-3/4">
        <CarouselContent v-if="carousel === 0">
          <div>
            <Title text="Ready to play?"></Title>
            <span>
                Games, easter eggs, objects... The map of Paris is waiting for you. 
                Explore the surrounding area to find all the secrets on this map. 
                And NPCs will be there to help you if you need them.
            </span>
            <div class="flex justify-center">
              <img
                :src="map_overview"
                alt="map-overview"
                class="w-[500px] rounded-lg my-2"
              />
            </div>
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 1">
          <div>
            <Title text="Gates?"></Title>
            <span>They are used to access our various games.</span>
            <div class="flex justify-center">
              <img :src="lobby" alt="lobby" class="w-[500px] rounded-lg my-2" />
            </div>
          </div>

          <div>
            <Title text="How do you use them?"></Title>
            <span>All you have to do is go in front of them to try them out 😄</span>
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 2">
          <div>
            <Title text="Records?"></Title>
            <span>
              Get close to the red stations to see the top 10 scores for each game.
              The more difficult the game, the higher your score.
            </span>
            <br />
            <span></span>
            <div class="flex justify-center">
              <img
                :src="scoreboard"
                alt="lobby"
                class="w-1/2 h-[400px] rounded-lg my-2"
              />
            </div>
          </div>

          <div class="-mt-4">
            <Title text="How to become a Golden Legends?"></Title>
            <span>
              Spam our mini-games to reach the top of the scoreboards!
            </span>
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 3">
          <div>
            <Title text="How to play?"></Title>
            <span>
              To move around, use the keys Z, Q, S, D (azerty) or W, A, S, D (qwerty) and use the mouse to move the camera. 
              You can dance with F and you can dash with A as you jump forward.<br>
              If you want more details about game controls in the city of Paris or in the different games, you can find them in the menu, in the "Help" section.
            </span>
          </div>
          <div>
            <Title text="But what can I do?"></Title>
            <span>
              You can visit the map, discover iconic locations, find other mini-games or hidden objects... to unlock new characters.
            </span>
          </div>
        </CarouselContent>
      </div>

      <button
        :disabled="carousel === 3"
        @click="carousel++"
        class="disabled:opacity-30 ml-8 p-4 rounded-full backdrop-brightness-50 w-20"
      >
        <img :src="arrow" alt="right-arrow" class="w-12 h-8 rotate-180" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
