<template>
    <div class="product-description">
        <h1>{{ product.title }}</h1>
        <div class="product-header">
            <div class="screen-panel">
                <UISlideshow :slides="product.pictures.screenshot" />
            </div>
            <div class="description-panel">
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
                <p class="description-short">
                    {{ product.description.short }}
                </p>
                <div class="info">
                    <p><span class="category">Released:</span> {{ displayDate(product.releaseDate) }}</p>
                    <p><span class="category">Last update:</span> {{ displayDate(product.computed.lastUpdate) }}</p>
                    <p><span class="category">Engine Version:</span> {{ displayEngineVersion(product.computed.engine) }}</p>
                </div>
                <UIButton
                    :href="marketplaceLink"
                    target="_blank"
                    class="link"
                >
                    Unreal Marketplace <i class="las la-external-link-alt" />
                </UIButton>
                <UIButton
                    :href="launcherLink"
                    target="_blank"
                    class="link"
                >
                    Epic Launcher <i class="las la-external-link-alt" />
                </UIButton>
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
            </UITabs>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductService, { IProduct } from "@/services/product.service";
import UIButton from "@/components/ui/Button.vue";
import UISlideshow from "@/components/ui/Slideshow.vue";
import UIRating from "@/components/ui/Rating.vue";
import { displayDate, displayPrice, displayEngineVersion } from "@/components/product/product";
import UITabs from "@/components/ui/Tabs.vue";
import UITab from "@/components/ui/Tab.vue";

export default defineComponent({
    name: "ProductDescription",
    components: { UITab, UITabs, UIRating, UISlideshow, UIButton },
    props: {
        productId: {
            type: String,
            required: true
        }
    },
    async setup (props) {
        const product = await ProductService.getById(props.productId) as IProduct;

        return { displayDate, displayPrice, displayEngineVersion, product };
    },
    computed: {
        marketplaceLink (): string {
            return `https://www.unrealengine.com/marketplace/product/${this.product.slug}`;
        },
        launcherLink (): string {
            return `com.epicgames.launcher://ue/marketplace/product/${this.product.slug}`;
        }
    }
});
</script>

<style scoped lang="scss">

h1 {
    font-size: 200%;
    margin: 0;
    padding-bottom: var(--length-padding-l);
}

.product-description {
    padding: 0 var(--length-padding-xl);
}

.product-header {
    display: flex;
    gap: var(--length-padding-xl);

    @media screen and (max-width: 600px) {
        flex-direction: column;
    }

    .screen-panel {
        flex-basis: 50%;
    }

    .description-panel {
        flex-basis: 50%;
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
    }

    .description-short, .link {
        margin: var(--length-margin-base) 0;
    }

    .link {
        padding-left: var(--length-padding-xl);

        .las {
            opacity: 0.5;
        }
    }

    .info {
        padding: var(--length-padding-s) 0;

        p {
            margin: 0;
            padding: var(--length-padding-xs) 0;
        }

        .category {
            opacity: 0.5;
        }
    }

    .la-external-link-alt {
        padding-left: var(--length-padding-base);
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
