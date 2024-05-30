<script setup lang="ts">
import HorizontalColorBar from "@/components/gui/archery/HorizontalColorBar.vue";
import VerticalColorBar from "@/components/gui/archery/VerticalColorBar.vue";
import HorizontalMovingArrow from "@/components/gui/archery/HorizontalMovingArrow.vue";
import VerticalMovingArrow from "@/components/gui/archery/VerticalMovingArrow.vue";
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from "vue";
import { storeTirArc } from "@/components/gui/storeTirArc.ts";
import { storeBoxe } from "@/components/gui/storeBoxe.ts";

const props = defineProps({
  orientation: {
    type: String,
    required: true,
  },
});

// GOES TO -4 TO 24
const positionH = ref(storeTirArc.state.initialState.positionH);
const positionV = ref(storeTirArc.state.initialState.positionV);
const increasing = ref(storeTirArc.state.initialState.increasing);
const horizontalPlaying = ref(storeTirArc.state.initialState.horizontalPlaying);
const verticalPlaying = ref(storeTirArc.state.initialState.verticalPlaying);
const isGameActive = ref(storeTirArc.state.initialState.isGameActive);

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
  if (e.key === "h" && !verticalPlaying.value && isGameActive.value) {
    horizontalPlaying.value = !horizontalPlaying.value;
    emit("update-position", positionH.value);
    verticalPlaying.value = !verticalPlaying.value;
  }
});

// Listen to V key to stop the vertical arrow
window.addEventListener("keydown", (e) => {
  if (e.key === "v" && !horizontalPlaying.value && isGameActive.value) {
    verticalPlaying.value = !verticalPlaying.value;
    emit("update-position", positionV.value);
  }
});
let intervalIdX: NodeJS.Timeout;
let intervalIdY: NodeJS.Timeout;

// SPEED OF CURSOR
const SPEED = ref(storeTirArc.state.speed);
// Watch for the speed from the store to reset and update the speed from the cursor
watch(
  () => storeTirArc.state.speed,
  (newVal) => {
    SPEED.value = newVal;
    clearInterval(intervalIdX);
    clearInterval(intervalIdY);
  },
);

// When game is active, start the updatePosition function
watchEffect(() => {
  if (isGameActive.value) {
    intervalIdX = setInterval(updatePosition, SPEED.value);
    intervalIdY = setInterval(updatePosition, SPEED.value);
  }
});

// Watch for the initial state + isGameActive to update the position
watch(
  () => storeTirArc.state.initialState,
  () => {
    positionH.value = storeTirArc.state.initialState.positionH;
    positionV.value = storeTirArc.state.initialState.positionV;
    increasing.value = storeTirArc.state.initialState.increasing;
    horizontalPlaying.value = storeTirArc.state.initialState.horizontalPlaying;
    verticalPlaying.value = storeTirArc.state.initialState.verticalPlaying;
    isGameActive.value = storeTirArc.state.initialState.isGameActive;
    clearInterval(intervalIdX);
    clearInterval(intervalIdY);
  },
  { deep: true },
);

onMounted(() => {
  // resetInterval();
  // startTimer();
});

onUnmounted(() => {
  clearInterval(intervalIdX);
  clearInterval(intervalIdY);
});
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
