import { AxiosError, type AxiosResponse } from "axios";

export const parseAxiosError = (e: unknown) => {
    if (!(e instanceof AxiosError)) {
        throw new Error("parseAxiosError: e is not an AxiosError");
    }

    const response = e.response as AxiosResponse<{ message: string }>;

    const status = response?.status ?? 500;
    const message = response?.data?.message ?? "Error desconocido";

    return { status, message };
};

export const formatToARS = (value: number): string => {
    return new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
    }).format(value);
};