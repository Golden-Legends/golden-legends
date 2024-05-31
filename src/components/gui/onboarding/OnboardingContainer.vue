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
      Bienvenue sur Golden Legends !
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
            <Title text="Prêt à jouer ?"></Title>
            <span
              >Épreuves, mini-jeux, objets... La carte de Paris n'attend que
              toi. Explore les alentours pour trouver tous les secrets de cette
              carte. Et des PNJ seront là pour t'aider si besoin.</span
            >
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
            <Title text="Des portails ?"></Title>
            <span>Ils servent à accéder à nos différentes épreuves.</span>
            <div class="flex justify-center">
              <img :src="lobby" alt="lobby" class="w-[500px] rounded-lg my-2" />
            </div>
          </div>

          <div>
            <Title text="Comment les utiliser ?"></Title>
            <span>Vous n'avez qu'à aller devant pour tester 😄</span>
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 2">
          <div>
            <Title text="Des records ?"></Title>
            <span
              >Approchez vous près des stations rouges pour voir les 10
              meilleurs scores de chaque jeu. Plus la difficulté du jeu sera
              élévée, plus vous pourrez obtenir un score élevé.</span
            ><br />
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
            <Title text="Comment faire partie des Golden Legends ?"></Title>
            <span
              >Spammer nos mini-jeux pour atteindre les sommets des scoreboards
              !</span
            >
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 3">
          <div>
            <Title text="Comment jouer ?"></Title>
            <span>
              Pour vous déplacer, utilisez les touches Z, Q, S, D (azerty) ou W, A, S, D (qwerty) et utilisez la souris pour bouger la caméra.
              Vous pouvez danser avec F et vous pouvez dash avec A lorsque vous avancez en sautant.<br>
              Si vous voulez plus de détails sur les commandes dans la ville de Paris ou dans les différents jeux, vous pouvez les retrouver dans le menu, section "Aides".
            </span>
          </div>
          <div>
            <Title text="Mais qu'est-ce que je peux bien faire ?"></Title>
            <span
              >Tu peux visiter la carte, découvrir des lieux emblématiques,
              trouver d'autres mini-jeux ou des objets cachés...pour débloquer
              de nouveaux personnages.</span
            >
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
