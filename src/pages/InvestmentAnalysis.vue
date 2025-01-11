<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useUserStore} from "../stores/user.store.ts";

const totalAmountsByCode = ref<Record<string, number>>({});

onMounted(async () => {
  const userId = localStorage.getItem("userId") || ""; // TODO: Obtener o fallar
  const userStore = useUserStore();
  await userStore.getCryptoCurrencyAmounts(userId);
  totalAmountsByCode.value = userStore.totalCryptoCurrencyAmounts;
});
</script>

<template>
  <div class="h-screen flex justify-center items-center w-full px-4">
    <div class="w-full max-w-md bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
      <h1 class="text-3xl font-bold text-yellow-500 mb-4 text-center">Your Cryptocurrency Totals</h1>

      <ul class="space-y-4">
        <li v-if="totalAmountsByCode.BTC" class="flex justify-between items-center">
          <span class="text-gray-200 text-lg">Bitcoin (BTC):</span>
          <span class="text-yellow-500 font-semibold text-lg">{{ totalAmountsByCode.BTC.toFixed(8) }}</span>
        </li>
        <li v-if="totalAmountsByCode.USDC" class="flex justify-between items-center">
          <span class="text-gray-200 text-lg">USD Coin (USDC):</span>
          <span class="text-yellow-500 font-semibold text-lg">{{ totalAmountsByCode.USDC.toFixed(2) }}</span>
        </li>
        <li v-if="totalAmountsByCode.ETH" class="flex justify-between items-center">
          <span class="text-gray-200 text-lg">Ethereum (ETH):</span>
          <span class="text-yellow-500 font-semibold text-lg">{{ totalAmountsByCode.ETH.toFixed(8) }}</span>
        </li>
        <li v-if="!totalAmountsByCode.BTC && !totalAmountsByCode.USDC && !totalAmountsByCode.ETH" class="text-center">
          <span class="text-gray-400 text-sm">No cryptocurrency totals available</span>
        </li>
      </ul>
    </div>
  </div>
</template>