<script setup lang="ts">
import { computed, defineProps, ref } from "vue";
import Scoreboard from "@/components/gui/scoreboard/Scoreboard.vue";
import { Collection, fetchResults } from "@/services/result-service.ts";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
});

const results = ref<{ [key: string]: any[] }>({});

const frenchToEnglish = () => {
  switch (props.title) {
    case "100m":
      return "running";
    case "100m Brasse":
      return "swimming";
    case "Boxe":
      return "boxing";
    case "Plongeon":
      return "diving";
    case "Tir à l'arc":
      return "archery";
    case "Javelot":
      return "javelin";
    case "Tennis":
      return "tennis";
    case "Saut en longueur":
      return "jump";
  }
  return "Unknown";
};

const fetch = async () => {
  const res = await fetchResults(frenchToEnglish() as Collection);
  results.value[props.title as Collection] = res;
};

// Fetch initial results
fetch();

const result = computed(() => results.value[props.title as Collection]);
</script>

<template>
  <div class="flex relative">
    <div
      class="border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white p-4 rounded-lg h-fit w-80"
    >
      <div class="pb-4">
        <h1 class="text-3xl font-bold">{{ props.title }}</h1>
      </div>
      <div class="w-full flex gap-8">
        <div class="flex flex-col items-center gap-4 w-full">
          <span class="text-xl" v-if="props.title === '100m'">Solo</span>
          <slot />
        </div>
        <div
          v-if="props.title === '100m'"
          class="flex flex-col items-center gap-4 w-1/3"
        >
          <span class="text-xl">Duel</span>
          <slot name="duel" />
        </div>
      </div>
    </div>
    <div
      class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white p-4 rounded-lg h-fit w-[500px] ml-4 -mt-48"
    >
      <button
        class="absolute top-3.5 right-4 w-10 h-10 bg-blue-darker rounded-lg hover:bg-blue-darker/80 transition-all"
        @click="fetch"
      >
        <img
          src="@/../public/refresh.svg"
          alt="refresh"
          class="w-8 h-8 pl-1.5"
        />
      </button>
      <Scoreboard
        v-if="result"
        :title="frenchToEnglish() as Collection"
        :result="result"
      ></Scoreboard>
    </div>
  </div>
</template>
