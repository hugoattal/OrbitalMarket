<template>
    <div class="page">
        <Background />
        <div class="search">
            <Logo role="banner" />
            <SearchBar role="search" />
            <ButtonsBar role="navigation" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Logo from "./Logo.vue";
import Background from "./Background.vue";
import SearchBar from "@/components/elements/SearchBar.vue";
import ButtonsBar from "@/components/pages/landing/ButtonsBar.vue";

export default defineComponent({
    name: "LandingLayout",
    components: { ButtonsBar, SearchBar, Background, Logo }
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
}
</style>
