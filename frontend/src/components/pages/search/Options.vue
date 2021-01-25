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
            sortOptions: [
                { key: "popularity", value: "Popularity" },
                { key: "releaseDate", value: "Release Date" },
                { key: "lastUpdate", value: "Last Update" },
                { key: "reviews", value: "Reviews" },
                { key: "name", value: "Name" },
                { key: "relevance", value: "Relevance" }
            ],
            directionOptions: [
                { key: "asc", value: "Ascending" },
                { key: "desc", value: "Descending" }
            ],
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

    .select {
        margin: 0 var(--length-margin-base);
        width: 270px;
        display: flex;
    }
}
</style>
