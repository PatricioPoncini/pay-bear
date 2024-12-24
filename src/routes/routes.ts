import { createWebHistory, createRouter } from 'vue-router'
import Login from "../pages/Login.vue";
import Home from "../pages/Home.vue";

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});