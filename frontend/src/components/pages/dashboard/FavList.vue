<template>
    <div class="fav-list">
        <h2>Favlist</h2>
        <div class="actions">
            <UIButton @click="exportToClipboard">
                Export to clipboard
            </UIButton>
            <UIButton @click="importFavlist">
                Import from clipboard
            </UIButton>
            <UIButton @click="clearFavlist">
                Clear
            </UIButton>
        </div>
        <div class="note">
            You can also import directly from <a
                href="https://www.unrealengine.com/marketplace/en-US/vault"
                target="_blank"
            >your vault</a> by copying the whole page (Ctrl+A/Ctrl+C), and clicking the "Import from clipboard" button.
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
import UIButton from "@/components/ui/OButton.vue";

const configStore = useConfigStore();
const products = ref<Array<ISearchProduct>>([]);

onMounted(async() => {
    products.value = await SearchService.list(Array.from(configStore.favSet));
    updateProductIds();
});

async function exportToClipboard() {
    await navigator.clipboard.writeText(Array.from(configStore.favSet).join(","));
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
    const favlist = ((await navigator.clipboard.readText()) || prompt("Enter favlist"))?.trim();
    if (favlist) {
        if (favlist.startsWith("Vault") || favlist.startsWith("Unreal Engine Logo")) {
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
    favlist = favlist.split("SaleVaultHelp")[1];
    favlist = favlist.split("Recommended For You")[0];

    const favImport = favlist
        .split("\n")
        .map((value) => value.trim())
        .join("\n")
        .split("\n\n")
        .map((value) => value
            .split("\n")
            .filter((value) => isNaN(value))
        )
        .filter((value) => value.length >= 3)
        .flat();

    for (const fav of favImport) {
        configStore.favSet.add(fav);
    }
}

function updateProductIds() {
    if (products.value.length) {
        configStore.favSet.clear();
        for (const product of products.value) {
            configStore.favSet.add(product.meta.fabId);
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

    .note {
        background: var(--color-content-background);
        padding: var(--length-padding-s) var(--length-padding-base);
        border-radius: var(--length-radius-base);
        color: var(--color-content-30);

        a {
            color: var(--color-primary);

            &:hover {
                text-decoration: underline;
            }
        }
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
