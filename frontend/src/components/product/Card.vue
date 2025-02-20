<template>
    <a
        class="card-link"
        :href="`/product/${product.meta.fabId}`"
        @click.prevent="showModal = true"
    >
        <article
            class="product"
            :class="{boost: product.computed.isBoosted, favorite: configStore.favSet.has(product.meta.fabId), [configStore.displayType]: true}"
        >
            <Box3D
                v-if="configStore.displayType === 'box'"
                :background="product.media.thumbnail"
                class="box"
            />
            <img
                v-else
                alt="thumbnail"
                class="thumbnail"
                :src="product.media.thumbnail"
            >
            <div class="icons">
                <div class="left">
                    <a
                        class="expand-link icon"
                        :href="`/product/${product.meta.fabId}`"
                        target="_blank"
                        @click.stop.prevent="goToProductPage"
                    >
                        <i class="las la-expand" />
                    </a>
                </div>
                <div class="right">
                    <ProductCardWish
                        class="wishlist icon"
                        :product-id="product.meta.fabId"
                    />
                    <div
                        v-if="product.computed.isBoosted"
                        class="boost icon"
                        @click.stop
                    >
                        <i class="las la-meteor" />
                        <div class="tooltip">
                            This product support the <b>Orbital Market</b> by adding a link in its description.
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <div
                    class="title"
                    :title="product.title"
                >
                    {{ categoryEmoji }} {{ product.title }}
                </div>
                <div class="rating-wrapper">
                    <UIRating
                        class="stars"
                        :has-ratings="!!product.review.count"
                        :rating="product.review.rating"
                    />
                    <div class="total">
                        ({{ product.review.count || 0 }})
                    </div>
                </div>
                <div
                    v-if="isDiscounted"
                    class="price"
                >
                    <span class="old">{{ displayPrice(product.price.value) }}</span>
                    {{ displayPrice(product.price.value * (1 - product.discount / 100)) }}

                    <div class="discount">
                        -{{ product.discount }}%
                    </div>
                </div>
                <div
                    v-else
                    class="price"
                >
                    {{ displayPrice(product.price.value) }}
                </div>
                <div class="info">
                    <p>
                        <span class="type">Released:</span> {{ displayDate(product.releaseDate) }}</p>
                    <p>
                        <span class="type">Engine version:</span> {{ displayEngineVersion(product.engine) }}
                    </p>
                    <p>
                        <span class="type">by </span> <RouterLink
                            :to="authorLink"
                            @click.stop
                        >
                            {{ product.owner.name }}
                        </RouterLink>
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
export default {
    name: "ProductCard"
};
</script>

<script setup lang="ts">
import { computed, ref } from "vue";
import { ISearchProduct } from "@/services/search.service";
import UIRating from "@/components/ui/Rating.vue";
import Box3D from "@/components/ui/Box3D.vue";
import UIModal from "@/components/ui/Modal.vue";
import ProductModal from "@/components/product/Modal.vue";
import {
    displayCategoryEmoji,
    displayDate,
    displayEngineVersion,
    displayPrice
} from "@/components/product/product";
import router from "@/router";
import { useConfigStore } from "@/stores/config";
import ProductCardWish from "@/components/product/CardWish.vue";

const props = defineProps<{
    product: ISearchProduct;
}>();

const configStore = useConfigStore();

const showModal = ref(false);

const categoryEmoji = computed(() => {
    const categoryPath = props.product.category;
    return displayCategoryEmoji(categoryPath || "Unknown");
});

const isDiscounted = computed(() => {
    return props.product.discount && props.product.discount > 0 && props.product.price.value > 0;
});

const authorLink = computed(() => {
    const urlSearchParams = new URLSearchParams();

    const author = props.product.owner.name.includes(" ") ? `"${ props.product.owner.name }"` : props.product.owner.name;

    urlSearchParams.set("searchText", `author:${ author }`);

    return `/search?${ urlSearchParams.toString() }`;
});

function goToProductPage() {
    router.push({ name: "product", params: { slug: props.product.meta.fabId } });
}
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
            aspect-ratio: 16 / 9;
        }

        .icons {
            opacity: 0;

            .left {
                border-top-left-radius: var(--length-radius-base);
                border-bottom-right-radius: var(--length-radius-base);
                background: var(--color-content-background);
            }

            .right {
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
        height: 80px;
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

    &.favorite {
        border-color: var(--color-content-highlight);
        box-shadow: inset 0 0 64px var(--color-gold-transparent);
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
        align-items: flex-start;
    }

    .expand-link {
        display: inline-block;
        color: var(--color-content-30);

        &:hover {
            color: var(--color-primary);
        }
    }

    .boost {
        position: relative;
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

    .icon {
        padding: var(--length-padding-base);
        color: var(--color-content-30);
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            a {
                color: var(--color-primary);

                &:hover {
                    text-decoration: underline;
                }
            }
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
