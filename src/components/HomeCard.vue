<script setup lang="ts">
import { redirectTo } from "../utils/route.ts";
import {useRouter} from "vue-router";

const { title, description, routeTo, buttonText, textColor } = defineProps<{
  title: string;
  description: string;
  routeTo: string;
  buttonText: string;
  textColor: string;
}>();

const router = useRouter();
</script>

<template>
  <div class="flex flex-col bg-[#1e2329] p-6 w-full rounded-lg shadow-lg">
    <p class="text-2xl font-semibold" :style="{ color: textColor }">{{ title }}</p>
    <p class="text-md text-[#95999e] mt-2">{{ description }}</p>
    <button
        @click="redirectTo(router, routeTo)"
        class="mt-6 p-3 rounded-xl text-black transition-transform transform hover:scale-105 font-semibold"
        :style="{ backgroundColor: textColor }"
    >
      {{ buttonText }}
    </button>
  </div>
</template>
