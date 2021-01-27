<template>
    <article
        class="product"
        @click="showModal = true"
    >
        <div class="marketplace-link">
            <a
                :href="marketplaceLink"
                target="_blank"
                @click.stop
            >
                <i class="las la-external-link-alt" />
            </a>
        </div>
        <Box3D
            :background="product.pictures.thumbnail[0]"
            class="box"
        />
        <div class="content">
            <div class="title">
                {{ product.title }}
            </div>
            <div class="rating-wrapper">
                <UIRating
                    class="stars"
                    :rating="parseFloat(product.computed.score.meanRating)"
                    :has-ratings="!!product.computed.score.totalRatings"
                />
                <div class="total">
                    ({{ product.computed.score.totalRatings || 0 }})
                </div>
            </div>
            <div class="price">
                {{ displayPrice(product.price.value) }}
            </div>
            <div class="info">
                <p><span class="category">Released:</span> {{ displayDate(product.releaseDate) }}</p>
                <p><span class="category">Last update:</span> {{ displayDate(product.computed.lastUpdate) }}</p>
            </div>
        </div>
    </article>
    <UIModal v-model="showModal">
        <ProductModal :product-id="product._id" />
    </UIModal>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { ISearchProduct } from "@/services/search.service";
import UIRating from "@/components/ui/Rating.vue";
import Box3D from "@/components/ui/Box3D.vue";
import UIModal from "@/components/ui/Modal.vue";
import ProductModal from "@/components/product/Modal.vue";
import { displayDate, displayPrice } from "@/components/product/product";

export default defineComponent({
    name: "ProductCard",
    components: { ProductModal, UIModal, Box3D, UIRating },
    props: {
        product: {
            type: Object as PropType<ISearchProduct>,
            required: true
        }
    },
    setup () {
        return { displayDate, displayPrice };
    },
    data () {
        return {
            showModal: false
        };
    },
    computed: {
        marketplaceLink () {
            return `https://www.unrealengine.com/marketplace/product/${this.product.slug}`;
        }
    }
});
</script>

<style scoped lang="scss">
.product {
    height: 270px;
    border-radius: var(--length-radius-base);
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 10px var(--color-shadow);
    background: var(--color-content-background);
    border: 1px solid var(--color-content-light);
    cursor: pointer;
    transition: transform var(--duration-fast), border-color var(--duration-fast);

    .marketplace-link {
        position: absolute;
        top: 0;
        right: 0;

        a {
            display: inline-block;
            padding: var(--length-padding-s);
            color: var(--color-content-50);

            &:hover {
                color: var(--color-primary);
            }
        }
    }

    .box {
        margin: auto;
    }

    &:hover {
        transform: scale(1.05);
        border-color: var(--color-primary);

        :deep(.scene .box) {
            transform: translate3d(0px, 25px, 0) rotate3d(0, 1, 0, 15deg);
        }
    }

    .content {
        position: relative;
        z-index: 1;

        .title {
            font-size: var(--size-title);
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding: 0 var(--length-padding-l);
        }

        .rating-wrapper {
            padding: var(--length-padding-s) var(--length-padding-l);
            box-sizing: border-box;
            font-size: 75%;

            .stars {
                display: inline-block;
            }

            .total {
                padding: 0 var(--length-padding-base);
                display: inline-block;
                opacity: 0.5;
            }
        }

        .price {
            text-align: right;
            padding: 0 var(--length-padding-l);
            font-weight: bold;
        }
    }

    .info {
        font-size: 75%;
        padding: var(--length-padding-s) var(--length-padding-l);

        p {
            margin: 0;
            padding: var(--length-padding-xs) 0;
        }

        .category {
            opacity: 0.5;
        }
    }
}

</style>
