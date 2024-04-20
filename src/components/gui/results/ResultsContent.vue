<script setup lang="ts">
import { store } from "@/components/gui/store.ts";
import ResultsRow from "@/components/gui/results/ResultsRow.vue";

export interface Result {
  place: number;
  name: string;
  result: string;
}

</script>

<template>
  <div v-if="store.state.results" class="flex flex-col gap-4">
    <ResultsRow
      v-for="result in store.state.results"
      :key="result.place"
      :result="result"
    />
  </div>
</template>

<style scoped></style>
