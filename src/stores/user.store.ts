import {defineStore} from "pinia";
import {toast} from "vue3-toastify";
import {parseAxiosError} from "../utils/parse.ts";
import {labApi} from "../services/labApi.ts";
import type {TransactionData} from "../types.ts";

interface UserState {
    totalCryptoCurrencyAmounts: Record<string, number>;
    userTransacions: TransactionData[]
}

export const useUserStore = defineStore('userStore', {
    state: (): UserState => {
        return {
            totalCryptoCurrencyAmounts: {},
            userTransacions: []
        }
    },
    actions: {
        async getCryptoCurrencyAmounts(userId: string) {
            try {
                const transactions = (await labApi.getUserHistory(userId)).data;
                this.userTransacions = transactions;

                this.totalCryptoCurrencyAmounts = transactions.reduce((totals, transaction) => {
                    const cryptoCode = transaction.crypto_code;
                    const amount = parseFloat(transaction.crypto_amount);

                    if (transaction.action === "purchase") {
                        totals[cryptoCode] = (totals[cryptoCode] || 0) + amount;
                    } else if (transaction.action === "sale") {
                        totals[cryptoCode] = (totals[cryptoCode] || 0) - amount;
                    }

                    return totals;
                }, {} as Record<string, number>);
            } catch (e) {
                const { message } = parseAxiosError(e);
                toast.error(message);
            }
        }
    }
})