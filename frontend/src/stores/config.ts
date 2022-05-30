import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useConfigStore = defineStore({
    id: "config",
    state: () => ({
        displayType: useLocalStorage("displayType", "square"),
        wishMap: useLocalStorage<Map<string, boolean>>("wishMap", new Map())
    })
});
