<template>
    <div class="options-bar">
        <UISelect
            v-model="sortField"
            class="select"
            label="Sort by"
            :options="sortOptions"
        />
        <UISelect
            v-model="sortDirection"
            class="select"
            label="Direction"
            :options="directionOptions"
        />
    </div>
</template>

<script setup lang="ts">
import UISelect from "@/components/ui/Select.vue";
import { useRouteQuery } from "@vueuse/router";
import { ref, watch } from "vue";

const sortField = ref("popularity");
const sortDirection = ref("desc");

const fieldQuery = useRouteQuery<string | null>("sortField");
const directionQuery = useRouteQuery<string | null>("sortDirection");

if (fieldQuery.value) {
    sortField.value = fieldQuery.value;
}

if (directionQuery.value) {
    sortDirection.value = directionQuery.value;
}

const directionOptions = {
    asc: "Ascending",
    desc: "Descending"
};

const sortOptions = {
    name: "Name",
    popularity: "Popularity",
    price: "Price",
    releaseDate: "Release Date",
    reviews: "Reviews"
};

watch(sortField, () => {
    if (sortField.value === "popularity") {
        fieldQuery.value = null;
        return;
    }

    fieldQuery.value = sortField.value;
});

watch(sortDirection, () => {
    if (sortDirection.value === "desc") {
        directionQuery.value = null;
        return;
    }

    directionQuery.value = sortDirection.value;
});
</script>

<style scoped lang="scss">
.options-bar {
    margin-top: var(--length-margin-base);
    display: flex;

    width: calc(100vw - 20px);
    max-width: 600px;

    @media screen and (max-width: 500px) {
        flex-direction: column;
    }

    .select {
        margin: 0 var(--length-margin-base);
        flex-grow: 1;
        flex-basis: 50%;
        display: flex;

        @media screen and (max-width: 500px) {
            flex-basis: 0;
            margin-bottom: var(--length-margin-base);

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>
