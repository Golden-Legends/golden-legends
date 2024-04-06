<script setup lang="ts">
const props = defineProps({
  position: String,
});

// Depending on position, choose a color. Gold for 1, silver for 2, bronze for 3, and black for the rest.

const medalColor = (position: string): string => {
  switch (position) {
    case "1":
      return "bg-yellow-400";
    case "2":
      return "bg-gray-300";
    case "3":
      return "bg-yellow-800";
    default:
      return "bg-black";
  }
};
</script>

<template>
  <div
    v-if="props.position"
    class="w-32 h-32 rounded-full border-neutral-800 border-[16px]"
    :class="medalColor(props.position)"
  >
    <div class="text-[104pt] text-white font-bold h-fit">
      <span class="relative text-stroke-6 -top-20 left-1">
        {{ props.position }}
      </span>
    </div>
  </div>
</template>

<style scoped></style>
