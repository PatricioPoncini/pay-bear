import { createWebHistory, createRouter } from 'vue-router'
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import {guards} from "./routeGuards.ts";
import BuyCrypto from "../pages/BuyCrypto.vue";

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Home, beforeEnter: [guards.checkIfLoggedIn], },
    { path: '/buy', component: BuyCrypto, beforeEnter: [guards.checkIfLoggedIn], },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});