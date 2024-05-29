<script setup lang="ts">
import { ref } from "vue";
import arrow from "/arrow.svg";
import CarouselContent from "@/components/gui/onboarding/CarouselContent.vue";
import CommandContainer from "@/components/gui/commands/CommandContainer.vue";
import CustomKBD from "@/components/gui/commands/CustomKBD.vue";
import Title from "@/components/gui/onboarding/Title.vue";
import Info from "@/components/gui/games/Tips.vue";
const carousel = ref(0);
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[1000px]"
  >
    <button
      id="close-aide"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img
        src="../../../../public/close.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>
    <button
      id="back-options"
      class="absolute -left-3 -top-3 w-10 h-10 border-2 rounded border-black bg-green-700 hover:bg-green-800 transition-all"
    >
      <img
        src="../../../../public/back.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>
    <div class="text-4xl font-bold text-center mt-2 mb-4">
      Aides du jeu Golden Legends !
    </div>
    <div class="w-full h-fit flex justify-between items-center overflow-y-auto">
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
            <Title text="Déplacements dans le lobby" class="mb-4"></Title>

            <Title text="Se déplacer" class="-mb-2"></Title>
            <div class="flex gap-12 items-center">
              <div class="flex flex-col w-fit my-4">
                <div class="flex justify-center">
                  <CustomKBD :keybind="'z'" class="w-fit" />
                </div>
                <div class="flex justify-between">
                  <CustomKBD :keybind="'q'" class="w-fit" />
                  <CustomKBD :keybind="'s'" class="w-fit" />
                  <CustomKBD :keybind="'d'" class="w-fit" />
                </div>
              </div>
              <Title text="OU"></Title>
              <div class="flex flex-col w-fit my-4">
                <div class="flex justify-center">
                  <CustomKBD :keybind="'w'" class="w-fit" />
                </div>
                <div class="flex justify-between">
                  <CustomKBD :keybind="'a'" class="w-fit" />
                  <CustomKBD :keybind="'s'" class="w-fit" />
                  <CustomKBD :keybind="'d'" class="w-fit" />
                </div>
              </div>
            </div>

            <Title text="Caméra" class="-mb-2"></Title>
            <CustomKBD :keybind="'souris'" class="w-fit my-4" />
            <Info
              :content="[
                'N\'oubliez pas de verrouiller la souris en cliquant sur l\'écran pour que les mouvements de la souris soient pris en compte !',
                'Inversement, pour récupérer la souris, appuyez sur la touche Echap.',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 1">
          <div>
            <Title text="Actions dans le lobby" class="mb-4"></Title>

            <Title text="Dash (en sautant)" class="-mb-2"></Title>
            <div class="flex gap-4 items-center">
              <div class="flex flex-col w-fit my-4">
                <div class="flex justify-center">
                  <CustomKBD :keybind="'a'" class="w-fit" />
                </div>
              </div>
              <Title text="OU"></Title>
              <div class="flex flex-col w-fit my-4">
                <div class="flex justify-center">
                  <CustomKBD :keybind="'q'" class="w-fit" />
                </div>
              </div>
            </div>

            <div class="flex justify-between gap-8">
              <div class="w-1/3">
                <Title text="Ouvrir le menu" class="mt-8 -mb-2"></Title>
                <CustomKBD :keybind="'o'" class="w-fit my-4" />
              </div>
              <div class="w-2/5">
                <Title text="Ouvrir la minimap" class="mt-8 -mb-2"></Title>
                <CustomKBD :keybind="'c'" class="w-fit my-4" />
              </div>
              <div class="w-1/3">
                <Title text="Danse" class="mt-8 -mb-2"></Title>
                <CustomKBD :keybind="'f'" class="w-fit my-4" />
              </div>
            </div>
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 2">
          <div>
            <Title text="100m - Comment jouer ?" class=""></Title>
            <CommandContainer
              name="COURIR"
              :keys="['s', 'd']"
              class="w-fit my-4"
            />
            <Title text="Astuces" class="mb-3"></Title>
            <Info
              :content="[
                'Pour aller le plus vite possible, alternez les touches sans vous tromper, une mauvaise technique peut vous ralentir...',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 3">
          <div>
            <Title text="100m Brasse - Comment jouer ?"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['ESPACE']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="NAGER"
                :keys="['s', 'd']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Astuces" class="mb-3"></Title>
            <Info
              :content="[
                'Appuyer sur ESPACE pour plonger et vous retourner.',
                'Pour aller le plus vite possible, alternez les touches sans vous tromper, une mauvaise technique peut vous ralentir...',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 4">
          <div>
            <Title text="Plongeon - Comment jouer ?"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['ESPACE']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="FIGURES"
                width="260"
                :keys="['F', 'G', 'H', 'J']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Astuces" class="mb-3"></Title>
            <Info
              :content="[
                'Appuyer sur ESPACE pour plonger.',
                'Vous devez retenir une suite de lettres qui sera toujours différente et la restituer ensuite dans un temps imparti (chaque lettre correspondant à une figure).',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 5">
          <div>
            <Title text="Tir à l'arc - Comment jouer ?"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['ESPACE']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="VISÉE↕️"
                :keys="['V']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="VISÉE↔️"
                :keys="['H']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Astuces" class="mb-3"></Title>
            <Info
              :content="[
                'Appuyer sur ESPACE pour démarrer.',
                'Vous disposez de 2 jauges qui vous permettent de viser et de tirer le plus possible au centre de la cible. Pour cela, vous appuyerez sur H pour régler la visée horizontale puis sur V pour régler la visée verticale.',
              ]"
            />
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 6">
          <div>
            <Title text="Boxe - Comment jouer ?"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['SOURIS']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Astuces" class="mb-3"></Title>
            <Info
              :content="[
                'Pour frapper, cliquez sur la souris dans les cibles qui apparaitront à l\'écran.',
              ]"
            />
          </div>
        </CarouselContent>
      </div>

      <button
        :disabled="carousel === 6"
        @click="carousel++"
        class="disabled:opacity-30 ml-8 p-4 rounded-full backdrop-brightness-50 w-20"
      >
        <img :src="arrow" alt="right-arrow" class="w-12 h-8 rotate-180" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
