<template>
    <OptionsBar
        class="display-bar"
    />
    <ul
        class="results"
        :class="configStore.displayType"
    >
        <li
            v-for="product in products"
            :key="product._id"
        >
            <ProductCard
                :product="product"
            />
        </li>
        <li v-if="isMoreProducts">
            <Observer @intersect="loadNext" />
        </li>
    </ul>
    <div
        v-if="isMoreProducts || isLoading"
        class="loading"
    >
        <Spinner />
    </div>
</template>

<script lang="ts">
export default {
    name: "SearchResults"
};
</script>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import SearchService, { ISearchProduct } from "@/services/search.service";
import ProductCard from "@/components/product/Card.vue";
import Observer from "@/components/elements/Observer.vue";
import Spinner from "@/components/ui/Spinner.vue";
import OptionsBar from "@/components/pages/search/OptionsBar.vue";
import { useConfigStore } from "@/stores/config";
import { useSearchStore } from "@/stores/search";

const configStore = useConfigStore();
const searchStore = useSearchStore();

const PRODUCT_PER_PAGE = 24;

const route = useRoute();
const isLoading = ref(true);
const isMoreProducts = ref(false);
const page = ref(0);
const products = ref<Array<ISearchProduct>>([]);

const options = computed(() => searchStore.options);

const params = computed(() => {
    const params = { ...route.query } as Record<string, string | number>;
    params.limit = PRODUCT_PER_PAGE;
    params.skip = PRODUCT_PER_PAGE * page.value;

    if (options.value?.priceRange) {
        params.price = options.value.priceRange;
    }
    else {
        delete params.price;
    }

    if (options.value?.engineRange) {
        params.engine = options.value.engineRange;
    }
    else {
        delete params.engine;
    }

    if (options.value?.timeRange) {
        params.time = options.value.timeRange;
    }
    else {
        delete params.time;
    }

    if (options.value?.discounted) {
        params.discounted = options.value.discounted;
    }
    else {
        delete params.discounted;
    }

    if (options.value?.categories) {
        params.categories = options.value.categories;
    }
    else {
        delete params.categories;
    }

    return params;
});

watch([
    () => route.query,
    () => options
], async () => {
    await sendQuery();
}, { deep: true, immediate: true });

async function loadNext() {
    if (!isLoading.value) {
        isMoreProducts.value = false;
        isLoading.value = true;
        page.value++;
        const nextProducts = await SearchService.query(params.value);
        isLoading.value = false;

        isMoreProducts.value = (nextProducts.length === PRODUCT_PER_PAGE);

        if (nextProducts.length > 0) {
            products.value.push(...nextProducts);
        }
    }
}

async function sendQuery() {
    page.value = 0;
    isMoreProducts.value = false;
    products.value = await SearchService.query(params.value);
    isMoreProducts.value = (products.value.length === PRODUCT_PER_PAGE);
    isLoading.value = false;
}

</script>

<style scoped lang="scss">
.display-bar {
    padding: var(--length-padding-xl);
    padding-bottom: 0;
}

.results {
    padding: var(--length-padding-xl);
    display: grid;
    margin: 0;

    &.box, &.square {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--length-margin-l);
    }

    &.list {
        gap: var(--length-margin-base);
    }

    li {
        list-style-type: none;
    }
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 50px;
}
</style>
