<script setup lang="ts">
import { useRouter } from "vue-router";
import ClassicButton from "@/components/landing/ClassicButton.vue";
import ClassicInput from "@/components/landing/ClassicInput.vue";
import PlayButton from "@/components/characters/PlayButton.vue";
import { ref, onMounted, onBeforeUnmount } from "vue";
import { UserService } from "@/services/user-service.ts";
import { toast } from "vue-sonner";
import { Music } from "@/utils/Music.ts";

const music = Music.getInstance("./sounds/newAccueil.mp3", 0.1);
const error = ref(false);
const username = ref("");
const router = useRouter();

const play = async () => {
  try {
    localStorage.setItem("username", username.value);
    await router.push({ name: "Character" });
  } catch (e) {
    error.value = true;
    toast.error("Ce nom d'utilisateur est déjà pris.");
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === "Enter" && username.value.length > 0) {
    play();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeyDown);
});
</script>

<template>
  <div class="w-screen h-screen relative overflow-clip">
    <div class="w-full lg:w-1/2">
      <div class="flex flex-col items-center justify-center">
        <img class="mt-24" src="@/../public/landing_logo.svg" alt="Vue logo" />
        <div class="flex flex-col items-center gap-4 mt-16">
          <ClassicInput
            :class="{ 'border-red-500 border-2': error }"
            placeholder="XxGamerdu31xX"
            @update-username="username = $event"
          />
          <PlayButton :disabled="username.length <= 0" @click="play" />
        </div>
      </div>
    </div>
    <div
      class="hidden h-screen w-1/2 bg-white absolute top-0 right-0 lg:block"
    ></div>
    <div class="hidden lg:block lg:w-1/2 bg-white">
      <div class="absolute -right-24 top-40">
        <img src="../../public/landing.svg" alt="Vue logo" />
      </div>
    </div>
  </div>
</template>
