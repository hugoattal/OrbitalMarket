<template>
    <article
        class="product"
        :class="{boost: product.computed.isBoosted, [displayType]: true}"
        @click="showModal = true"
    >
        <Box3D
            v-if="displayType === 'box'"
            :background="product.pictures.thumbnail[0]"
            class="box"
        />
        <img
            v-else
            class="thumbnail"
            :src="product.pictures.thumbnail[0]"
            alt="thumbnail"
        >
        <div class="icons">
            <div class="expand-link">
                <a
                    target="_blank"
                    :href="`/product/${product.slug}`"
                    @click.stop.prevent="goToProductPage"
                >
                    <i class="las la-expand" />
                </a>
            </div>
            <div
                v-if="product.computed.isBoosted"
                class="boost-icon"
            >
                <i class="las la-meteor" />
                <div class="tooltip">
                    This product support the <b>Orbital Market</b> by adding a link in his description.
                </div>
            </div>
        </div>
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
        <ProductModal
            :product-id="product._id"
            @expand="goToProductPage"
            @close="showModal = false"
        />
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
import router from "@/router";

export default defineComponent({
    name: "ProductCard",
    components: { ProductModal, UIModal, Box3D, UIRating },
    props: {
        product: {
            type: Object as PropType<ISearchProduct>,
            required: true
        },
        displayType: {
            type: String,
            validator: (value) => ["box", "square", "list"].includes(value),
            default: "box"
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
    },
    methods: {
        goToProductPage () {
            router.push({ name: "product", params: { slug: this.product.slug } });
        }
    }
});
</script>

<style scoped lang="scss">
.product {
    border-radius: var(--length-radius-base);
    position: relative;
    box-shadow: 0 0 10px var(--color-shadow);
    background: var(--color-content-background);
    border: 1px solid var(--color-content-light);
    cursor: pointer;
    transition: transform var(--duration-fast), border-color var(--duration-fast);

    &.box {
        height: 270px;
    }

    &.square {
        padding-bottom: var(--length-padding-base);

        .thumbnail {
            border-top-left-radius: var(--length-radius-base);
            border-top-right-radius: var(--length-radius-base);
            border-bottom: 1px solid var(--color-content-light);
            width: 100%;
            margin-bottom: var(--length-margin-xs);
        }

        .icons {
            opacity: 0;
            transition: opacity var(--duration-fast);

            .expand-link {
                border-top-left-radius: var(--length-radius-base);
                border-bottom-right-radius: var(--length-radius-base);
                background: var(--color-content-background);
            }

            .boost-icon {
                border-top-right-radius: var(--length-radius-base);
                border-bottom-left-radius: var(--length-radius-base);
                background: var(--color-content-background);
            }
        }

        &:hover .icons {
            opacity: 1;
        }
    }

    &.list {
        display: flex;
        height: 60px;
        position: relative;
        right: 0;
        left: 0;
        max-width: calc(100vw - 2 * var(--length-margin-l) - 2 * var(--length-padding-base));

        .icons {
            flex-shrink: 0;
            position: static;
            width: 100px;
            justify-content: left;
            height: 100%;
            display: flex;
            align-items: center;
            padding-left: var(--length-padding-base);
        }

        .thumbnail {
            height: 100%;
            border-top-left-radius: var(--length-radius-base);
            border-bottom-left-radius: var(--length-radius-base);
        }

        .content {
            display: flex;
            flex-grow: 1;
            align-items: center;
            min-width: 0;

            .title {
                flex-grow: 1;
                flex-shrink: 1;
                font-size: 140%;
            }

            .rating-wrapper {
                width: 140px;
                flex-shrink: 0;
            }

            .price {
                width: 70px;
                flex-shrink: 0;
            }

            .info {
                width: 140px;
                flex-shrink: 0;
            }
        }

        &:hover {
            transform: none;
        }
    }

    &.boost {
        border-color: var(--color-content-highlight);
    }

    &:hover {
        z-index: 1;
        transform: scale(1.05);
        border-color: var(--color-primary);

        :deep(.scene .box) {
            transform: translate3d(0px, 25px, 0) rotate3d(0, 1, 0, 15deg);
        }
    }

    .icons {
        position: absolute;
        z-index: 2;
        top: 0;
        right: 0;
        left: 0;
        display: flex;
        justify-content: space-between;
    }

    .expand-link {
        a {
            display: inline-block;
            padding: var(--length-padding-base);
            color: var(--color-content-50);

            &:hover {
                color: var(--color-primary);
            }
        }
    }

    .boost-icon {
        position: relative;
        padding: var(--length-padding-base);
        color: var(--color-primary);

        &:hover .tooltip {
            display: block;
        }

        .tooltip {
            display: none;
            position: absolute;
            top: 38px;
            left: calc(50% - 80px);
            z-index: 1000;
            font-size: 80%;
            width: 160px;
            background: var(--color-background);
            padding: var(--length-padding-s);
            border-radius: var(--length-radius-base);
            color: var(--color-content);
            border: 1px solid var(--color-primary);
            box-sizing: border-box;
        }
    }

    .box {
        margin: auto;
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
