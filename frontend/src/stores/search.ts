import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useRouteQuery } from "@vueuse/router";
import { useConfigStore } from "@/stores/config";

export const useSearchStore = defineStore("search", () => {
    const fieldQuery = useRouteQuery<string | null>("sortField");
    const directionQuery = useRouteQuery<string | null>("sortDirection");
    const discountQuery = useRouteQuery<string | null>("discount");
    const engineQuery = useRouteQuery<string | null>("engine");
    const priceQuery = useRouteQuery<string | null>("price");
    const timeQuery = useRouteQuery<string | null>("time");
    const categoriesQuery = useRouteQuery<string | null>("categories");

    const favorites = ref(false);

    const configStore = useConfigStore();

    const options = computed(() => {
        const body: Record<string, unknown> = {};

        if (fieldQuery.value) {
            body["sortField"] = fieldQuery.value;
        }

        if (directionQuery.value) {
            body["sortDirection"] = directionQuery.value;
        }

        if (discountQuery.value) {
            const parsedDiscount = discountQuery.value.split("-").map(Number);

            body["discount"] = {
                max: parsedDiscount[1],
                min: parsedDiscount[0]
            };
        }

        if (engineQuery.value) {
            const parsedEngine = engineQuery.value.split("-");

            body["engine"] = {
                max: parsedEngine[1],
                min: parsedEngine[0]
            };
        }

        if (priceQuery.value) {
            const parsedPrice = priceQuery.value.split("-").map(Number);

            body["price"] = {
                max: parsedPrice[1],
                min: parsedPrice[0]
            };
        }

        if (timeQuery.value) {
            const parsedTime = timeQuery.value.split("-").map(Number);

            body["time"] = {
                max: parsedTime[1],
                min: parsedTime[0]
            };
        }

        if (categoriesQuery.value) {
            body["categories"] = categoriesQuery.value.split(",");
        }

        if (favorites.value) {
            body["favlist"] = [...configStore.favSet];
        }

        return body;
    });

    return {
        favorites,
        options
    };
});
