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
    <div class="flex flex-col gap-4 mt-4 mb-4">
      <FoundObject v-for="object in props.objects" :object="object" />
    </div>
  </div>
</template>

<style scoped></style>
