import axios from "axios";
import type {SaveTransactionData} from "../types.ts";

const labBack = axios.create({
    baseURL: "https://laboratorio3-f36a.restdb.io/rest/",
    headers: {
        "Content-Type": "application/json",
        "x-api-key": "60eb09146661365596af552f"
    },
});

export const labApi = {
    async saveTransaction(transactionData: SaveTransactionData) {
        return await labBack.post("/transactions", transactionData);
    }
}