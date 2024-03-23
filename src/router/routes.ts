import { createRouter, createWebHashHistory } from "vue-router";
import LandingPage from "../pages/LandingPage.vue";
import BabylonPage from "../pages/BabylonPage.vue";

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
        path: "/:catchAll(.*)",
        redirect: "/",
    },
];

const router = createRouter({
    history: createWebHashHistory("/"),
    routes: routes,
});

export default router;
