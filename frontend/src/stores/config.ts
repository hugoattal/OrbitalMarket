import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useConfigStore = defineStore({
    id: "config",
    state: () => ({
        displayType: useLocalStorage("displayType", "square"),
        favSet: useLocalStorage<Set<string>>("favSet", new Set())
    })
});
