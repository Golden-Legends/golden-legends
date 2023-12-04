<template>
  <Transition>
    <div class="absolute top-1/3 left-1/2 bg-white p-12 -translate-x-1/2 transition-opacity" v-if="isMenuVisible">
      <h1 class="text-4xl">Options</h1>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue';
import {Ref} from "vue";

const isMenuVisible : Ref<Boolean> = ref(false);

// Toggle menu on O key (default)
const toggleMenu = (event = { code: 'KeyO' }) => {
  if (event.code === 'KeyO') {
    isMenuVisible.value = !isMenuVisible.value;
  }
};

const onKeydown = (event) => {
  toggleMenu(event);
};

onMounted(() => {
  window.addEventListener('keydown', onKeydown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});

</script>

<style scoped>
.v-enter, .v-leave-to {
  opacity: 0;
}

.v-enter-active, .v-leave-active {
  transition: opacity 0.3s ease;
}
</style>
