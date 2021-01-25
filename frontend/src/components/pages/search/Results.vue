<template>
    <div class="results">
        <ProductCard
            v-for="product in results"
            :key="product._id"
            :product="product"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchService from "@/services/search.service";
import ProductCard from "@/components/product/Card.vue";

export default defineComponent({
    name: "SearchResults",
    components: { ProductCard },
    data () {
        return {
            results: []
        };
    },
    watch: {
        "$route.query": {
            immediate: true,
            async handler () {
                this.results = await SearchService.query(this.$route.query || {});
            }
        }
    }
});
</script>

<style scoped lang="scss">
.results {
    padding: var(--length-padding-xl);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: var(--length-margin-l);
}
</style>
