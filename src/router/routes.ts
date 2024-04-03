import { createRouter, createWebHashHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import BabylonPage from "../pages/BabylonPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import SandboxPage from "../pages/SandboxPage.vue";

const routes = [
  {
    path: "/",
    name: "Landing",
    component: LandingPage,
  },
  {
    path: "/game",
    name: "Game",
    component: BabylonPage,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
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
  history: createWebHashHistory("/"),
  routes: routes,
});

export default router;
