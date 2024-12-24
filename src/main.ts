import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {router} from "./routes/routes.ts";
import {createPinia} from "pinia";
import Vue3Toastify, { type ToastContainerOptions } from "vue3-toastify";
import 'vue3-toastify/dist/index.css';

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);
app.mount('#app');