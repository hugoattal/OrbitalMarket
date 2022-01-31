<template>
    <OptionsBar
        v-model="options"
        class="display-bar"
    />
    <ul
        class="results"
        :class="options.displayType"
    >
        <li
            v-for="product in products"
            :key="product._id"
        >
            <ProductCard
                :display-type="options.displayType"
                :product="product"
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
import OptionsBar from "@/components/pages/search/OptionsBar.vue";

const PRODUCT_PER_PAGE = 24;

export default defineComponent({
    name: "SearchResults",
    components: { Observer, OptionsBar, ProductCard, Spinner },
    data () {
        return {
            isLoading: true,
            isMoreProducts: false,
            options: {},
            page: 0,
            products: [] as Array<ISearchProduct>
        };
    },
    computed: {
        params () {
            const params = { ...this.$route.query } as Record<string, string|number>;
            params.limit = PRODUCT_PER_PAGE;
            params.skip = PRODUCT_PER_PAGE * this.page;

            if (this.options?.priceRange) {
                params.price = this.options.priceRange;
            }
            else {
                delete params.price;
            }

            if (this.options?.engineRange) {
                params.engine = this.options.engineRange;
            }
            else {
                delete params.engine;
            }

            if (this.options?.discounted) {
                params.discounted = this.options.discounted;
            }
            else {
                delete params.discounted;
            }

            if (this.options?.categories) {
                params.categories = this.options.categories;
            }
            else {
                delete params.categories;
            }

            return params;
        }
    },
    watch: {
        "$route.query": {
            async handler () {
                await this.sendQuery();
            },
            immediate: true
        },
        "options.categories": {
            async handler () {
                await this.sendQuery();
            }
        },
        "options.discounted": {
            async handler () {
                await this.sendQuery();
            }
        },
        "options.engineRange": {
            async handler () {
                await this.sendQuery();
            }
        },
        "options.priceRange": {
            async handler () {
                await this.sendQuery();
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
        },
        async sendQuery () {
            this.page = 0;
            this.isMoreProducts = false;
            this.products = await SearchService.query(this.params);
            this.isMoreProducts = (this.products.length === PRODUCT_PER_PAGE);
            this.isLoading = false;
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
