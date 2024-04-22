<template>
    <div class="fav-list">
        <h2>Favlist</h2>
        <div class="actions">
            <UIButton @click="exportToClipboard">
                Copy to clipboard
            </UIButton>
            <UIButton @click="importFavlist">
                Import
            </UIButton>
        </div>
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
import UIButton from "@/components/ui/Button.vue";

const configStore = useConfigStore();
const products = ref<Array<ISearchProduct>>([]);

onMounted(async() => {
    products.value = await SearchService.list(Array.from(configStore.favSet));
});

function exportToClipboard() {
    navigator.clipboard.writeText(Array.from(configStore.favSet).join(","));
    alert("Favlist copied to clipboard");
}

async function importFavlist() {
    const favlist = prompt("Enter favlist");
    if (favlist) {
        const favImport = favlist.split(",");

        for (const fav of favImport) {
            configStore.favSet.add(fav);
        }
    }

    products.value = await SearchService.list(Array.from(configStore.favSet));
}
</script>

<style scoped lang="scss">
.fav-list {
    display: flex;
    flex-direction: column;
    gap: var(--length-margin-base);

    h2 {
        margin: 0;
        padding: 0;
        font-size: 2rem;
    }

    .actions {
        display: flex;
        gap: var(--length-margin-s);
    }

    .results {
        padding: 0;
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
