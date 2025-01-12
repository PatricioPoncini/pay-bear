<script setup lang="ts">
import { RouterView } from "vue-router";
import NavBar from "./components/NavBar.vue";
</script>

<template>
  <div class="vue-app">
    <NavBar class="fixed top-0 w-full z-10" />
    <RouterView class="min-h-screen mt-[64px]" />
  </div>
</template>
