import { defineStore } from 'pinia';

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
            console.log("User logged in");
        },
    },
})