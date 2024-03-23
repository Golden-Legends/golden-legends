<script setup lang="ts">
import { useRouter } from "vue-router";
import ClassicButton from "@/components/landing/ClassicButton.vue";
import ClassicInput from "@/components/landing/ClassicInput.vue";

const router = useRouter();
</script>

<template>
  <div class="w-screen h-screen flex">
    <div class="w-full lg:w-1/2">
      <div class="flex flex-col items-center justify-center mt-24">
        <img src="@/assets/landing_logo.svg" alt="Vue logo" />
        <div class="flex flex-col items-center gap-4 mt-16">
          <ClassicButton
            text="SE CONNECTER"
            @click="router.push({ name: 'Login' })"
          />
          <span class="text-2xl font-bold">OU</span>
          <ClassicInput placeholder="Ex : XxGamerdu12xX" />
          <ClassicButton text="JOUER" @click="router.push({ name: 'Game' })" />
        </div>
      </div>
    </div>
    <div class="hidden lg:block lg:w-1/2 bg-white">
      <div class="absolute -right-24 top-32">
        <img src="@/assets/landing.svg" alt="Vue logo" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
