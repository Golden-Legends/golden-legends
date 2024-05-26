<script setup lang="ts">
import {
  CollectionDataMap,
  isTimeBasedCollection,
  Collection,
  isScoreBasedCollection,
} from "@/services/result-service.ts";
import { computed } from "vue";

// Define the props
const props = defineProps<{
  result: CollectionDataMap[keyof CollectionDataMap][];
  title: Collection;
}>();

// Computed property to sort the results
const sortedResults = computed(() => {
  if (isTimeBasedCollection(props.title)) {
    // Sort by time in ascending order
    return [...props.result].sort((a, b) => (a as any).time - (b as any).time);
  } else if (isScoreBasedCollection(props.title)) {
    // Sort by score in descending order
    return [...props.result].sort(
      (a, b) => (b as any).score - (a as any).score,
    );
  } else {
    // Return unsorted if title is not recognized
    return props.result;
  }
});

const collectionToFrenchName = (collection: Collection) => {
  switch (collection) {
    case "archery":
      return "Tir à l'arc";
    case "running":
      return "100m";
    case "swimming":
      return "100m brasse";
    case "boxing":
      return "Boxe";
    case "diving":
      return "Plongeon";
    case "javelin":
      return "Lancer de javelot";
    case "jump":
      return "Épreuve de saut";
    default:
      return "Inconnu";
  }
};
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold">
      {{ collectionToFrenchName(props.title) }}
    </h2>
    <div class="flex flex-col gap-1">
      <div
        class="flex justify-between"
        v-for="(result, i) in sortedResults"
        :key="i"
      >
        <div>{{ result.username }}</div>
        <div>
          {{ isTimeBasedCollection(props.title) ? result.time : result.score }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
