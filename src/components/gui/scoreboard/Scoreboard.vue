<script setup lang="ts">
import {
  CollectionDataMap,
  isTimeBasedCollection,
  Collection,
  isScoreBasedCollection,
  Archery,
  Boxing,
  Diving,
  Javelin,
  Tennis,
  Jump,
  Running,
  Swimming,
} from "@/services/result-service.ts";
import { computed } from "vue";
import MiniMedal from "@/components/gui/scoreboard/MiniMedal.vue";

// Define the props
const props = defineProps<{
  result: CollectionDataMap[keyof CollectionDataMap][];
  title: Collection;
}>();

// Type Guard Functions
function isTimeBased(
  result: CollectionDataMap[keyof CollectionDataMap],
): result is Jump | Running | Swimming {
  return (result as Jump | Running | Swimming).time !== undefined;
}

// Computed property to sort the results
const sortedResults = computed(() => {
  if (isTimeBasedCollection(props.title)) {
    return [...props.result].sort((a, b) => {
      const aTime = (a as Jump | Running | Swimming).time;
      const bTime = (b as Jump | Running | Swimming).time;
      return aTime - bTime;
    });
  } else if (isScoreBasedCollection(props.title)) {
    return [...props.result].sort((a, b) => {
      const aScore = (a as Archery | Boxing | Diving | Javelin | Tennis).score;
      const bScore = (b as Archery | Boxing | Diving | Javelin | Tennis).score;
      return bScore - aScore;
    });
  } else {
    return props.result;
  }
});

const collectionToFrenchName = (collection: Collection) => {
  switch (collection) {
    case "archery":
      return "🏹 Archery";
    case "running":
      return "👟 100m";
    case "swimming":
      return "🏊 100m breaststroke";
    case "boxing":
      return "🥊 Boxing";
    case "diving":
      return "🏅 Diving";
    case "javelin":
      return "💪 Javelin";
    case "tennis":
      return "🎾 Tennis";
    case "jump":
      return "🐇 Jump game";
    default:
      return "Inconnu";
  }
};
</script>

<template>
  <div class="w-[450px]">
    <h2 class="text-3xl font-bold mb-4">
      {{ collectionToFrenchName(props.title) }}
    </h2>
    <div class="flex flex-col gap-2 mt-4">
      <div
        class="flex flex-col text-2xl gap-2"
        v-for="(result, i) in sortedResults"
        :key="i"
      >
        <div class="flex justify-between">
          <div class="flex gap-2">
            <MiniMedal :place="i + 1" />
            <div class="max-w-[280px] truncate">{{ result.username }}</div>
          </div>
          <div>
            {{
              isTimeBased(result)
                ? (result.time / 1000).toFixed(3) + "s"
                : result.score
            }}
          </div>
        </div>
        <div
          class="w-full h-1 bg-white rounded-full"
          v-if="i !== sortedResults.length - 1"
        ></div>
      </div>
    </div>
  </div>
</template>
