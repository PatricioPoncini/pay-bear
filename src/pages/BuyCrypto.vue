<script setup lang="ts">
// TODO: Pantalla para comprar monedas. Debe haber 3 opciones, cantidad (float), datetime, cuanto se pagó

import {ref} from "vue";
import type {CRYPTO_CURRENCY, SaveTransactionData} from "../types.ts";
import {toast} from "vue3-toastify";
import {cryptoYaApi} from "../services/cryptoYaApi.ts";
import {labApi} from "../services/labApi.ts";
import {parseAxiosError} from "../utils/parse.ts";

const amount = ref<number>(0);
const cryptoCurrency = ref<CRYPTO_CURRENCY>("");

const buyCrypto = async () => {
  if (!cryptoCurrency.value || !amount.value) {
    return toast.error("All fields are required");
  }

  const data = await buildTransactionData();
  try {
    await labApi.saveTransaction(data);
  } catch (e) {
    const {message} = parseAxiosError(e);
    toast.error(message);
  }
}

const buildTransactionData = async () => {
  try {
    const response = await cryptoYaApi.getCurrencyPrice(cryptoCurrency.value);

    const data: SaveTransactionData = {
      user_id: localStorage.getItem("userId") ?? "", // TODO: Obtener o fallar
      action: "purchase", // TODO: Hacer enum
      crypto_amount: amount.value.toString(),
      crypto_code: cryptoCurrency.value,
      datetime: new Date(),
      money: response.data.totalAsk,
    };
    return data;
  } catch (e) {
    const {message} = parseAxiosError(e);
    toast.error(message);
  }
}
</script>

<template>
  <div class="flex justify-center items-center w-full">
    <form @submit.prevent="buyCrypto" class="flex flex-col max-w-sm mx-auto bg-gray-800 rounded-xl p-10 gap-6">
      <div>
        <label for="countries" class="block mb-2 text-sm font-medium text-white">Choose a cryptocurrency</label>
        <select v-model="cryptoCurrency" id="countries" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
          <option value="BTC">BTC</option>
          <option value="USDC">USDC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>

      <div>
        <label for="number" class="block mb-2 text-sm font-medium text-white ">Amount</label>
        <input v-model="amount" step="0.0000001" type="number" id="number" aria-describedby="helper-text-explanation" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder="0.002">
      </div>

      <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Buy
      </button>
    </form>
  </div>
</template>
