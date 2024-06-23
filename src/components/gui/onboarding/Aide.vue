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
      Golden Legends game help !
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
            <Title text="Lobby movements" class="mb-4"></Title>

            <Title text="Moving around" class="-mb-2"></Title>
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
              <Title text="OR"></Title>
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

            <Title text="Camera" class="-mb-2"></Title>
            <CustomKBD :keybind="'souris'" class="w-fit my-4" />
            <Info
              :content="[
                'Don\'t forget to lock the mouse by clicking on the screen so that mouse movements are taken into account!',
                'Conversely, to retrieve the mouse, press the Esc key.',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 1">
          <div>
            <Title text="Lobby actions" class="mb-4"></Title>

            <Title text="Dash (while jumping)" class="-mb-2"></Title>
            <div class="flex gap-4 items-center">
              <div class="flex flex-col w-fit my-4">
                <div class="flex justify-center">
                  <CustomKBD :keybind="'a'" class="w-fit" />
                </div>
              </div>
              <Title text="OR"></Title>
              <div class="flex flex-col w-fit my-4">
                <div class="flex justify-center">
                  <CustomKBD :keybind="'q'" class="w-fit" />
                </div>
              </div>
            </div>

            <div class="flex justify-between gap-8">
              <div class="w-1/3">
                <Title text="Open menu" class="mt-8 -mb-2"></Title>
                <CustomKBD :keybind="'o'" class="w-fit my-4" />
              </div>
              <div class="w-2/5">
                <Title text="Open minimap" class="mt-8 -mb-2"></Title>
                <CustomKBD :keybind="'c'" class="w-fit my-4" />
              </div>
              <div class="w-1/3">
                <Title text="Dance" class="mt-8 -mb-2"></Title>
                <CustomKBD :keybind="'f'" class="w-fit my-4" />
              </div>
            </div>
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 2">
          <div>
            <Title text="100m - How to play" class=""></Title>
            <CommandContainer
              name="RUN"
              :keys="['s', 'd']"
              class="w-fit my-4"
            />
            <Title text="Tips" class="mb-3"></Title>
            <Info
              :content="[
                'To go as fast as possible, alternate the keys without making a mistake, the wrong technique can slow you down...',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 3">
          <div>
            <Title text="100m Breaststroke - How to play"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['SPACE']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="SWIM"
                :keys="['s', 'd']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Tips" class="mb-3"></Title>
            <Info
              :content="[
                'Press SPACE to dive and turn around.',
                'To go as fast as possible, alternate the keys without making a mistake, the wrong technique can slow you down...',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 4">
          <div>
            <Title text="Diving - How to play"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['SPACE']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="FIGURES"
                width="260"
                :keys="['F', 'G', 'H', 'J']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Tips" class="mb-3"></Title>
            <Info
              :content="[
                'Press SPACE to dive.',
                'You have to memorise a sequence of letters, which will always be different, and then reproduce it within a given time (each letter corresponding to a figure).',
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 5">
          <div>
            <Title text="Archery - How to play"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['SPACE']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="AIM↔️"
                :keys="['H']"
                class="w-fit my-4"
              />
              <CommandContainer
                name="AIM↕️"
                :keys="['V']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Tips" class="mb-3"></Title>
            <Info
              :content="[
                'Press SPACE to start.',
                'You have 2 gauges that allow you to aim and shoot as close to the centre of the target as possible. To do this, press H to adjust the horizontal aim and then V to adjust the vertical aim.',
              ]"
            />
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 6">
          <div>
            <Title text="Boxing - How to play"></Title>
            <div class="flex gap-5">
              <CommandContainer
                name="ACTION"
                :keys="['MOUSE']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Tips" class="mb-3"></Title>
            <Info
              :content="[
                'To strike, click your mouse on the targets that will appear on the screen.',
              ]"
            />
          </div>
        </CarouselContent>
        <CarouselContent v-if="carousel === 7">
          <div>
            <Title text="Javelin - How to play"></Title>
            <div class="flex gap-5">
              <CommandContainer class="w-fit my-4" name="POWER" :keys="['s', 'd']" width="180"/>
              <CommandContainer
                name="ANGLE"
                :keys="['SPACE']"
                class="w-fit my-4"
              />
            </div>
            <Title text="Astuces" class="mb-3"></Title>
            <Info
              :content="[
                'Press SPACE to start.',
                'When the power bar appears, you will have 5 seconds to fill it by alternating between the S and D keys.',
                'Then, after setting the power, you\'ll need to adjust the angle by pressing SPACE (hold the button down to adjust the angle, then release).'
              ]"
            />
          </div>
        </CarouselContent>

        <CarouselContent v-if="carousel === 8">
          <div>
            <Title text="Tennis - How to play" class=""></Title>
            <CommandContainer
              name="MOVE"
              :keys="['↑', '↓']"
              class="w-fit my-4"
            />
            <Title text="Tips" class="mb-3"></Title>
            <Info
              :content="[
                'Move the keyboard arrows to move up and down.',
              ]"
            />
          </div>
        </CarouselContent>
      </div>

      <button
        :disabled="carousel === 8"
        @click="carousel++"
        class="disabled:opacity-30 ml-8 p-4 rounded-full backdrop-brightness-50 w-20"
      >
        <img :src="arrow" alt="right-arrow" class="w-12 h-8 rotate-180" />
      </button>
    </div>
  </div>
</template>

<style scoped></style>
