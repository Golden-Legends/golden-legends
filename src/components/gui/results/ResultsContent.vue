<script setup lang="ts">
import { PropType } from "vue";
import ResultsRow from "@/components/gui/results/ResultsRow.vue";
export interface Result {
  place: number;
  name: string;
  result: string;
}
const props = defineProps({
  results: Array as PropType<Result[]>,
});
</script>

<template>
  <div v-if="props.results" class="flex flex-col gap-4">
    <ResultsRow
      v-for="result in props.results"
      :key="result.place"
      :result="result"
    />
  </div>
</template>

<style scoped></style>
