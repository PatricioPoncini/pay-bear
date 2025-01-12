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
        async logout() {
            this.user.userId = "";
            localStorage.removeItem("userId");
            console.log("User logged out");
        },
    },
    getters: {
        // TODO: Si se hace F5 no se vuelve a ver
        isUserLoggedIn(state): boolean {
            return !!state.user.userId;
        },
    },
})