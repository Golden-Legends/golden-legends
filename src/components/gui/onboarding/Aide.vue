<script setup lang="ts">
import { ref } from "vue";
import arrow from "@/assets/arrow.svg";
import CarouselContent from "@/components/gui/onboarding/CarouselContent.vue";
import CommandContainer from "@/components/gui/commands/CommandContainer.vue";
import CustomKBD from "@/components/gui/commands/CustomKBD.vue";
import Title from "@/components/gui/onboarding/Title.vue";
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
      <img src="@/assets/close.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <button
      id="back-options"
      class="absolute -left-3 -top-3 w-10 h-10 border-2 rounded border-black bg-green-700 hover:bg-green-800 transition-all"
    >
      <img src="@/assets/back.svg" alt="close" class="w-6 h-6 ml-1.5" />
    </button>
    <div class="text-4xl font-bold text-center mt-2 mb-4">
      Aides du jeu Golden Legends !
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
            <Title text="Dans le lobby"></Title>
            <span>Les déplacements dans le lobby :</span>
            <div class="flex gap-2">
              <CustomKBD :keybind="'z'" class="w-fit my-4" />
              <CustomKBD :keybind="'q'" class="w-fit my-4" />
              <CustomKBD :keybind="'s'" class="w-fit my-4" />
              <CustomKBD :keybind="'d'" class="w-fit my-4" />
            </div>
            
            <span>La vision dans le lobby :</span>
            <CustomKBD :keybind="'souris'" class="w-fit my-4" />

            <span>Ouvrir le menu :</span>
            <CustomKBD :keybind="'o'" class="w-fit my-4" />
            <span>Ouvrir les objets trouvés :</span>
            <CustomKBD :keybind="'n'" class="w-fit my-4" />
            <span>Ouvrir la minimap :</span>
            <CustomKBD :keybind="'c'" class="w-fit my-4" />
            
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 1">
          <div>
            <Title text="100m"></Title>
            <span>Spam alterné des touches S et D, une mauvaise technique peut vous ralentir...</span>
            <CommandContainer
              name="COURIR"
              :keys="['s', 'd']"
              class="w-fit my-4"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 2">
          <div>
            <Title text="100m Brasse"></Title>
            <span>Appuyer sur ESPACE pour plonger et vous retourner.</span><br>
            <span>Spam alterné des touches S et D, une mauvaise technique peut vous ralentir...</span>
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
        </CarouselContent>

        <CarouselContent v-if="carousel === 3">
          <div>
            <Title text="Plongeon"></Title>
            <span>Appuyer sur ESPACE pour plonger.</span><br>
            <span>Vous devez retenir une suite de lettres qui sera toujours différente et la restituer ensuite dans un temps imparti (chaque lettre correspondant à une figure).</span>
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
        </CarouselContent>

        <CarouselContent v-if="carousel === 4">
          <div>
            <Title text="Tir à l'arc"></Title>
            <span>Appuyer sur ESPACE pour démarrer.</span><br>
            <span>Vous disposez de 2 jauges qui vous permettent de viser et de tirer le plus possible au centre de la cible.
              Pour cela, vous appuyerez sur H pour régler la visée horizontale puis sur V pour régler la visée verticale.</span>
            <CommandContainer
              name="ACTION"
              :keys="['ESPACE']"
              class="w-fit my-4"
            />
            <div class="flex gap-2">
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
          </div>
        </CarouselContent>
      </div>

      <button
        :disabled="carousel === 4"
        @click="carousel++"
        class="disabled:opacity-30 ml-8 p-4 rounded-full backdrop-brightness-50 w-20"
      >
        <img :src="arrow" alt="right-arrow" class="w-12 h-8 rotate-180" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
