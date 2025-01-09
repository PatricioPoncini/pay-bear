import { type NavigationGuard } from "vue-router";

export const guards: Record<string, NavigationGuard> = {
    checkIfLoggedIn: async (_to, _, next) => {
        if (!localStorage.getItem("userId")) {
            next({ path: "/login" });
            return;
        }

        next();
    },
};
