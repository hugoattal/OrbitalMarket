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
                    this.clamp(this.rating * 5, 0, 1),
                    this.clamp(this.rating * 5 - 1, 0, 1),
                    this.clamp(this.rating * 5 - 2, 0, 1),
                    this.clamp(this.rating * 5 - 3, 0, 1),
                    this.clamp(this.rating * 5 - 4, 0, 1)
                ]
                : [0, 0, 0, 0, 0]
        };
    },
    methods: {
        clamp (input, min, max) {
            return Math.min(Math.max(input, min), max);
        },
        styleWidth (width) {
            return {
                width: `${width * 14}px`
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

    .la-star {
        display: block;

        &.front {
            position: absolute;
            overflow: hidden;
        }
    }

    .las, .lar {
        font-size: 14px;
    }
}
</style>
