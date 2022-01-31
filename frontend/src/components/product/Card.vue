<template>
    <a
        class="card-link"
        :href="`/product/${product.slug}`"
        @click.prevent="showModal = true"
    >
        <article
            class="product"
            :class="{boost: product.computed.isBoosted, [displayType]: true}"
        >
            <Box3D
                v-if="displayType === 'box'"
                :background="product.pictures.thumbnail[0]"
                class="box"
            />
            <img
                v-else
                alt="thumbnail"
                class="thumbnail"
                :src="product.pictures.thumbnail[0]"
            >
            <div class="icons">
                <div class="expand-link">
                    <a
                        :href="`/product/${product.slug}`"
                        target="_blank"
                        @click.stop.prevent="goToProductPage"
                    >
                        <i class="las la-expand" />
                    </a>
                </div>
                <div
                    v-if="product.computed.isBoosted"
                    class="boost-icon"
                    @click.stop
                >
                    <i class="las la-meteor" />
                    <div class="tooltip">
                        This product support the <b>Orbital Market</b> by adding a link in his description.
                    </div>
                </div>
            </div>
            <div class="content">
                <div
                    class="title"
                    :title="product.title"
                >
                    {{ product.title }}
                </div>
                <div class="rating-wrapper">
                    <UIRating
                        class="stars"
                        :has-ratings="!!product.computed.score.totalRatings"
                        :rating="parseFloat(product.computed.score.meanRating)"
                    />
                    <div class="total">
                        ({{ product.computed.score.totalRatings || 0 }})
                    </div>
                </div>
                <div
                    v-if="isDiscounted"
                    class="price"
                >
                    <span class="old">{{ displayPrice(product.price.value) }}</span>
                    {{ displayPrice(product.price.value * (1 - product.discount.value / 100)) }}

                    <div class="discount">
                        -{{ product.discount.value }}%
                    </div>
                </div>
                <div
                    v-else
                    class="price"
                >
                    {{ displayPrice(product.price.value) }}
                </div>
                <div class="info">
                    <p><span class="type">Released:</span> {{ displayDate(product.releaseDate) }}</p>
                    <p><span class="type">Engine version:</span> {{ displayEngineVersion(product.computed.engine) }}
                    </p><p><span class="type">Category:</span> <span class="category">{{ category }}</span>
                    </p>
                </div>
            </div>
        </article>
    </a>
    <UIModal v-model="showModal">
        <ProductModal
            :product-id="product._id"
            :product-slug="product.slug"
            @close="showModal = false"
            @expand="goToProductPage"
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
import { displayDate, displayPrice, displayEngineVersion, displayCategory } from "@/components/product/product";
import router from "@/router";

export default defineComponent({
    name: "ProductCard",
    components: { Box3D, ProductModal, UIModal, UIRating },
    props: {
        displayType: {
            type: String,
            default: "square",
            validator: (value: string) => ["box", "square", "list"].includes(value)
        },
        product: {
            type: Object as PropType<ISearchProduct>,
            required: true
        }
    },
    setup () {
        return { displayDate, displayEngineVersion, displayPrice };
    },
    data () {
        return {
            showModal: false
        };
    },
    computed: {
        category() {
            const categoryPath = this.product.category?.path[1];
            return displayCategory(categoryPath || "Unknown");
        },
        isDiscounted () {
            return this.product.discount.value > 0 && this.product.price.value > 0;
        },
        marketplaceLink () {
            return `https://www.unrealengine.com/marketplace/product/${ this.product.slug }`;
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
.card-link {
    display: block;
}

.product {
    border-radius: var(--length-radius-base);
    position: relative;
    box-shadow: 0 0 10px var(--color-shadow);
    background: var(--color-content-background);
    border: 1px solid var(--color-content-light);
    cursor: pointer;

    &.box {
        padding-bottom: var(--length-padding-base);
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
            justify-content: flex-start;
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

            .price {
                .discount {
                    position: static;
                }
            }

            .title {
                flex-grow: 1;
                flex-shrink: 1;
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

        @media screen and (max-width: 800px) {
            height: 120px;

            .icons {
                flex-direction: column;
                width: 32px;
            }

            .content {
                flex-direction: column;
                align-items: flex-start;

                .price {
                    display: flex;
                    gap: var(--length-padding-base);
                    .discount {
                        padding-top: 0;
                        padding-bottom: 0;
                    }
                }

                .title {
                    width: 100%;
                }
            }
        }
    }

    &.boost {
        border-color: var(--color-content-highlight);
        box-shadow: inset 0 0 64px var(--color-primary-transparent);
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

            .old {
                text-decoration: line-through;
                opacity: 0.25;
            }

            .discount {
                background: var(--color-primary);
                display: inline-block;
                padding: var(--length-padding-xs) var(--length-padding-l) var(--length-padding-xs) var(--length-padding-s);
                clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
                position: absolute;
                left: 0;
                box-shadow: 0 0 12px var(--color-shadow);
            }
        }
    }

    .info {
        font-size: 75%;
        padding: var(--length-padding-s) var(--length-padding-l);

        p {
            margin: 0;
            padding: var(--length-padding-xs) 0;
        }

        .type {
            opacity: 0.5;
        }

        .category {
            text-transform: capitalize;
        }
    }
}

</style>
