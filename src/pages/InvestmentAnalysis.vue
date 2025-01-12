<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user.store.ts";

const totalAmountsByCode = ref<Record<string, number>>({
  BTC: 0,
  ETH: 0,
  USDC: 0,
});
const isLoading = ref(true);

onMounted(async () => {
  // TODO: Calcular el total que tenemos ahora en base al historial del usuario

  const userId = localStorage.getItem("userId") || ""; // TODO: Manejar error si no hay userId
  const userStore = useUserStore();
  await userStore.getCryptoCurrencyAmounts(userId);
  isLoading.value = false;
  totalAmountsByCode.value = {
    BTC: userStore.totalCryptoCurrencyAmounts.BTC || 0,
    ETH: userStore.totalCryptoCurrencyAmounts.ETH || 0,
    USDC: userStore.totalCryptoCurrencyAmounts.USDC || 0,
  };
});
</script>

<template>
  <div class="min-h-screen flex justify-center items-center px-4 py-8">
    <div class="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
      <h1 class="text-3xl font-bold text-yellow-500 mb-8 text-center">Your Cryptocurrency Totals</h1>

      <div v-if="isLoading" class="h-full w-full flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-500"></div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between transition-transform transform hover:scale-105">
          <div>
            <h3 class="text-xl font-semibold text-yellow-400">Bitcoin</h3>
            <p class="text-sm text-gray-400">BTC</p>
          </div>
          <div class="mt-4">
            <p class="text-2xl font-bold text-yellow-400">
              {{ totalAmountsByCode.BTC.toFixed(8) }}
            </p>
            <p class="text-sm text-gray-400 mt-2">$41,235.20</p>
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between transition-transform transform hover:scale-105">
          <div>
            <h3 class="text-xl font-semibold text-purple-400">Ethereum</h3>
            <p class="text-sm text-gray-400">ETH</p>
          </div>
          <div class="mt-4">
            <p class="text-2xl font-bold text-purple-400">
              {{ totalAmountsByCode.ETH.toFixed(8) }}
            </p>
            <p class="text-sm text-gray-400 mt-2">$6,521.43</p>
          </div>
        </div>

        <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between transition-transform transform hover:scale-105">
          <div>
            <h3 class="text-xl font-semibold text-green-400">USD Coin</h3>
            <p class="text-sm text-gray-400">USDC</p>
          </div>
          <div class="mt-4">
            <p class="text-2xl font-bold text-green-400">
              {{ totalAmountsByCode.USDC.toFixed(2) }}
            </p>
            <p class="text-sm text-gray-400 mt-2">$1,500.00</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
