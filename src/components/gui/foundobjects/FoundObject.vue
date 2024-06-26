<script setup lang="ts">
import { PropType } from "vue";
import { TBF_OBJECT } from "@/components/gui/foundobjects/FoundObjectsContainer.vue";

const props = defineProps({
  object: {
    type: Object as PropType<TBF_OBJECT>,
    required: true,
  },
});

const getAsset = (name: string) => {
  return `@/../tbf_objects/${name}.png`;
};
</script>

<template>
  <div
    class="flex justify-between items-center"
    :class="{ 'opacity-30': !props.object.found }"
  >
    <div class="flex gap-3 items-center">
      <img
        :src="getAsset(props.object.path)"
        alt="object"
        class="w-12 rounded-xl aspect-square"
      />
      <div class="text-xl text-white font-black uppercase">
        {{ props.object.name }}
      </div>
    </div>

    <div class="text-xl text-white font-black uppercase">
      {{ props.object.found ? "Found" : "Not found" }}
    </div>
  </div>
</template>

<style scoped></style>
