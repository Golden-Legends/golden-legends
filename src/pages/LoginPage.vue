<script setup lang="ts">
import { ref } from "vue";
import ConnexionButton from "@/components/connexion/ConnexionButton.vue";
import { UserService } from "@/services/user-service.ts";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

const router = useRouter();
const toggle = ref("login");

const password = ref("");
const password_confirm = ref("");
const username = ref("");

const checkPassword = () => {
  return password.value === password_confirm.value;
};

const login = async () => {
  try {
    await UserService.login(username.value, password.value);
    localStorage.setItem("username", username.value);
    await router.push({ name: "Character" });
  } catch (error) {
    toast.error("Impossible de se connecter. Veuillez réessayer.");
  }
};

const register = async () => {
  try {
    // Basic validation
    if (!username.value || !password.value) {
      throw new Error("Veuillez remplir tous les champs.");
    }

    // More specific validation
    if (!checkPassword()) {
      throw new Error("Les mots de passe ne correspondent pas.");
    }

    // Register user
    await UserService.register(username.value, password.value);
    localStorage.setItem("username", username.value);

    await router.push({ name: "Character" });
  } catch (error: any) {
    if (error.response && error.response.status === 409) {
      toast.error(
        "Ce nom d'utilisateur est déjà pris. Veuillez en choisir un autre.",
      );
    } else if (error.response && error.response.status === 400) {
      toast.error(
        "Le format du nom d'utilisateur ou du mot de passe est incorrect.",
      );
    } else {
      toast.error(
        "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.",
      );
    }
  }
};
</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="flex items-center gap-1 border bg-white h-fit w-fit p-2 rounded-lg mt-20"
    >
      <button
        class="p-3 rounded transition-all duration-300 font-bold"
        :class="toggle === 'login' ? 'bg-blue-lighter/50' : ''"
        @click="toggle = 'login'"
      >
        Connexion
      </button>
      <button
        class="p-3 rounded transition-all duration-300 font-bold"
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
        <label class="text-lg font-bold text-blue-darker">Mot de passe</label>
        <input
          type="password"
          class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg font-bold w-72"
          placeholder="lebgdu12"
          v-model="password"
        />
      </div>
      <div class="flex flex-col">
        <label class="text-lg font-bold text-blue-darker"
          >Confirmer le mot de passe</label
        >
        <input
          type="password"
          class="py-2 px-4 border-2 border-blue-darker bg-blue-lighter rounded-lg font-bold w-72"
          placeholder="lebgdu12"
          v-model="password_confirm"
          @keyup.enter="register"
        />
      </div>
      <ConnexionButton @click="register" text="S'inscrire" />
    </div>
  </div>
</template>

<style scoped></style>
