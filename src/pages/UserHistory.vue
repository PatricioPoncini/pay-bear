<script setup lang="ts">
import { ref, onMounted } from "vue";
import { labApi } from "../services/labApi.ts";
import type { TransactionData } from "../types.ts";
import { parseAxiosError } from "../utils/parse.ts";
import { toast } from "vue3-toastify";

const transactions = ref<TransactionData[]>([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const modalType = ref<"view" | "edit" | "delete">("view");
const selectedTransaction = ref<TransactionData | null>(null);
const isModalLoading = ref(false);


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
});

const openModal = (type: "view" | "edit" | "delete", transaction: TransactionData) => {
  modalType.value = type;
  selectedTransaction.value = transaction;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedTransaction.value = null;
};

const deleteTransaction = async () => {
  if (!selectedTransaction.value) return;
  isModalLoading.value = true;
  try {
    await labApi.deleteTransaction(selectedTransaction.value?._id);
    transactions.value = transactions.value.filter(t => t._id !== selectedTransaction.value?._id);
    toast.success("Transaction deleted successfully");
    closeModal();
  } catch (e) {
    const { message } = parseAxiosError(e);
    toast.error(message);
  } finally {
    isModalLoading.value = false;
  }
};

const updateTransactionAction = async (newAction: "purchase" | "sale") => {
  if (!selectedTransaction.value) return;
  isModalLoading.value = true;
  try {
    const updateData: TransactionData = {
      action: newAction,
      user_id: selectedTransaction.value.user_id,
      crypto_amount: selectedTransaction.value.crypto_amount,
      crypto_code: selectedTransaction.value.crypto_code,
      money: selectedTransaction.value.money,
      datetime: selectedTransaction.value.datetime
    }
    await labApi.updateTransaction(selectedTransaction.value?._id, updateData);
    selectedTransaction.value.action = newAction;
    toast.success("Transaction updated successfully");
    closeModal();
  } catch (e) {
    const { message } = parseAxiosError(e);
    toast.error(message);
  } finally {
    isModalLoading.value = false;
  }
};
</script>

<template>
  <div class="w-full flex flex-col p-10 mt-10 text-gray-100 min-h-screen">
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-yellow-500 mb-2">Transactions History</h1>
      <p class="text-gray-400">Watch your crypto transactions</p>
    </div>

    <div v-if="isLoading" class="h-full w-full flex items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-500"></div>
    </div>

    <div v-else class="flex-1 overflow-hidden rounded-lg">
      <div class="h-full overflow-auto">
        <table class="w-full text-sm text-left text-gray-100 table-fixed">
          <thead class="text-xs text-white bg-gray-800 sticky top-0">
          <tr>
            <th class="px-6 py-4">Cryptocurrency</th>
            <th class="px-6 py-4">Amount</th>
            <th class="px-6 py-4">Action</th>
            <th class="px-6 py-4">Price (ARS)</th>
            <th class="px-6 py-4">Date</th>
            <th class="px-6 py-4">Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="transaction in transactions"
              :key="transaction._id"
              class="bg-gray-700 border-b text-white hover:bg-gray-600 transition-colors group"
          >
            <td class="px-6 py-4 font-medium">{{ transaction.crypto_code }}</td>
            <td class="px-6 py-4">{{ transaction.crypto_amount }}</td>
            <td class="px-6 py-4">
                <span
                    :class="transaction.action === 'purchase' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'"
                    class="text-xs font-medium me-2 px-2.5 py-0.5 rounded"
                >
                  {{ transaction.action }}
                </span>
            </td>
            <td class="px-6 py-4">$ {{ transaction.money }}</td>
            <td class="px-6 py-4">{{ transaction.datetime.toString().split('T')[0] }}</td>
            <td class="px-6 py-4 flex gap-2">
              <button
                  @click="openModal('view', transaction)"
                  class="text-blue-500 hover:underline"
              >
                View
              </button>
              <button
                  @click="openModal('edit', transaction)"
                  class="text-yellow-500 hover:underline"
              >
                Edit
              </button>
              <button
                  @click="openModal('delete', transaction)"
                  class="text-red-500 hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="6" class="px-6 py-12 text-center text-gray-400">
              No transactions found
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-gray-800 text-gray-100 p-6 rounded-lg w-96 relative">
      <button
          @click="closeModal"
          class="absolute top-2 right-2 text-gray-400 hover:text-gray-100"
      >
        &times;
      </button>
      <h3 class="text-lg font-bold mb-4">
        {{ modalType === 'view' ? 'View Transaction' : modalType === 'edit' ? 'Edit Action' : 'Delete Transaction' }}
      </h3>
      <div v-if="modalType === 'view'" class="space-y-4">
        <div class="bg-gray-700 p-4 rounded-lg shadow-md">
          <p class="text-sm text-gray-400 uppercase tracking-wide">Cryptocurrency</p>
          <p class="text-lg font-semibold text-yellow-400">{{ selectedTransaction?.crypto_code }}</p>
        </div>

        <div class="bg-gray-700 p-4 rounded-lg shadow-md">
          <p class="text-sm text-gray-400 uppercase tracking-wide">Amount</p>
          <p class="text-lg font-semibold text-green-400">{{ selectedTransaction?.crypto_amount }}</p>
        </div>

        <div class="bg-gray-700 p-4 rounded-lg shadow-md">
          <p class="text-sm text-gray-400 uppercase tracking-wide">Action</p>
          <p
              :class="selectedTransaction?.action === 'purchase'
        ? 'text-green-400'
        : 'text-red-400'"
              class="text-lg font-semibold"
          >
            {{ selectedTransaction?.action }}
          </p>
        </div>

        <div class="bg-gray-700 p-4 rounded-lg shadow-md">
          <p class="text-sm text-gray-400 uppercase tracking-wide">Price (ARS)</p>
          <p class="text-lg font-semibold text-blue-400">$ {{ selectedTransaction?.money }}</p>
        </div>

        <div class="bg-gray-700 p-4 rounded-lg shadow-md">
          <p class="text-sm text-gray-400 uppercase tracking-wide">Date</p>
          <p class="text-lg font-semibold text-gray-300">
            {{ selectedTransaction?.datetime.toString().split('T')[0] }}
          </p>
        </div>
      </div>
      <div v-if="modalType === 'edit'" class="flex flex-col gap-4">
        <div class="flex flex-col gap-4" v-if="!isModalLoading">
          <select v-model="selectedTransaction.action" class="border border-gray-600 rounded px-4 py-2 bg-gray-700 text-gray-100">
            <option value="purchase">Purchase</option>
            <option value="sale">Sale</option>
          </select>
          <button
              @click="updateTransactionAction(selectedTransaction.action)"
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
        <div v-if="isModalLoading" class="flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-500"></div>
        </div>
      </div>
      <div v-if="modalType === 'delete'" class="flex flex-col gap-4">
        <p v-if="!isModalLoading">Are you sure you want to delete this transaction?</p>
        <div v-if="isModalLoading" class="flex justify-center items-center">
          <div class="animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-red-500"></div>
        </div>
        <button
            v-if="!isModalLoading"
            @click="deleteTransaction"
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>
