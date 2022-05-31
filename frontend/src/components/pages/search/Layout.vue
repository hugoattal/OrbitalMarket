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
            <div class="networks">
                <a href="https://github.com/hugoattal/OrbitalMarket"><i
                    class="lab la-github"
                /> GitHub</a>
                <a href="https://twitter.com/HugoAttal"><i
                    class="lab la-twitter"
                /> Twitter</a>
                <a href="https://forums.unrealengine.com/unreal-engine/marketplace/1857381-orbital-market-search-engine-for-the-ue-marketplace"><i
                    class="las la-comments"
                /> Epic Forum</a>
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
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        background-color: var(--color-content-background);
        border-bottom: 1px solid var(--color-content-light);
        box-shadow: 0 0 10px var(--color-shadow);

        @media screen and (max-width: 700px) {
            padding-top: 16px
        }

        @media screen and (max-width: 500px) {
            height: 220px;
            padding-top: 32px
        }

        .networks {
            position: absolute;
            top: 0;
            right: 0;
            display: flex;
            padding: var(--length-padding-s) var(--length-padding-l);
            gap: var(--length-gap-m);

            a {
                display: flex;
                align-items: center;
                gap: var(--length-gap-xs);
                color: var(--color-content-50);

                &:hover {
                    color: var(--color-primary);
                }
            }

            .las, .lab {
                font-size: 1.55rem;
            }
        }
    }
}
</style>
