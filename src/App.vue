<script setup lang="ts">
import {RouterView, useRoute} from "vue-router";
import NavBar from "./components/NavBar.vue";
import {computed} from "vue";

const route = useRoute();

const showNavBar = computed(() => route.path !== "/login");
</script>

<template>
  <div class="vue-app">
    <NavBar class="fixed top-0 w-full z-10" v-if="showNavBar" />
    <RouterView
        class="min-h-screen"
        :class="{'mt-[64px]': showNavBar}"
    />
  </div>
</template>
