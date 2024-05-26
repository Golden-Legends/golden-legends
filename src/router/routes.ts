import { createRouter, createWebHashHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import BabylonPage from "../pages/BabylonPage.vue";
import SandboxPage from "../pages/SandboxPage.vue";
import CharacterSelectionPage from "@/pages/CharacterSelectionPage.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: LandingPage,
  },
  {
    path: "/character",
    name: "Character",
    component: CharacterSelectionPage,
  },
  {
    path: "/game",
    name: "Game",
    component: BabylonPage,
  },
  {
    path: "/sandbox",
    name: "Sandbox",
    component: SandboxPage,
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHashHistory("/golden-legends/ "),
  routes: routes,
});

export default router;
