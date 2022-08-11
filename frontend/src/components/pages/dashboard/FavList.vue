<template>
    <div class="fav-list">
        <h2>Favlist</h2>
        <ul
            class="results"
            :class="configStore.displayType"
        >
            <li
                v-for="product of products"
                :key="product._id"
            >
                <ProductCard :product="product" />
            </li>
        </ul>
    </div>
</template>

<script lang="ts">
export default {
    name: "FavList"
};
</script>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useConfigStore } from "@/stores/config";
import SearchService, { ISearchProduct } from "@/services/search.service";
import ProductCard from "@/components/product/Card.vue";

const configStore = useConfigStore();
const products = ref<Array<ISearchProduct>>([]);

onMounted(async() => {
    products.value = await SearchService.list(Array.from(configStore.favSet));
});


</script>

<style scoped lang="scss">
.fav-list {
    h2 {
        margin: 0;
        padding: 0;
        font-size: 2rem;
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
}
</style>
