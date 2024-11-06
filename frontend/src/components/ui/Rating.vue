<template>
    <div
        class="rating"
        :class="{hasRatings}"
    >
        <div
            v-for="star in stars"
            class="star"
        >
            <i
                class="las la-star front"
                :style="styleWidth(star)"
            />
            <i class="lar la-star" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "UIRating",
    props: {
        rating: {
            type: Number,
            required: true
        },
        hasRatings: Boolean
    },
    data () {
        return {
            stars: this.hasRatings
                ? [
                    this.clamp(this.rating, 0, 1),
                    this.clamp(this.rating - 1, 0, 1),
                    this.clamp(this.rating - 2, 0, 1),
                    this.clamp(this.rating - 3, 0, 1),
                    this.clamp(this.rating - 4, 0, 1)
                ]
                : [0, 0, 0, 0, 0]
        };
    },
    methods: {
        clamp (input: number, min: number, max: number) {
            return Math.min(Math.max(input, min), max);
        },
        styleWidth (width: number) {
            return {
                width: `${ width * 100 }%`
            };
        }
    }
});
</script>

<style scoped lang="scss">
.rating {
    opacity: 0.5;

    &.hasRatings {
        opacity: 1;
    }
}

.star {
    display: inline-block;
    position: relative;
    color: var(--color-primary);

    .la-star {
        display: block;

        &.front {
            position: absolute;
            overflow: hidden;
        }
    }

    .las, .lar {
        font-size: inherit;
    }
}
</style>
