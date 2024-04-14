<script setup lang="ts">
import { useRouter } from "vue-router";
import ClassicButton from "@/components/landing/ClassicButton.vue";
import ClassicInput from "@/components/landing/ClassicInput.vue";

import { Howl } from "howler";
import PlayButton from "@/components/characters/PlayButton.vue";
import { ref } from "vue";
import { UserService } from "@/services/user-service.ts";
import { toast } from "vue-sonner";

const musiqueAccueil = new Howl({
  src: ["./sounds/musiqueAccueilShort.m4a"],
  autoplay: true,
  loop: true,
  volume: 0.1, // Volume par défaut
});

const error = ref(false);

const stopMusicAndRedirect = async () => {
  try {
    await UserService.isUsernameValid(username.value);
    musiqueAccueil.stop();
    localStorage.setItem("username", username.value);
    await router.push({ name: "Character" });
  } catch (e) {
    error.value = true;
    toast.error("Ce nom d'utilisateur est déjà pris.");
  }
};

const username = ref("");

const router = useRouter();
</script>

<template>
  <div class="w-screen h-screen relative overflow-clip">
    <div class="w-full lg:w-1/2">
      <div class="flex flex-col items-center justify-center">
        <img class="mt-24" src="@/assets/landing_logo.svg" alt="Vue logo" />
        <div class="flex flex-col items-center gap-4 mt-16">
          <ClassicButton
            text="SE CONNECTER"
            @click="router.push({ name: 'Login' })"
          />
          <span class="text-2xl font-bold">OU</span>
          <ClassicInput
            :class="{ 'border-red-500 border-2': error }"
            placeholder="Ex : XxGamerdu12xX"
            @update-username="username = $event"
          />
          <PlayButton
            :disabled="username.length <= 0"
            @click="stopMusicAndRedirect"
          />
        </div>
      </div>
    </div>
    <div
      class="hidden h-screen w-1/2 bg-white absolute top-0 right-0 lg:block"
    ></div>

    <div class="hidden lg:block lg:w-1/2 bg-white">
      <div class="absolute -right-24 top-40">
        <img src="@/assets/landing.svg" alt="Vue logo" />
      </div>
    </div>
  </div>
</template>
