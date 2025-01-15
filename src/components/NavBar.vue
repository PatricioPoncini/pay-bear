<script lang="ts" setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth.store.ts";

const router = useRouter();
const authStore = useAuthStore();

const handleLogout = async () => {
  await authStore.logout();
  await router.push("/login");
};
</script>

<template>
  <nav class="bg-gray-900 border-gray-200">
    <div class="max-w-screen pl-10 pr-10 flex items-center justify-between mx-auto p-4">
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img class="w-11 h-10" src="/pay_bear_logo.png" alt="Pay Bear Logo" />
        <span class="self-center text-2xl font-semibold whitespace-nowrap text-white">
          Pay Bear
        </span>
      </a>

      <div>
        <a @click="handleLogout" class="btn btn-ghost text-gray-100 cursor-pointer">
          <svg
              fill="none"
              height="30"
              viewBox="0 0 24 24"
              width="30"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M17 16L21 12M21 12L17 8M21 12L7 12M13 16V17C13 18.6569 11.6569 20 10 20H6C4.34315 20 3 18.6569 3 17V7C3 5.34315 4.34315 4 6 4H10C11.6569 4 13 5.34315 13 7V8"
                stroke="#ffffff"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
            />
          </svg>
        </a>
      </div>
    </div>
  </nav>
</template>
