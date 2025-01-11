import { createWebHistory, createRouter } from 'vue-router'
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";
import {guards} from "./routeGuards.ts";
import BuyCrypto from "../pages/BuyCrypto.vue";
import UserHistory from "../pages/UserHistory.vue";
import SellCrypto from "../pages/SellCrypto.vue";
import InvestmentAnalysis from "../pages/InvestmentAnalysis.vue";

const routes = [
    { path: '/login', component: Login },
    { path: '/', component: Home, beforeEnter: [guards.checkIfLoggedIn], },
    { path: '/buy', component: BuyCrypto, beforeEnter: [guards.checkIfLoggedIn], },
    { path: '/sell', component: SellCrypto, beforeEnter: [guards.checkIfLoggedIn], },
    { path: '/analysis', component: InvestmentAnalysis, beforeEnter: [guards.checkIfLoggedIn], },
    { path: '/transaction-history', component: UserHistory, beforeEnter: [guards.checkIfLoggedIn], },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});