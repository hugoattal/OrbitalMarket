<template>
    <div class="page">
        <Background />
        <div class="search">
            <Logo role="banner" />
            <span>Advanced search engine for the Fab marketplace</span>
            <SearchBar role="search" />
            <ButtonsBar role="navigation" />
        </div>
        <div class="sections">
            <section>
                <h2>
                    <RouterLink to="/search?time=0-1">
                        Most popular from last month
                    </RouterLink>
                </h2>
                <ul class="results">
                    <li
                        v-for="product in lastMonthProducts"
                        :key="product._id"
                    >
                        <ProductCard :product="product" />
                    </li>
                </ul>
            </section>
            <section>
                <h2>
                    <RouterLink to="/search">
                        Most popular from all time
                    </RouterLink>
                </h2>
                <ul class="results">
                    <li
                        v-for="product in allTimeProducts"
                        :key="product._id"
                    >
                        <ProductCard :product="product" />
                    </li>
                </ul>
            </section>
        </div>
        <Footer class="footer" />
    </div>
</template>

<script setup lang="ts">
import Logo from "./Logo.vue";
import Background from "./Background.vue";
import SearchBar from "@/components/elements/SearchBar.vue";
import ButtonsBar from "@/components/pages/landing/ButtonsBar.vue";
import Footer from "@/components/theme/Footer.vue";
import ProductCard from "@/components/product/Card.vue";
import { onMounted, ref } from "vue";
import SearchService, { ISearchProduct } from "@/services/search.service";


const lastMonthProducts = ref<Array<ISearchProduct>>([]);
const allTimeProducts = ref<Array<ISearchProduct>>([]);

onMounted(async () => {
    lastMonthProducts.value = await SearchService.query({
        limit: 6,
        sortDirection: "desc",
        time: { max: 1, min: 0 }
    });

    allTimeProducts.value = await SearchService.query({
        limit: 6,
        sortDirection: "desc"
    });
});
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    display: flex;
    align-items: center;
    flex-direction: column;

    .search {
        z-index: 1;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: var(--length-margin-base);
        gap: var(--length-gap-m);
    }

    .sections {
        display: flex;
        justify-content: center;
        flex-direction: column;
        gap: var(--length-gap-xl);
        margin-top: var(--length-margin-l);
        max-width: 100%;

        section {
            z-index: 1;
            border-radius: var(--length-radius-base);
            display: flex;
            flex-direction: column;
            gap: var(--length-gap-l);
            max-width: 100%;
            h2 {
                padding: 0 var(--length-padding-base);
                margin: 0;

                .more {
                    font-size: 1rem;
                    color: var(--color-content-50);
                }

                a:hover {
                    color: var(--color-primary);
                }
            }
        }
    }

    .results {
        display: flex;
        margin: 0;
        padding: var(--length-padding-base);
        gap: var(--length-margin-l);
        max-width: 100%;

        overflow: auto;

        li {
            width: 200px;
            flex-shrink: 0;
            list-style-type: none;
        }
    }
}
</style>
