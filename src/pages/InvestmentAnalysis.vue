<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useUserStore } from "../stores/user.store.ts";
import { cryptoYaApi } from "../services/cryptoYaApi.ts";
import type {CRYPTO_CURRENCY} from "../types.ts";
import {useAuthStore} from "../stores/auth.store.ts";
import {formatToARS} from "../utils/parse.ts";

const totalAmountsByCode = ref<Record<string, number>>({
  BTC: 0,
  ETH: 0,
  USDC: 0,
});
const gainsOrLossesByCode = ref<Record<string, number>>({ BTC: 0, ETH: 0, USDC: 0 });
const isLoading = ref<boolean>(true);
const btcValueInArs = ref<number>(0);
const usdcValueInArs = ref<number>(0);
const ethValueInArs = ref<number>(0);
const authStore = useAuthStore();

onMounted(async () => {
  const userId = authStore.getUserId();
  const userStore = useUserStore();
  await userStore.getCryptoCurrencyAmounts(userId);

  const transactions = userStore.userTransacions;

  totalAmountsByCode.value = {
    BTC: userStore.totalCryptoCurrencyAmounts.BTC || 0,
    ETH: userStore.totalCryptoCurrencyAmounts.ETH || 0,
    USDC: userStore.totalCryptoCurrencyAmounts.USDC || 0,
  };

  const totals: Record<CRYPTO_CURRENCY, { purchases: number; cryptoAmount: number; sales: number }> = {
    BTC: { purchases: 0, cryptoAmount: 0, sales: 0 },
    ETH: { purchases: 0, cryptoAmount: 0, sales: 0 },
    USDC: { purchases: 0, cryptoAmount: 0, sales: 0 },
  };

  transactions.forEach((tx) => {
    const { action, crypto_code, money } = tx;
    if (!totals[crypto_code as CRYPTO_CURRENCY]) return;

    if (action === "purchase") {
      totals[crypto_code as CRYPTO_CURRENCY].purchases += parseFloat(money);
    } else if (action === "sale") {
      totals[crypto_code as CRYPTO_CURRENCY].sales += parseFloat(money);
    }
  });

  (Object.keys(totals) as Array<CRYPTO_CURRENCY>).forEach((crypto) => {
    const { purchases, sales } = totals[crypto];
    gainsOrLossesByCode.value[crypto] = sales - purchases;
  });

  btcValueInArs.value = (await cryptoYaApi.getCurrencyPrice("BTC")).data.bid;
  usdcValueInArs.value = (await cryptoYaApi.getCurrencyPrice("USDC")).data.bid;
  ethValueInArs.value = (await cryptoYaApi.getCurrencyPrice("ETH")).data.bid;

  (Object.keys(totals) as Array<CRYPTO_CURRENCY>).forEach((crypto) => {
    const { purchases, sales, cryptoAmount } = totals[crypto];

    const currentValue = cryptoAmount * (crypto === "BTC" ? btcValueInArs.value : crypto === "ETH" ? ethValueInArs.value : usdcValueInArs.value);

    gainsOrLossesByCode.value[crypto] = sales + currentValue - purchases;
  });

  isLoading.value = false;
});


const totalAmountInArs = (): string => {
  const btcAmount = totalAmountsByCode.value.BTC * btcValueInArs.value;
  const ethAmount = totalAmountsByCode.value.ETH * ethValueInArs.value;
  const usdcAmount = totalAmountsByCode.value.USDC * usdcValueInArs.value;
  return formatToARS(btcAmount + ethAmount + usdcAmount);
};
</script>

<template>
  <div class="min-h-screen flex justify-center items-center px-4 py-8">
    <div class="w-full max-w-4xl bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
      <h1 class="text-3xl font-bold text-yellow-500 mb-8 text-center">Your Cryptocurrency Totals</h1>

      <div v-if="isLoading" class="h-full w-full flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-500"></div>
      </div>

      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between transition-transform transform hover:scale-105">
            <div>
              <h3 class="text-xl font-semibold text-yellow-400">Bitcoin</h3>
              <p class="text-sm text-gray-400">BTC</p>
            </div>
            <div class="mt-4">
              <p class="text-2xl font-bold text-yellow-400">
                {{ totalAmountsByCode.BTC.toFixed(2) }}
              </p>
              <p class="text-sm text-gray-400 mt-2">ARS: {{ formatToARS(totalAmountsByCode.BTC * btcValueInArs) }}</p>
              <p class="text-sm mt-2" :class="{ 'text-green-400': gainsOrLossesByCode.BTC >= 0, 'text-red-400': gainsOrLossesByCode.BTC < 0 }">
                Ganancia/Pérdida: {{ formatToARS(gainsOrLossesByCode.BTC) }}
              </p>
            </div>
          </div>

          <div class="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 flex flex-col justify-between transition-transform transform hover:scale-105">
            <div>
              <h3 class="text-xl font-semibold text-purple-400">Ethereum</h3>
              <p class="text-sm text-gray-400">ETH</p>
            </div>
            <div class="mt-4">
              <p class="text-2xl font-bold text-purple-400">
                {{ totalAmountsByCode.ETH.toFixed(2) }}
              </p>
              <p class="text-sm text-gray-400 mt-2">ARS: {{ formatToARS(totalAmountsByCode.ETH * ethValueInArs) }}</p>
              <p class="text-sm mt-2" :class="{ 'text-green-400': gainsOrLossesByCode.ETH >= 0, 'text-red-400': gainsOrLossesByCode.ETH < 0 }">
                Ganancia/Pérdida: {{ formatToARS(gainsOrLossesByCode.ETH) }}
              </p>
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
              <p class="text-sm text-gray-400 mt-2">ARS: {{ formatToARS(totalAmountsByCode.USDC * usdcValueInArs) }}</p>
              <p class="text-sm mt-2" :class="{ 'text-green-400': gainsOrLossesByCode.USDC >= 0, 'text-red-400': gainsOrLossesByCode.USDC < 0 }">
                Ganancia/Pérdida: {{ formatToARS(gainsOrLossesByCode.USDC) }}
              </p>
            </div>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-100 mt-8 text-center">
          Total ARS: {{ totalAmountInArs() }}
        </h1>
      </div>
    </div>
  </div>
</template>
