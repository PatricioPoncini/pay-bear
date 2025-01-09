import axios from "axios";
import type {CryptoCurrencyResponse} from "../types.ts";

const cryptoYaBack = axios.create({
    baseURL: "https://criptoya.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

export const cryptoYaApi = {
    async getCurrencyPrice<CryptoCurrencyResponse>(currency: string) {
        return await cryptoYaBack.get(`/binance/${currency}/ARS/1`);
    }
}