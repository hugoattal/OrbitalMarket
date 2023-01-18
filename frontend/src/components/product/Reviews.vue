<template>
    <div class="reviews">
        <div v-if="reviews.length === 0">
            No review found...
        </div>
        <div
            v-for="review in reviews"
            :key="review._id"
            class="review"
        >
            <div class="header">
                <UIRating
                    has-ratings
                    :rating="review.rating / 5"
                />
                <span class="title">{{ review.title }}</span>
            </div>
            <div class="sub">
                <span class="date">{{ displayDate(review.date) }}</span>
                <span class="author">by {{ review.name }}</span>
            </div>
            <div
                class="content"
                v-html="review.content"
            />
            <div
                v-if="review.publisherReply"
                class="reply"
            >
                Response:
                <div
                    class="content"
                    v-html="review.publisherReply"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "ProductReviews"
};
</script>

<script setup lang="ts">
import UIRating from "@/components/ui/Rating.vue";
import ProductService from "@/services/product.service";
import { displayDate } from "@/components/product/product";

const props = defineProps<{
    productId: string;
}>();

const reviews = await ProductService.getReviewsById(props.productId);
</script>

<style scoped lang="scss">
.reviews {
    display: flex;
    flex-direction: column;
    gap: var(--length-gap-s);
    padding: var(--length-padding-s) 0;

    .review {
        background: var(--color-background);
        padding: var(--length-padding-base) var(--length-padding-l);
        border-radius: var(--length-radius-base);

        .header {
            display: flex;
            gap: var(--length-gap-s);
            font-weight: 600;
        }

        .sub {
            display: flex;
            gap: var(--length-gap-s);
            font-size: 0.9rem;
            color: var(--color-content-30);
        }

        .content {
            color: var(--color-content-50);
        }

        .reply {
            background: var(--color-content-background);
            padding: var(--length-padding-s) var(--length-padding-base);
            margin-bottom: var(--length-margin-s);
            border-radius: var(--length-radius-base);
        }
    }
}
</style>
