<template>
    <div class="page">
        <div class="search">
            <Logo />
            <SearchBar />
            <SearchOptions />
        </div>
        <SearchResults />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchBar from "@/components/elements/SearchBar.vue";
import SearchResults from "@/components/pages/search/Results.vue";
import SearchOptions from "@/components/pages/search/Options.vue";
import Logo from "@/components/pages/search/Logo.vue";

export default defineComponent({
    name: "SearchLayout",
    components: { Logo, SearchOptions, SearchBar, SearchResults }
});
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    .search {
        height: 180px;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
}
</style>
