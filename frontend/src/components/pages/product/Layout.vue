<template>
    <div class="page">
        <div class="search">
            <Logo role="banner" />
            <SearchBar role="search" />
            <ButtonsBar role="navigation" />
        </div>
        <Suspense>
            <template #default>
                <div class="description">
                    <ProductDescription :product-id="$route.params.slug" />
                </div>
            </template>
            <template #fallback>
                <Spinner class="spinner" />
            </template>
        </Suspense>
        <Footer />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Logo from "@/components/pages/search/Logo.vue";
import ProductDescription from "@/components/product/Description.vue";
import SearchBar from "@/components/elements/SearchBar.vue";
import ButtonsBar from "@/components/pages/landing/ButtonsBar.vue";
import Spinner from "@/components/ui/Spinner.vue";
import Footer from "@/components/theme/Footer.vue";

export default defineComponent({
    name: "ProductLayout",
    components: { ButtonsBar, Footer, Logo, ProductDescription, SearchBar, Spinner }
});
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    .search {
        height: 180px;
        padding-bottom: 20px;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        gap: var(--length-gap-m);

        background-color: var(--color-content-background);
        border-bottom: 1px solid var(--color-content-light);
        box-shadow: 0 0 10px var(--color-shadow);
    }

    .description {
        padding: var(--length-padding-l);
        max-width: 1200px;
        min-width: 55vw;
        margin: auto;
    }

    .spinner {
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 50px;
    }
}
</style>
