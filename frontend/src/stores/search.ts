import { defineStore } from "pinia";

export const useSearchStore = defineStore({
    id: "search",
    getters: {
        options() {
            const options = {} as Record<string, any>;

            if (Object.keys(this.priceRange).length) {
                options.priceRange = this.priceRange;
            }

            if (Object.keys(this.engineRange).length) {
                options.engineRange = this.engineRange;
            }

            if (Object.keys(this.timeRange).length) {
                options.timeRange = this.timeRange;
            }

            if (Object.keys(this.discountRange).length) {
                options.discountRange = this.discountRange;
            }

            if (this.favorites) {
                options.favorites = this.favorites;
            }

            options.categories = this.categories;

            return options;
        }
    },
    state: () => ({
        categories: [],
        discountRange: {},
        engineRange: {},
        favorites: false,
        priceRange: {},
        timeRange: {}
    })
});
