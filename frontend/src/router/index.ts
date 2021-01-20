import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Landing from "../views/Landing.vue";

const routes: Array<RouteRecordRaw> = [
    {
        component: Landing,
        name: "landing",
        path: "/",
        meta: {
            guest: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;
