<script setup lang="ts">
import { ref } from "vue";
import arrow from "/arrow.svg";
import CarouselContent from "@/components/gui/onboarding/CarouselContent.vue";
import jeuSaut from "/jeuSaut.png";
import objets from "/objets.png";
import Title from "@/components/gui/onboarding/Title.vue";
const carousel = ref(0);
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[1000px]"
  >
    <button
      id="close-tips"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img
        src="../../../../public/close.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>
    <button
      id="back-options2"
      class="absolute -left-3 -top-3 w-10 h-10 border-2 rounded border-black bg-green-700 hover:bg-green-800 transition-all"
    >
      <img
        src="../../../../public/back.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>
    <div class="text-4xl font-bold text-center mt-2 mb-4">
      Golden Legends Easter eggs !
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
            <Title text="Unlock new characters!"></Title>
            <span>
              Complete this game of skill and balance to unlock 2 new characters.
            </span>
            <img :src="jeuSaut" alt="jeuSaut" class="w-full rounded-lg my-2" />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 1">
          <div>
            <Title text="Unlock new characters!"></Title>
            <span>
              Collect all the Olympic items (there are 8) in the lobby to unlock 2 new characters.
              Red smoke comes out of these objects to help you.
            </span>
            <div class="flex justify-center">
              <img
                :src="objets"
                alt="objets"
                class="w-[600px] rounded-lg my-2"
              />
            </div>
          </div>
        </CarouselContent>
      </div>

      <button
        :disabled="carousel === 1"
        @click="carousel++"
        class="disabled:opacity-30 ml-8 p-4 rounded-full backdrop-brightness-50 w-20"
      >
        <img :src="arrow" alt="right-arrow" class="w-12 h-8 rotate-180" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
