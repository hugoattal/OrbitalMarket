import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Landing from "../views/Landing.vue";

const routes: Array<RouteRecordRaw> = [
    {
        name: "landing",
        component: Landing,
        meta: {
            title: "Orbital Market",
            guest: true
        },
        path: "/"
    },
    {
        name: "search",
        component: () => import(/* webpackChunkName: "search" */ "../views/Search.vue"),
        meta: {
            title: "Orbital Market Search",
            guest: true
        },
        path: "/search"
    },
    {
        name: "product",
        component: () => import(/* webpackChunkName: "product" */ "../views/Product.vue"),
        meta: {
            guest: true
        },
        path: "/product/:slug"
    },
    {
        name: "dashboard",
        component: () => import(/* webpackChunkName: "product" */ "../views/Dashboard.vue"),
        meta: {
            guest: true
        },
        path: "/dashboard"
    },
    {
        name: "notFound",
        component: () => import(/* webpackChunkName: "notFound" */ "../views/NotFound.vue"),
        meta: {
            title: "Orbital Market - Lost in space",
            guest: true
        },
        path: "/:pathMatch(.*)*"
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
