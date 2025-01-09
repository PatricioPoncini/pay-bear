import axios from "axios";

const cryptoYaBack = axios.create({
    baseURL: "https://criptoya.com/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const cryptoYaApi = {

}