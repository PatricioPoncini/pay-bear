import axios from "axios";
import type {TransactionData} from "../types.ts";

const labBack = axios.create({
    baseURL: "https://laboratorio3-f36a.restdb.io/rest/",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "60eb09146661365596af552f"
    },
});

export const labApi = {
    async saveTransaction(transactionData: TransactionData) {
        return await labBack.post("/transactions", transactionData);
    },
    async getUserHistory(userId: string) {
        return await labBack.get<TransactionData[]>(`/transactions?q={"user_id": "${userId}"}`);
    }
}