<template>
    <div class="product">
        <Box3D
            :background="product.pictures.thumbnail[0]"
            class="box"
        />
        <div class="content">
            <div class="title">
                {{ product.title }}
            </div>
            <div class="rating-wrapper">
                <Rating
                    class="stars"
                    :rating="product.computed.score.meanRating"
                    :has-ratings="!!product.computed.score.totalRatings"
                />
                <div class="total">
                    ({{ product.computed.score.totalRatings || 0 }})
                </div>
            </div>
            <div class="price">
                {{ displayPrice(product.price.value) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ISearchProduct } from "@/services/search.service";
import Rating from "@/components/ui/Rating.vue";
import Box3D from "@/components/ui/Box3D.vue";

export default defineComponent({
    name: "ProductCard",
    components: { Box3D, Rating },
    props: {
        product: {
            type: Object as PropType<ISearchProduct>,
            required: true
        }
    },
    methods: {
        displayPrice (price) {
            return `${(price / 100).toFixed(2)} €`;
        }
    }
});
</script>

<style scoped lang="scss">
.product {
    height: 220px;
    border-radius: var(--length-radius-base);
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 5px var(--color-shadow);
    background: var(--color-light);
    cursor: pointer;

    .box {
        margin: auto;
    }

    &:hover .background {
        opacity: 0.8;
    }

    .content {
        position: relative;
        z-index: 1;

        .title {
            font-size: var(--size-title);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-left: var(--length-padding-l);
        }

        .rating-wrapper {
            padding: var(--length-padding-s) var(--length-padding-l);
            box-sizing: border-box;
            font-size: 12px;
        }

        .stars {
            display: inline-block;
        }

        .total {
            padding: 0 var(--length-padding-base);
            display: inline-block;
            opacity: 0.5;
        }

        .price {
            text-align: right;
            padding: 0 var(--length-padding-l);
            font-weight: bold;
        }
    }
}

</style>
