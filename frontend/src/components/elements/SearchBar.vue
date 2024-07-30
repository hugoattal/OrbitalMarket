<template>
    <div class="search-bar">
        <UIInput
            ref="search-input"
            v-model="searchText"
            autofocus
            class="search-input"
            prefix-icon="la-satellite-dish"
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

export default {
    name: "LandingSearchBar"
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import ThemeSwitcher from "@/components/theme/Switcher.vue";
import Button from "@/components/ui/Button.vue";
import UIInput from "@/components/ui/Input.vue";
import { useRouteQuery } from "@vueuse/router";
import { useRouter } from "vue-router";

const searchQuery = useRouteQuery<string | null>("searchText");
const searchText = ref(searchQuery.value || "");
const router = useRouter();

function search () {
    if (router.currentRoute.value.name === "landing") {
        router.push({ name: "search", query: { searchText: searchText.value } });
    }

    if (!searchText.value) {
        searchQuery.value = null;
        return;
    }

    searchQuery.value = searchText.value;
}
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
