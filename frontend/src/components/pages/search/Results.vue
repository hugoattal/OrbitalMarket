<template>
    <ul class="results">
        <li
            v-for="product in produts"
            :key="product._id"
        >
            <ProductCard
                :product="product"
            />
        </li>
    </ul>
    <div
        v-if="isMoreProducts"
        class="loading"
    >
        <Observer @intersect="loadNext" />
        <i class="las la-circle-notch" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchService, { ISearchProduct } from "@/services/search.service";
import ProductCard from "@/components/product/Card.vue";
import Observer from "@/components/elements/Observer.vue";

export default defineComponent({
    name: "SearchResults",
    components: { Observer, ProductCard },
    data () {
        return {
            produts: [] as Array<ISearchProduct>,
            isLoading: true,
            isMoreProducts: true,
            page: 0
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
                this.produts = await SearchService.query(this.params);
                this.isMoreProducts = (this.produts.length === 24);
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
                    this.produts.push(...nextProducts);
                }
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
    margin: 0;

    li {
        list-style-type: none;
    }
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;

    .las {
        opacity: 0.5;
        font-size: 50px;
        animation: rotating 2s linear infinite;
    }

    @keyframes rotating {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
}
</style>
