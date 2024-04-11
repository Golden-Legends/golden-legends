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
    class="relative border-4 border-black bg-gradient-to-b from-begin-blue-gradient to-end-blue-gradient text-white items-center p-2 px-4 rounded-lg h-fit w-[800px]"
  >
    <div
      class="absolute -right-6 text-4xl font-bold w-12 h-12 rounded-lg border-4 border-black bg-gradient-to-b from-begin-red-gradient to-end-red-gradient text-white"
    >
      <button
        class="flex items-center justify-center h-full w-full p-2 transition-all hover:bg-red-800"
      >
        <img
          class="w-full h-full"
          src="../../../assets/close.svg"
          alt="close"
        />
      </button>
    </div>
    <div class="w-full mt-1">
      <div class="uppercase text-3xl font-black text-stroke">
        Objets à trouver
      </div>
    </div>

    <div class="flex flex-col gap-4 mt-8 mb-4">
      <FoundObject v-for="object in props.objects" :object="object" />
    </div>
  </div>
</template>

<style scoped></style>
