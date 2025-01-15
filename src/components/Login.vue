<script setup lang="ts">
import { ref } from "vue";
import { MD5 } from "crypto-js";
import { useAuthStore } from "../stores/auth.store.ts";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";

const userName = ref<string>("");
const authStore = useAuthStore();
const router = useRouter();

const login = (event: Event) => {
  event.preventDefault();
  if (!userName.value) return toast.error("Username must be valid");

  const uniqueUserId = MD5(userName.value).toString();
  authStore.login(uniqueUserId);
  router.push("/");
};
</script>

<template>
  <div class="flex items-center justify-center bg-gray-900">
    <div class="w-full max-w-lg p-10 bg-gray-800 rounded-lg shadow-lg">
      <div class="flex flex-col items-center mb-8">
        <img class="w-auto h-24" src="/pay_bear_logo.png" alt="Pay Bear Logo" />
        <h1 class="mt-4 text-4xl font-extrabold text-yellow-400">Welcome Back</h1>
        <p class="mt-2 text-lg text-gray-300">
          Access your Pay Bear account below
        </p>
      </div>

      <form>
        <div class="mb-6">
          <label
              for="username"
              class="block text-lg font-medium text-gray-300"
          >
            Username
          </label>
          <input
              placeholder="Enter your username"
              type="text"
              class="block w-full px-5 py-3 mt-2 text-gray-900 bg-white border rounded-lg focus:border-yellow-500 focus:ring-yellow-300 focus:outline-none focus:ring focus:ring-opacity-50 text-xl"
              v-model="userName"
          />
        </div>

        <div class="mt-8">
          <button
              @click.prevent="login"
              class="w-full px-6 py-3 text-lg font-semibold text-white bg-yellow-500 rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300 focus:ring-opacity-50 transition duration-300"
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
