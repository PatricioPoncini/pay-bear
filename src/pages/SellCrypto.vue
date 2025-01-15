<script setup lang="ts">
import {computed, onMounted, ref} from "vue";
import {CRYPTO_ACTION, type TransactionData} from "../types.ts";
import {toast} from "vue3-toastify";
import {cryptoYaApi} from "../services/cryptoYaApi.ts";
import {labApi} from "../services/labApi.ts";
import {parseAxiosError} from "../utils/parse.ts";
import {useUserStore} from "../stores/user.store.ts";
import {useAuthStore} from "../stores/auth.store.ts";
import {router} from "../routes/routes.ts";

const amount = ref<number>(0);
const cryptoCurrency = ref<string>("");
const isLoading = ref(false);
const totalAmountsByCode = ref<Record<string, number>>({});
const authStore = useAuthStore();

const cleanForm = () => {
  amount.value = 0;
  cryptoCurrency.value = "";
}

onMounted(async () => {
  const userId = authStore.getUserId();
  const userStore = useUserStore();
  await userStore.getCryptoCurrencyAmounts(userId);
  totalAmountsByCode.value = userStore.totalCryptoCurrencyAmounts;
});

const availableAmount = computed(() => {
  return cryptoCurrency.value ? totalAmountsByCode.value[cryptoCurrency.value] || 0 : 0;
});

const sellCrypto = async () => {
  if (!cryptoCurrency.value || !amount.value) {
    return toast.error("All fields are required");
  }

  if (amount.value > availableAmount.value) {
    return toast.error("Does not have the amount you want to sell");
  }

  isLoading.value = true;
  try {
    const response = await cryptoYaApi.getCurrencyPrice(cryptoCurrency.value);

    const data: TransactionData = {
      user_id: authStore.getUserId(),
      action: CRYPTO_ACTION.SALE,
      crypto_amount: amount.value.toString(),
      crypto_code: cryptoCurrency.value,
      datetime: new Date(),
      money: response.data.totalAsk.toString(),
    };

    await labApi.saveTransaction(data);
    toast.success("Transaction saved successfully");
    cleanForm();
    setTimeout(() => {
      router.push("/");
    }, 2000)
  } catch (e) {
    const {message} = parseAxiosError(e);
    toast.error(message);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="h-screen flex justify-center items-center w-full px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-yellow-500 mb-2">Sell Cryptocurrency</h1>
        <p class="text-gray-400">Enter the details for your sale</p>
      </div>

      <form @submit.prevent="sellCrypto" class="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-700">
        <div class="mb-6">
          <label for="cryptocurrency" class="block mb-2 text-sm font-medium text-gray-200">
            Select Cryptocurrency
          </label>
          <div class="relative">
            <select
                v-model="cryptoCurrency"
                id="cryptocurrency"
                class="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-xl p-4 appearance-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-colors"
                :class="{'border-red-500': !cryptoCurrency && amount > 0}"
            >
              <option value="" disabled selected>Choose a cryptocurrency</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDC">USD Coin (USDC)</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div class="mb-8">
          <label for="amount" class="block mb-2 text-sm font-medium text-gray-200">
            Amount
          </label>
          <div class="relative">
            <input
                v-model="amount"
                type="number"
                id="amount"
                step="0.0000001"
                placeholder="0.000"
                class="w-full bg-gray-700 border border-gray-600 text-gray-100 text-sm rounded-xl p-4 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 transition-colors"
                :class="{'border-red-500': amount <= 0 && cryptoCurrency}"
            >
            <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
              <span class="text-gray-400 text-sm">{{ cryptoCurrency }}</span>
            </div>
          </div>
          <label v-if="cryptoCurrency" for="amount" class="block mt-2 text-sm font-medium text-gray-200">
            {{ cryptoCurrency }} available: {{ availableAmount }}
          </label>
        </div>

        <button
            type="submit"
            class="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-semibold py-4 px-6 rounded-xl hover:from-yellow-600 hover:to-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 flex items-center justify-center"
            :disabled="isLoading"
        >
          <svg
              v-if="isLoading"
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900"
              fill="none"
              viewBox="0 0 24 24"
          >
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          {{ isLoading ? 'Processing...' : 'Sell Now' }}
        </button>
      </form>

      <div class="mt-6 text-center text-sm text-gray-400">
        <p>By proceeding, you agree to our terms of service and privacy policy</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
</style>