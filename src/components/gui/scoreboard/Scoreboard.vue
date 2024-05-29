<script setup lang="ts">
import {
  CollectionDataMap,
  isTimeBasedCollection,
  Collection,
  isScoreBasedCollection,
} from "@/services/result-service.ts";
import { computed } from "vue";
import MiniMedal from "@/components/gui/scoreboard/MiniMedal.vue";

// Define the props
const props = defineProps<{
  result: CollectionDataMap[keyof CollectionDataMap][];
  title: Collection;
}>();

// Computed property to sort the results
const sortedResults = computed(() => {
  if (isTimeBasedCollection(props.title)) {
    // Sort by time in ascending order
    return [...props.result].sort((a, b) => {
      const aTime = (
        a as
          | CollectionDataMap["jump"]
          | CollectionDataMap["running"]
          | CollectionDataMap["swimming"]
      ).time;
      const bTime = (
        b as
          | CollectionDataMap["jump"]
          | CollectionDataMap["running"]
          | CollectionDataMap["swimming"]
      ).time;
      return aTime - bTime;
    });
  } else if (isScoreBasedCollection(props.title)) {
    // Sort by score in descending order
    return [...props.result].sort((a, b) => {
      const aScore = (
        a as
          | CollectionDataMap["archery"]
          | CollectionDataMap["boxing"]
          | CollectionDataMap["diving"]
          | CollectionDataMap["javelin"]
      ).score;
      const bScore = (
        b as
          | CollectionDataMap["archery"]
          | CollectionDataMap["boxing"]
          | CollectionDataMap["diving"]
          | CollectionDataMap["javelin"]
      ).score;
      return bScore - aScore;
    });
  } else {
    // Return unsorted if title is not recognized
    return props.result;
  }
});

const collectionToFrenchName = (collection: Collection) => {
  switch (collection) {
    case "archery":
      return "🏹 Tir à l'arc";
    case "running":
      return "👟 100m";
    case "swimming":
      return "🏊 100m brasse";
    case "boxing":
      return "🥊 Boxe";
    case "diving":
      return "🏅 Plongeon";
    case "javelin":
      return "💪 Lancer de javelot";
    case "jump":
      return "🐇 Épreuve de saut";
    default:
      return "Inconnu";
  }
};
</script>

<template>
  <div class="w-[340px]">
    <h2 class="text-3xl font-bold my-4">
      {{ collectionToFrenchName(props.title) }}
    </h2>
    <div class="flex flex-col gap-2">
      <div
        class="flex flex-col text-2xl gap-2"
        v-for="(result, i) in sortedResults"
        :key="i"
      >
        <div class="flex justify-between">
          <div class="flex gap-2">
            <MiniMedal :place="i + 1" />
            <div class="max-w-[160px] truncate">{{ result.username }}</div>
          </div>
          <div>
            {{
              isTimeBasedCollection(props.title)
                ? (
                    (
                      result as
                        | CollectionDataMap["jump"]
                        | CollectionDataMap["running"]
                        | CollectionDataMap["swimming"]
                    ).time / 1000
                  ).toFixed(3) + "s"
                : (
                    result as
                      | CollectionDataMap["archery"]
                      | CollectionDataMap["boxing"]
                      | CollectionDataMap["diving"]
                      | CollectionDataMap["javelin"]
                  ).score
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

<style scoped>
.gold {
  color: gold;
}
.silver {
  color: silver;
}
.bronze {
  color: #cd7f32; /* Bronze color */
}
</style>
