<template>
  <div class="flex flex-col justify-end">
    <span class="text-end text-2xl">{{ angle.toFixed(1) }}°</span>
    <div>
      <svg width="300" height="300" viewBox="0 0 300 300" class="p-4">
        <defs>
          <linearGradient
            id="angleGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" style="stop-color: red; stop-opacity: 1" />
            <stop offset="25%" style="stop-color: orange; stop-opacity: 1" />
            <stop offset="50%" style="stop-color: green; stop-opacity: 1" />
            <stop offset="75%" style="stop-color: orange; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: red; stop-opacity: 1" />
          </linearGradient>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="8"
            refX="0"
            refY="3"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,1 L0,5 L3,3 z" fill="black" />
          </marker>
        </defs>
        <path
          d="M 150 0
             A 150 150 0 0 1 300 150
             L 150 150 Z"
          fill="url(#angleGradient)"
        />
        <line
          x1="150"
          y1="150"
          :x2="150 + 100 * Math.cos((angle * Math.PI) / 180)"
          :y2="150 - 100 * Math.sin((angle * Math.PI) / 180)"
          stroke="black"
          stroke-width="8"
          marker-end="url(#arrowhead)"
        />
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from "vue";
import { storeJavelot } from "@/components/gui/storeJavelot.ts";

const angle = ref(storeJavelot.state.angle);
const isAnimating = ref(false);
const SPEED = ref(storeJavelot.state.angleSpeed); // Adjust this value to change the speed (higher = faster)
let direction = 1;
let animationFrame: number | null = null;
let lastTimestamp = 0;

watch(
  () => storeJavelot.state.angleSpeed,
  (newSpeed) => {
    SPEED.value = newSpeed;
  },
);

const startAnimation = () => {
  if (!isAnimating.value) {
    isAnimating.value = true;
    lastTimestamp = performance.now();
    animate(lastTimestamp);
  }
};

const stopAnimation = () => {
  isAnimating.value = false;
  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
};

const animate = (timestamp: number) => {
  if (isAnimating.value) {
    const elapsed = timestamp - lastTimestamp;

    // Update based on the speed (SPEED determines how many degrees per second)
    const angleChange = (elapsed / 1000) * 90 * SPEED.value;
    angle.value += direction * angleChange;

    if (angle.value >= 90) {
      angle.value = 90;
      direction = -1;
    } else if (angle.value <= 0) {
      angle.value = 0;
      direction = 1;
    }

    lastTimestamp = timestamp;
    animationFrame = requestAnimationFrame(animate);
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.code === "Space" && storeJavelot.state.playable) {
    startAnimation();
  }
};

const handleKeyup = (event: KeyboardEvent) => {
  if (event.code === "Space") {
    storeJavelot.commit("setAngle", angle.value);
    storeJavelot.commit("setPlayable", false);

    stopAnimation();
  }
};

watch(
  () => storeJavelot.state.angle,
  (newAngle) => {
    angle.value = newAngle;
  },
);

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("keyup", handleKeyup);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("keyup", handleKeyup);
  stopAnimation();
});
</script>

<style scoped></style>
