<template>
    <div class="options-bar">
        <UISelect
            v-model="sortField"
            class="select"
            :options="sortOptions"
        >
            Sort by:
        </UISelect>
        <UISelect
            v-model="sortDirection"
            class="select"
            :options="directionOptions"
        >
            Direction:
        </UISelect>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UISelect from "@/components/ui/Select.vue";
import router from "@/router";

export default defineComponent({
    name: "SearchOptions",
    components: { UISelect },
    data () {
        return {
            sortOptions: {
                popularity: "Popularity",
                releaseDate: "Release Date",
                lastUpdate: "Last Update",
                reviews: "Reviews",
                name: "Name",
                relevance: "Relevance"
            },
            directionOptions: {
                asc: "Ascending",
                desc: "Descending"
            },
            sortField: this.$route.query.sortField || "popularity",
            sortDirection: this.$route.query.sortDirection || "desc"
        };
    },
    watch: {
        sortField () {
            router.push({ name: "search", query: { ...this.$route.query, sortField: this.sortField } });
        },
        sortDirection () {
            router.push({ name: "search", query: { ...this.$route.query, sortDirection: this.sortDirection } });
        }
    }
});
</script>

<style scoped lang="scss">
.options-bar {
    margin-top: var(--length-margin-base);
    display: flex;

    width: calc(100vw - 20px);
    max-width: 600px;

    .select {
        margin: 0 var(--length-margin-base);
        flex-grow: 1;
        flex-basis: 50%;
        display: flex;
    }
}
</style>
