<script setup lang="ts">
import {onMounted, ref} from "vue";
import {labApi} from "../services/labApi.ts";
import type {TransactionData} from "../types.ts";
import {parseAxiosError} from "../utils/parse.ts";
import {toast} from "vue3-toastify";

const transactions = ref<TransactionData[]>([]);
const isLoading = ref(true);

onMounted(async () => {
  try {
    const response = await labApi.getUserHistory(localStorage.getItem("userId") ?? "");
    transactions.value = response.data;
  } catch (e) {
    const { message } = parseAxiosError(e);
    toast.error(message);
  } finally {
    isLoading.value = false;
  }
})
</script>

<template>
  <div class="h-screen w-full flex flex-col p-10">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-yellow-500 mb-2">Transactions History</h1>
      <p class="text-gray-400">Watch your crypto transactions</p>
    </div>

    <div v-if="isLoading" class="h-full w-full flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-500"></div>
    </div>

    <div v-else class="flex-1 overflow-hidden rounded-lg">
      <div class="h-full overflow-auto">
        <table class="w-full text-sm text-left text-gray-500 table-fixed">
          <thead class="text-xs text-white bg-gray-800 sticky top-0">
          <tr>
            <th scope="col" class="px-6 py-4">Cryptocurrency</th>
            <th scope="col" class="px-6 py-4">Amount</th>
            <th scope="col" class="px-6 py-4">Action</th>
            <th scope="col" class="px-6 py-4">Price (ARS)</th>
            <th scope="col" class="px-6 py-4">Date</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="transaction in transactions"
              class="bg-gray-700 border-b text-white hover:bg-gray-600 transition-colors"
          >
            <td class="px-6 py-4 font-medium">
              {{ transaction.crypto_code }}
            </td>
            <td class="px-6 py-4">
              {{ transaction.crypto_amount }}
            </td>
            <td class="px-6 py-4" v-if="transaction.action === 'purchase'">
              <span class="text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-green-900 text-green-300">
                {{ transaction.action }}
              </span>
            </td>
            <td class="px-6 py-4" v-else>
              <span class="text-xs font-medium me-2 px-2.5 py-0.5 rounded bg-red-900 text-red-300">
                {{ transaction.action }}
              </span>
            </td>
            <td class="px-6 py-4">
              {{ transaction.money }}
            </td>
            <td class="px-6 py-4">
              {{ transaction.datetime.toString().split('T')[0] }}
            </td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="5" class="px-6 py-12 text-center text-gray-400">
              No transactions found
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
