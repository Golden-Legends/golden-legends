<script setup lang="ts">
import { PropType } from "vue";
import { Result } from "@/components/gui/results/ResultsContent.vue";

const props = defineProps({
  result: Object as PropType<Result>,
});
</script>

<template>
  <div class="flex justify-between font-bold text-2xl" v-if="props.result">
    <div class="">
      <span> {{ props.result.place }}) </span>
      <span>
        {{ props.result.name }}
      </span>
    </div>
    <div>
      {{ props.result.result }}
    </div>
  </div>
</template>

<style scoped></style>
