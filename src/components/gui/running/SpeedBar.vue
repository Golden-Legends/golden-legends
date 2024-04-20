<script setup lang="ts">
const props = defineProps({
    min: {
        type: Number,
        required: true,
    },
    max: {
        type: Number,
        required: true,
    },
  speed: {
    type: Number,
    required: true,
  },
});

const speedColor = (speed: number, min: number, max: number): string => {
    if (speed < min + (max - min) / 3) {
        return "bg-red-500";
    } else if (speed < min + (max - min) * (2 / 3)) {
        return "bg-yellow-500";
    } else {
        return "bg-green-500";
    }
};

const calculateProgress = (speed: number): string => {
  const percentage = ((speed - props.min) / (props.max - props.min)) * 100;
  return `width: ${percentage}%;`;
};
</script>

<template>
  <div class="w-80 h-12 border-2 border-black rounded-lg">
    <div class="h-full rounded" :class="speedColor(props.speed, props.min, props.max)" :style="calculateProgress(props.speed)">
    </div>
  </div>
</template>
