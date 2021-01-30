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
        v-if="isMoreProducts || isLoading"
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

const PRODUCT_PER_PAGE = 24;

export default defineComponent({
    name: "SearchResults",
    components: { DisplayBar, Spinner, Observer, ProductCard },
    data () {
        return {
            products: [] as Array<ISearchProduct>,
            isLoading: true,
            isMoreProducts: false,
            page: 0,
            displayType: ""
        };
    },
    computed: {
        params () {
            const params = this.$route.query || {};
            params.limit = PRODUCT_PER_PAGE;
            params.skip = PRODUCT_PER_PAGE * this.page;
            return params;
        }
    },
    watch: {
        "$route.query": {
            immediate: true,
            async handler () {
                this.page = 0;
                this.isMoreProducts = false;
                this.products = await SearchService.query(this.params);
                this.isMoreProducts = (this.products.length === PRODUCT_PER_PAGE);
                this.isLoading = false;
            }
        }
    },
    methods: {
        async loadNext () {
            if (!this.isLoading) {
                this.isMoreProducts = false;
                this.isLoading = true;
                this.page++;
                const nextProducts = await SearchService.query(this.params);
                this.isLoading = false;

                this.isMoreProducts = (nextProducts.length === PRODUCT_PER_PAGE);

                if (nextProducts.length > 0) {
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
