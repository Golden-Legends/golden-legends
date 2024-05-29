<script setup lang="ts">
import FoundObject from "@/components/gui/foundobjects/FoundObject.vue";
import { PropType } from "vue";
export interface TBF_OBJECT {
  name: string;
  path: string;
  found: boolean;
}
const props = defineProps({
  objects: {
    type: Array as PropType<TBF_OBJECT[]>,
    required: true,
  },
});
</script>

<template>
  <div
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[600px]"
  >
    <button
      id="close-objects"
      class="absolute -right-3 -top-3 w-10 h-10 border-2 rounded border-black bg-red-700 hover:bg-red-800 transition-all"
    >
      <img
        src="../../../../public/close.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>
    <button
      id="back-options3"
      class="absolute -left-3 -top-3 w-10 h-10 border-2 rounded border-black bg-green-700 hover:bg-green-800 transition-all"
    >
      <img
        src="../../../../public/back.svg"
        alt="close"
        class="w-6 h-6 ml-1.5"
      />
    </button>
    <div class="flex flex-col gap-4 mt-4 mb-4">
      <FoundObject v-for="object in props.objects" :object="object" />
    </div>
  </div>
</template>

<style scoped></style>
