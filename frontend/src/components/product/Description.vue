<template>
    <div class="product-description">
        <h1>
            {{ product.title }} - <RouterLink :to="authorLink">
                {{ product.owner.name }}
            </RouterLink>
        </h1>
        <div class="product-header">
            <div class="screen-panel">
                <UISlideshow
                    class="slideshow"
                    :slides="slides"
                />ri
            </div>
            <div class="description-panel">
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
                <p class="description-short">
                    {{ product.description.short }}
                </p>
                <div class="info">
                    <p><span class="type">Released:</span> {{ displayDate(product.releaseDate) }}</p>
                    <p>
                        <span class="type">Engine Version:</span> {{ displayEngineVersion(product.computed.engine) }}
                    </p>
                    <p>
                        <span class="type">Engine Version:</span> <span class="category">{{ category }}</span>
                    </p>
                </div>
                <div class="links">
                    <UIButton
                        class="link"
                        :href="marketplaceLink"
                        target="_blank"
                    >
                        <span>Unreal Marketplace <i class="las la-external-link-alt" /></span>
                    </UIButton>
                    <UIButton
                        class="link"
                        :href="launcherLink"
                        target="_blank"
                    >
                        <span>Epic Launcher <i class="las la-external-link-alt" /></span>
                    </UIButton>
                    <div class="group">
                        <UIButton
                            class="link"
                            :href="marketplaceLink + '/reviews'"
                            target="_blank"
                        >
                            <span>Reviews <i class="las la-external-link-alt" /></span>
                        </UIButton>
                        <UIButton
                            class="link"
                            :href="marketplaceLink + '/questions'"
                            target="_blank"
                        >
                            <span>Questions <i class="las la-external-link-alt" /></span>
                        </UIButton>
                    </div>
                </div>
            </div>
        </div>
        <div class="product-details">
            <UITabs>
                <UITab>
                    <template #title>
                        Detailed description
                    </template>
                    <template #content>
                        <div v-html="product.description.long" />
                    </template>
                </UITab>
                <UITab>
                    <template #title>
                        Technical description
                    </template>
                    <template #content>
                        <div v-html="product.description.technical" />
                    </template>
                </UITab>
                <UITab>
                    <template #title>
                        Price history
                    </template>
                    <template #content>
                        <ProductHistory :history="product.price.history" />
                    </template>
                </UITab>
            </UITabs>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "ProductDescription"
};
</script>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import ProductService, { IProduct } from "@/services/product.service";
import UIButton from "@/components/ui/Button.vue";
import UISlideshow from "@/components/ui/slideshow/Slideshow.vue";
import UIRating from "@/components/ui/Rating.vue";
import { displayDate, displayPrice, displayEngineVersion, displayCategory } from "@/components/product/product";
import UITabs from "@/components/ui/Tabs.vue";
import UITab from "@/components/ui/Tab.vue";
import ProductHistory from "@/components/product/History.vue";

const props = defineProps<{
    productId: string;
}>();

const product = await ProductService.getById(props.productId) as IProduct;
const savedPageTitle = ref("");

onMounted(() => {
    savedPageTitle.value = document.title;
    document.title = product.title;
});

onUnmounted(() => {
    document.title = savedPageTitle.value;
});

const category = computed(() => {
    const categoryPath = product.category?.path[1];
    return displayCategory(categoryPath || "Unknown");
});

const isDiscounted = computed(() => product.discount.value > 0 && product.price.value > 0);
const launcherLink = computed(() => `com.epicgames.launcher://ue/marketplace/product/${ product.slug }`);
const marketplaceLink = computed(() => `https://www.unrealengine.com/marketplace/product/${ product.slug }`);
const authorLink = computed(() => {
    const urlSearchParams = new URLSearchParams();

    const author = product.owner.name.includes(" ") ? `"${ product.owner.name }"` : product.owner.name;

    urlSearchParams.set("searchText", `author:${ author }`);

    return `/search?${ urlSearchParams.toString() }`;
});

const slides = computed<Array<string>>(() => {
    if (product.computed.embeddedContent) {
        return [...product.computed.embeddedContent, ...product.pictures.screenshot];
    }
    else {
        return product.pictures.screenshot;
    }
});
</script>

<style scoped lang="scss">

h1 {
    font-size: 200%;
    margin: 0;

    a {
        color: var(--color-primary);

        &:hover {
            text-decoration: underline;
        }
    }
}

.product-description {
    padding: 0 var(--length-padding-xl);
    display: flex;
    flex-direction: column;
    gap: var(--length-gap-l);

}

.product-header {
    display: flex;
    gap: var(--length-padding-xl);

    @media screen and (max-width: 600px) {
        flex-direction: column;
    }

    .screen-panel {
        flex-grow: 1;
        flex-shrink: 1;
        min-width: 0;

        .slideshow {
            width: 100%;
            height: 100%;
            overflow: hidden;
        }
    }

    .description-panel {
        flex-grow: 0;
        flex-shrink: 0;
        width: 380px;
        max-width: 100%;
    }

    .rating-wrapper {
        box-sizing: border-box;
        font-size: 150%;

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
        font-weight: bold;
        font-size: 200%;
        position: relative;
        margin: var(--length-margin-s) 0;

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

    .description-short {
        margin: var(--length-margin-base) 0;
    }

    .links {
        margin: var(--length-margin-base) 0;
        display: flex;
        flex-direction: column;
        gap: var(--length-gap-m);
        align-items: stretch;
    }

    .group {
        display: flex;
        gap: var(--length-gap-m);

        .link {
            flex-basis: 50%;
        }
    }

    .link span {
        position: relative;

        .las {
            font-size: 1rem;
            opacity: 0.5;
            position: absolute;
            right: -20px;
            top: 2px;
        }
    }

    .info {
        padding: var(--length-padding-s) 0;

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

    .la-external-link-alt {
        padding-left: var(--length-padding-s);
    }
}

.product-details {
    margin-bottom: var(--length-margin-l);

    :deep(p) {
        margin: var(--length-margin-s) 0;
    }

    :deep(a) {
        color: var(--color-primary);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
