<template>
    <div class="page">
        <SupportBar />
        <div class="search">
            <Logo role="banner" />
            <div role="search">
                <SearchBar />
                <SearchOptions />
                <ExternalLink />
            </div>
            <div class="dashboard">
                <RouterLink to="dashboard">
                    <i class="la la-sliders-h" />
                    Dashboard
                </RouterLink>
            </div>
            <div class="networks">
                <a
                    href="https://github.com/hugoattal/OrbitalMarket"
                    target="_blank"
                ><i
                    class="lab la-github"
                /> GitHub</a>
                <a
                    href="https://twitter.com/HugoAttal"
                    target="_blank"
                ><i
                    class="lab la-twitter"
                /> Twitter</a>
                <a
                    href="https://forums.unrealengine.com/unreal-engine/marketplace/1857381-orbital-market-search-engine-for-the-ue-marketplace"
                    target="_blank"
                ><i
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
import SupportBar from "@/components/elements/SupportBar.vue";
import ExternalLink from "@/components/elements/ExternalLink.vue";

export default defineComponent({
    name: "SearchLayout",
    components: { ExternalLink, Logo, SearchBar, SearchOptions, SearchResults, SupportBar }
});
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    .search {
        padding: var(--length-padding-l) 0;
        position: relative;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        background-color: var(--color-content-background);
        border-bottom: 1px solid var(--color-content-light);
        box-shadow: 0 0 10px var(--color-shadow);

        @media screen and (max-width: 700px) {
            padding-top: 32px
        }

        .dashboard, .networks {
            display: flex;
            padding: var(--length-padding-s) var(--length-padding-base);
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

            .la, .las, .lab {
                font-size: 1.55rem;
            }
        }

        .dashboard {
            position: absolute;
            top: 0;
            left: 0;
        }

        .networks {
            position: absolute;
            top: 0;
            right: 0;
        }
    }
}
</style>
