import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";

export const useConfigStore = defineStore("config", () => {
    const displayType = useLocalStorage("displayType", "square");
    const favSet = useLocalStorage<Set<string>>("favSet", new Set());
    const banList = useLocalStorage<Record<string, string>>("banList", {});

    return {
        banList,
        displayType,
        favSet
    };
});
