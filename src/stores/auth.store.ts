import { defineStore } from 'pinia';
import {toast} from "vue3-toastify";

interface AuthState {
    user: {
        userId: string;
    }
}

export const useAuthStore = defineStore('authStore', {
    state: (): AuthState => {
        return {
            user: {
                userId: '',
            }
        }
    },
    actions: {
        login(userId: string) {
            this.user.userId = userId;
            localStorage.setItem("userId", userId);
        },
        async logout() {
            this.user.userId = "";
            localStorage.removeItem("userId");
        },
        getUserId() {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                toast.error("User id not found");
                throw new Error("User id not found");
            }
            return userId;
        }
    }
})