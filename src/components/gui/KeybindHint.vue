<script setup lang="ts">
import CustomKBD from './commands/CustomKBD.vue';
import { onMounted, onUnmounted, ref } from 'vue';

const props = defineProps<{
    keybind: string;
    name: string;
    eventKey?: string;
}>();

const isPressed = ref(false);

// When Key is pressed, bg should be darker
const keyPressed = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (props.eventKey && key === props.eventKey) {        
        isPressed.value = true;
    }
};

// When Key is released, bg should be lighter
const keyReleased = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (props.eventKey && key === props.eventKey) {
        isPressed.value = false;
    }
};

// Add listeners on mounted
onMounted(() => {
    window.addEventListener('keydown', keyPressed);
    window.addEventListener('keyup', keyReleased);
});

// Remove listeners on unmounted
onUnmounted(() => {
    window.removeEventListener('keydown', keyPressed);
    window.removeEventListener('keyup', keyReleased);
});
</script>
<template>
    <div class="flex gap-2 items-center ">
        <CustomKBD :keybind="keybind" :class="{ 'opacity-100': isPressed, 'opacity-75': !isPressed }" />
        <span class="text-2xl font-bold">{{ name }}</span>
    </div>
</template>