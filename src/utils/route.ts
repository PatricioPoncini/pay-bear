import {type Router} from "vue-router";

export const redirectTo = async (router: Router, routeTo: string) => {
    await router.push(`/${routeTo}`);
}
