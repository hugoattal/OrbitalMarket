<template>
    <div class="page">
        <div class="support">
            <span>🇺🇦 Orbital Market stands with Ukraine. <a
                href="https://www.icrc.org/en/donate/ukraine"
                target="_blank"
            >Support the Red Cross</a></span>
        </div>
        <div class="search">
            <Logo role="banner" />
            <div role="search">
                <SearchBar />
                <SearchOptions />
            </div>
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
    components: { Logo, SearchBar, SearchOptions, SearchResults }
});
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    .support {
        display: flex;
        justify-content: center;
        padding: var(--length-padding-base);
        text-align: center;

        a {
            color: #ffd500;
            font-weight: 600;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .search {
        height: 180px;
        padding-bottom: 20px;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        background-color: var(--color-content-background);
        border-bottom: 1px solid var(--color-content-light);
        box-shadow: 0 0 10px var(--color-shadow);

        @media screen and (max-width: 500px) {
            height: 220px;
        }
    }
}
</style>
