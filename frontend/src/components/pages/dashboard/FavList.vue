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
            <UIButton @click="clearFavlist">
                Clear
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
    updateProductIds();
});

function exportToClipboard() {
    navigator.clipboard.writeText(Array.from(configStore.favSet).join(","));
    alert("Favlist copied to clipboard");
}

function clearFavlist() {
    if (!confirm("Are you sure you want to clear the favlist?")) {
        return;
    }

    configStore.favSet.clear();
    products.value = [];
}

async function importFavlist() {
    const favlist = (await navigator.clipboard.readText()) || prompt("Enter favlist");
    if (favlist) {
        if (favlist.startsWith("Vault")) {
            importVault(favlist);
        }
        else {
            const favImport = favlist.split(",");

            for (const fav of favImport) {
                configStore.favSet.add(fav);
            }
        }
    }

    products.value = await SearchService.list(Array.from(configStore.favSet));
    updateProductIds();
}

function importVault(favlist: string) {
    console.log(favlist);

    const favImport = favlist
        .split("\n\n")
        .map((value) => value.split("\n"))
        .filter((value) => value.length >= 4 && value.length <= 5)
        .map((value) => value[1]);

    for (const fav of favImport) {
        configStore.favSet.add(fav);
    }
}

function updateProductIds() {
    if (products.value.length) {
        configStore.favSet.clear();
        for (const product of products.value) {
            configStore.favSet.add(product.meta.unrealId);
        }
    }
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
