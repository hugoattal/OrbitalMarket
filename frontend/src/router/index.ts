import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Landing from "../views/Landing.vue";

const routes: Array<RouteRecordRaw> = [
    {
        component: Landing,
        name: "landing",
        path: "/",
        meta: {
            guest: true,
            title: "Orbital Market"
        }
    },
    {
        component: () => import(/* webpackChunkName: "search" */ "../views/Search.vue"),
        name: "search",
        path: "/search",
        meta: {
            guest: true,
            title: "Orbital Market Search"
        }
    },
    {
        component: () => import(/* webpackChunkName: "product" */ "../views/Product.vue"),
        name: "product",
        path: "/product/:slug",
        meta: {
            guest: true
        }
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title || "Orbital Market";
    next();
});

export default router;
