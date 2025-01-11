import {defineStore} from "pinia";
import {toast} from "vue3-toastify";
import {parseAxiosError} from "../utils/parse.ts";
import {labApi} from "../services/labApi.ts";

interface UserState {
    totalCryptoCurrencyAmounts: Record<string, number>;
}

export const useUserStore = defineStore('userStore', {
    state: (): UserState => {
        return {
            totalCryptoCurrencyAmounts: {}
        }
    },
    actions: {
        async getCryptoCurrencyAmounts(userId: string) {
            try {
                const transactions = (await labApi.getUserHistory(userId)).data;
                this.totalCryptoCurrencyAmounts = transactions
                    .filter(transaction => transaction.action === "purchase")
                    .reduce((totals, transaction) => {
                        const cryptoCode = transaction.crypto_code;
                        const amount = parseFloat(transaction.crypto_amount);

                        totals[cryptoCode] = (totals[cryptoCode] || 0) + amount;

                        return totals;
                    }, {} as Record<string, number>);
            } catch (e) {
                const { message } = parseAxiosError(e);
                toast.error(message);
            }
        }
    }
})