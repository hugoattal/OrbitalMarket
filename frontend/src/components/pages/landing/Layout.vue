<template>
    <div class="page">
        <Background />
        <div class="search">
            <Logo role="banner" />
            <SearchBar role="search" />
            <ButtonsBar role="navigation" />
        </div>
        <Footer class="footer" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Logo from "./Logo.vue";
import Background from "./Background.vue";
import SearchBar from "@/components/elements/SearchBar.vue";
import ButtonsBar from "@/components/pages/landing/ButtonsBar.vue";
import Footer from "@/components/theme/Footer.vue";

export default defineComponent({
    name: "LandingLayout",
    components: { Footer, ButtonsBar, SearchBar, Background, Logo }
});
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .search {
        z-index: 1;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: var(--length-margin-base);
    }

    .footer {
        position: absolute;
        z-index: 5;
        bottom: 0;
        right: 0;
        left: 0;
    }
}
</style>
