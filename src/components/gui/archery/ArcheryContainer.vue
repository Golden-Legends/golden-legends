<script setup lang="ts">
import HorizontalColorBar from "@/components/gui/archery/HorizontalColorBar.vue";
import VerticalColorBar from "@/components/gui/archery/VerticalColorBar.vue";
import HorizontalMovingArrow from "@/components/gui/archery/HorizontalMovingArrow.vue";
import VerticalMovingArrow from "@/components/gui/archery/VerticalMovingArrow.vue";
import { computed, ref, watch } from "vue";
import { storeTirArc } from "@/components/gui/storeTirArc.ts";

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
const positionH = ref(storeTirArc.state.initialState.positionH);
const positionV = ref(storeTirArc.state.initialState.positionV);
const increasing = ref(storeTirArc.state.initialState.increasing);
const horizontalPlaying = ref(storeTirArc.state.initialState.horizontalPlaying);
const verticalPlaying = ref(storeTirArc.state.initialState.verticalPlaying);

const arrowMarginLeft = computed(() => {
  if (horizontalPlaying.value) {
    return 2 + (positionH.value * 70) / 100;
  } else {
    return positionH.value;
  }
});

const arrowMarginTop = computed(() => {
  if (verticalPlaying.value) {
    return 2 + (positionV.value * 70) / 100;
  } else {
    return positionV.value;
  }
});

const emit = defineEmits(["update-position"]);

const updatePosition = () => {
  if (horizontalPlaying.value) {
    if (increasing.value) {
      positionH.value += 1;
    } else {
      positionH.value -= 1;
    }
    if (positionH.value === 24) {
      increasing.value = false;
    } else if (positionH.value === -4) {
      increasing.value = true;
    }
  }
  if (verticalPlaying.value) {
    if (increasing.value) {
      positionV.value += 1;
    } else {
      positionV.value -= 1;
    }
    if (positionV.value === 24) {
      increasing.value = false;
    } else if (positionV.value === -4) {
      increasing.value = true;
    }
  }
};

// Listen to H key to stop the horizontal arrow
window.addEventListener("keydown", (e) => {
  if (e.key === "h") {
    horizontalPlaying.value = !horizontalPlaying.value;
    emit("update-position", positionH.value);
    verticalPlaying.value = !verticalPlaying.value;
  }
});

// Listen to V key to stop the vertical arrow
window.addEventListener("keydown", (e) => {
  if (e.key === "v") {
    verticalPlaying.value = !verticalPlaying.value;
    emit("update-position", positionV.value);
  }
});

const interval = setInterval(updatePosition, props.ms);
//when prop.ms update, clear interval and set new interval
watch(
  () => props.ms,
  () => {
    clearInterval(interval);
    setInterval(updatePosition, props.ms);
  },
);

// Watch for the initial state to update the position
watch(
  () => storeTirArc.state.initialState,
  () => {
    positionH.value = storeTirArc.state.initialState.positionH;
    positionV.value = storeTirArc.state.initialState.positionV;
    increasing.value = storeTirArc.state.initialState.increasing;
    horizontalPlaying.value = storeTirArc.state.initialState.horizontalPlaying;
    verticalPlaying.value = storeTirArc.state.initialState.verticalPlaying;
  },
  { deep: true },
);
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
