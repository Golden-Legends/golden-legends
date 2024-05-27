<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  place: {
    type: Number,
    required: true,
  },
});

// Computed property to determine the color based on the place
const placeColor = computed(() => {
  switch (props.place) {
    case 1:
      return "gold";
    case 2:
      return "silver";
    case 3:
      return "bronze";
    default:
      return "bg-black";
  }
});
</script>

<template>
  <div
    :class="placeColor"
    class="rounded-full h-9 w-9 flex items-center justify-center font-bold"
  >
    <span :class="placeColor !== 'bg-black' ? 'text-black' : 'text-white'">{{
      place
    }}</span>
  </div>
</template>

<style scoped>
.gold {
  background-color: gold;
}
.silver {
  background-color: silver;
}
.bronze {
  background-color: #cd7f32; /* Bronze color */
}
</style>
