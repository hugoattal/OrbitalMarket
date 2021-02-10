<template>
    <div class="search-bar">
        <UIInput
            ref="search-input"
            v-model="searchText"
            class="search-input"
            prefix-icon="la-satellite-dish"
            autofocus
            @validate="search"
        >
            <template #append>
                <Button
                    class="search-button"
                    @click="search"
                >
                    Search
                </Button>
            </template>
        </UIInput>
        <ThemeSwitcher />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThemeSwitcher from "@/components/theme/Switcher.vue";
import Button from "@/components/ui/Button.vue";
import router from "@/router";
import UIInput from "@/components/ui/Input.vue";

export default defineComponent({
    name: "LandingSearchBar",
    components: { UIInput, Button, ThemeSwitcher },
    data () {
        return {
            searchText: this.$route.query.searchText || ""
        };
    },
    methods: {
        search () {
            const query = { ...this.$route.query };

            if (this.searchText) {
                query.searchText = this.searchText;
                query.sortField = "relevance";
            }

            router.push({ name: "search", query });
        }
    }
});
</script>

<style scoped lang="scss">
.search-bar {
    display: flex;
    width: calc(100vw - 20px);
    max-width: 600px;

    & > * {
        margin: 0 var(--length-margin-base);
    }

    .search-input {
        flex-grow: 1;

        .las {
            padding-right: var(--length-padding-base);
            color: var(--color-primary);
        }
    }
}
</style>
