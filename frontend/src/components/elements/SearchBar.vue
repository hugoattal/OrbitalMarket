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
import { useRoute } from "vue-router";
import { ref, watch } from "vue";
import ThemeSwitcher from "@/components/theme/Switcher.vue";
import Button from "@/components/ui/Button.vue";
import router from "@/router";
import UIInput from "@/components/ui/Input.vue";

const route = useRoute();
const searchText = ref(route.query.searchText || "");

function search () {
    router.push({ name: "search", query: { ...route.query, searchText: searchText.value } });
}

watch(() => route.query.searchText, () => {
    searchText.value = route.query.searchText || "";
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
