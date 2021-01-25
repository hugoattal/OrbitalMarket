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
    },
    {
        component: () => import(/* webpackChunkName: "search" */ "../views/Search.vue"),
        name: "search",
        path: "/search",
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
