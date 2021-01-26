<template>
    <div class="product-description">
        <div class="screen-panel">
            <UISlideshow :slides="product.pictures.screenshot" />
        </div>
        <div class="description-panel">
            <h1>{{ product.title }}</h1>
            <div class="rating-wrapper">
                <UIRating
                    class="stars"
                    :rating="product.computed.score.meanRating"
                    :has-ratings="!!product.computed.score.totalRatings"
                />
                <div class="total">
                    ({{ product.computed.score.totalRatings || 0 }})
                </div>
            </div>
            <div class="info">
                <p><span class="category">Released:</span> {{ displayDate(product.releaseDate) }}</p>
                <p><span class="category">Last update:</span> {{ displayDate(product.computed.lastUpdate) }}</p>
            </div>
            <p>{{ product.description.short }}</p>
            <UIButton
                :href="marketplaceLink"
                target="_blank"
            >
                Unreal Marketplace <i class="las la-external-link-alt" />
            </UIButton>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductService, { IProduct } from "@/services/product.service";
import UIButton from "@/components/ui/Button.vue";
import UISlideshow from "@/components/ui/Slideshow.vue";
import UIRating from "@/components/ui/Rating.vue";
import { displayDate, displayPrice } from "@/components/product/product";

export default defineComponent({
    name: "ProductDescription",
    components: { UIRating, UISlideshow, UIButton },
    props: {
        productId: {
            type: String,
            required: true
        }
    },
    async setup (props) {
        const product = await ProductService.getById(props.productId) as IProduct;

        return { displayDate, displayPrice, product };
    },
    computed: {
        marketplaceLink () {
            return `https://www.unrealengine.com/marketplace/product/${this.product.slug}`;
        }
    }
});
</script>

<style scoped lang="scss">
.product-description {
    display: flex;
    gap: var(--length-padding-xl);

    h1 {
        font-size: 200%;
        margin: 0;
        padding-bottom: var(--length-padding-l);
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
</style>
