<script setup lang="ts">
import Login from '../components/Login.vue';
</script>

<template>
  <div class="flex justify-center items-center background-auth">
    <Login />
  </div>
</template>

<style scoped>
.background-auth {
  height: 100vh;
  background-color: #1e293b;
  background-image: radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px);
  background-size: 16px 16px;
}
</style>
