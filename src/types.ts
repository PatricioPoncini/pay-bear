export enum CRYPTO_CURRENCY {
    BTC = "BTC",
    ETH = "ETH",
    USDC = "USDC",
};

export enum CRYPTO_ACTION {
    PURCHASE = "purchase",
    SALE = "sale"
};

export interface TransactionData {
    _id?: string;
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