<template>
    <div class="display-bar">
        <DisplayBar v-model="displayType" />
    </div>
    <ul
        class="results"
        :class="displayType"
    >
        <li
            v-for="product in products"
            :key="product._id"
        >
            <ProductCard
                :product="product"
                :display-type="displayType"
            />
        </li>
        <li v-if="isMoreProducts">
            <Observer @intersect="loadNext" />
        </li>
    </ul>
    <div
        v-if="isMoreProducts"
        class="loading"
    >
        <Spinner />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchService, { ISearchProduct } from "@/services/search.service";
import ProductCard from "@/components/product/Card.vue";
import Observer from "@/components/elements/Observer.vue";
import Spinner from "@/components/ui/Spinner.vue";
import DisplayBar from "@/components/pages/search/DisplayBar.vue";

export default defineComponent({
    name: "SearchResults",
    components: { DisplayBar, Spinner, Observer, ProductCard },
    data () {
        return {
            products: [] as Array<ISearchProduct>,
            isLoading: true,
            isMoreProducts: true,
            page: 0,
            displayType: ""
        };
    },
    computed: {
        params () {
            const params = this.$route.query || {};
            params.limit = 24;
            params.skip = 24 * this.page;
            return params;
        }
    },
    watch: {
        "$route.query": {
            immediate: true,
            async handler () {
                this.page = 0;
                this.products = await SearchService.query(this.params);
                this.isMoreProducts = (this.products.length === 24);
                this.isLoading = false;
            }
        }
    },
    methods: {
        async loadNext () {
            if (!this.isLoading) {
                this.isLoading = true;
                this.page++;
                const nextProducts = await SearchService.query(this.params);
                this.isLoading = false;

                if (nextProducts.length === 0) {
                    this.isMoreProducts = false;
                }
                else {
                    this.products.push(...nextProducts);
                }
            }
        }
    }
});
</script>

<style scoped lang="scss">
.display-bar {
    padding: var(--length-padding-xl);
    padding-bottom: 0;
}

.results {
    padding: var(--length-padding-xl);
    display: grid;
    margin: 0;

    &.box, &.square {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: var(--length-margin-l);
    }

    &.list {
        gap: var(--length-margin-base);
    }

    li {
        list-style-type: none;
    }
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    font-size: 50px;
}
</style>
