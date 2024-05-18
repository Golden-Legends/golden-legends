<script setup lang="ts">
import HorizontalColorBar from "@/components/gui/archery/HorizontalColorBar.vue";
import VerticalColorBar from "@/components/gui/archery/VerticalColorBar.vue";
import HorizontalMovingArrow from "@/components/gui/archery/HorizontalMovingArrow.vue";
import VerticalMovingArrow from "@/components/gui/archery/VerticalMovingArrow.vue";
import { computed, ref } from "vue";

const props = defineProps({
  orientation: {
    type: String,
    required: true,
  },
  ms: {
    type: Number,
    required: true,
  },
});

// GOES TO -4 TO 24
const position = ref(-4);
const increasing = ref(true);

const arrowMarginLeft = computed(() => {
  return 2 + (position.value * 70) / 100;
});

const arrowMarginTop = computed(() => {
  return 2 + (position.value * 70) / 100;
});

const emit = defineEmits(["update-position"]);

const updatePosition = () => {
  if (increasing.value) {
    position.value += 1;
  } else {
    position.value -= 1;
  }
  if (position.value === 24) {
    increasing.value = false;
  } else if (position.value === -4) {
    increasing.value = true;
  }
  // Emit event to parent component
  emit("update-position", position.value);
};

setInterval(updatePosition, props.ms);
</script>

<template>
  <div v-if="props.orientation === 'horizontal'">
    <HorizontalMovingArrow :style="{ marginLeft: `${arrowMarginLeft}rem` }" />
    <HorizontalColorBar />
  </div>
  <div v-if="props.orientation === 'vertical'" class="flex items-start gap-3">
    <VerticalMovingArrow
      class="-mt-4"
      :style="{ marginTop: `${arrowMarginTop}rem` }"
    />
    <VerticalColorBar />
  </div>
</template>

<style scoped></style>
