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

<script lang="ts">
import { defineComponent } from "vue";
import UISelect from "@/components/ui/Select.vue";
import router from "@/router";

export default defineComponent({
    name: "SearchOptions",
    components: { UISelect },
    data () {
        return {
            directionOptions: {
                asc: "Ascending",
                desc: "Descending"
            },
            sortDirection: this.$route.query.sortDirection || "desc",
            sortField: this.$route.query.sortField || "popularity",
            sortOptions: {
                name: "Name",
                popularity: "Popularity",
                releaseDate: "Release Date",
                reviews: "Reviews"
            }
        };
    },
    watch: {
        "$route.query.sortField": {
            handler () {
                this.sortField = this.$route.query.sortField || "popularity";
            }
        },
        sortDirection () {
            router.push({ name: "search", query: { ...this.$route.query, sortDirection: this.sortDirection } });
        },
        sortField () {
            router.push({ name: "search", query: { ...this.$route.query, sortField: this.sortField } });
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
