<script setup lang="ts">
import { ref } from "vue";
import ConnexionButton from "@/components/connexion/ConnexionButton.vue";
import { UserService } from "@/services/user-service.ts";
import { useRouter } from "vue-router";

const router = useRouter();
const toggle = ref("login");

const email = ref("");
const password = ref("");
const username = ref("");

const login = async () => {
  try {
    await UserService.login(username.value, password.value);
    await router.push({ name: "Game" });
  } catch (error) {}
};

const register = async () => {
  try {
    await UserService.register(username.value, email.value, password.value);
    await router.push({ name: "Game" });
  } catch (error) {}
};
</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center mt-20">
    <div
      class="flex items-center gap-1 border bg-white h-fit w-fit p-2 rounded-lg"
    >
      <button
        class="p-3 rounded transition-all duration-300"
        :class="toggle === 'login' ? 'bg-blue-lighter/50' : ''"
        @click="toggle = 'login'"
      >
        Connexion
      </button>
      <button
        class="p-3 rounded transition-all duration-300"
        :class="toggle === 'signup' ? 'bg-blue-lighter/50' : ''"
        @click="toggle = 'signup'"
      >
        Inscription
      </button>
    </div>

    <div
      v-if="toggle === 'login'"
      class="flex flex-col gap-4 mt-4 items-center"
    >
      <div class="flex flex-col">
        <label class="text-lg font-bold text-blue-darker"
          >Nom d'utilisateur</label
        >
        <input
          type="text"
          class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg font-bold w-72"
          placeholder="XxGamerdu12xX"
          v-model="username"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-lg font-bold text-blue-darker">Mot de passe</label>
        <input
          type="password"
          class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg font-bold w-72"
          placeholder="lebgdu12"
          @keyup.enter="login"
          v-model="password"
        />
      </div>
      <ConnexionButton @click="login()" text="Se connecter" />
    </div>
    <div
      v-if="toggle === 'signup'"
      class="flex flex-col gap-4 mt-4 items-center"
    >
      <div class="flex flex-col">
        <label class="text-lg font-bold text-blue-darker"
          >Nom d'utilisateur</label
        >
        <input
          type="text"
          class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg font-bold w-72"
          placeholder="XxGamerdu12xX"
          v-model="username"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-lg font-bold text-blue-darker">Email</label>
        <input
          type="email"
          class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg font-bold w-72"
          placeholder="lebgdu12@gmail.com"
          v-model="email"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-lg font-bold text-blue-darker">Mot de passe</label>
        <input
          type="password"
          class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg font-bold w-72"
          placeholder="lebgdu12"
          v-model="password"
          @keyup.enter="register"
        />
      </div>
      <ConnexionButton @click="register" text="S'inscrire" />
    </div>
  </div>
</template>

<style scoped></style>
