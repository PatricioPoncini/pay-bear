export enum CRYPTO_CURRENCY {
    BTC = "BTC",
    ETH = "ETH",
    USDC = "USDC",
};

export interface TransactionData {
    user_id: string;
    action: string;
    crypto_code: string;
    crypto_amount: string;
    money: string;
    datetime: Date;
};

export interface CryptoCurrencyResponse {
    ask: number;
    totalAsk: number;
    bid: number;
    totalBid: number;
    time: number;
}