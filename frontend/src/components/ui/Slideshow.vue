<template>
    <div class="slideshow">
        <div class="viewer">
            <img
                :key="currentIndex"
                :src="slides[currentIndex]"
                alt="screenshot"
            >
            <div
                class="left"
                @click="previous"
            >
                <i class="las la-chevron-left" />
            </div>
            <div
                class="right"
                @click="next"
            >
                <i class="las la-chevron-right" />
            </div>
            <div class="counter">
                {{ currentIndex + 1 }} / {{ slides.length }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: "UISlideshow",
    props: {
        slides: {
            type: Array as PropType<Array<string>>,
            required: true
        }
    },
    data () {
        return {
            currentIndex: 0
        };
    },
    methods: {
        next () {
            this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        },
        previous () {
            this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        }
    }
});
</script>

<style scoped lang="scss">

.viewer {
    display: grid;
    grid-template-columns: 1fr;
    background: black;
    position: relative;

    &::before {
        content: '';
        width: 0;
        padding-bottom: calc(100% / (16 / 10)); /* here you can place any ratio */
        grid-area: 1 / 1 / 1 / 1;
    }

    & > *:first-child {
        grid-area: 1 / 1 / 1 / 1; /* the same as ::before */
        background: rgba(0, 0, 0, 0.1); /* just for instance */
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: flex;
    }

    .left, .right {
        opacity: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        padding: var(--length-padding-l);
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
    }

    .left {
        left: 0;
    }

    .right {
        right: 0;
    }

    .counter {
        position: absolute;
        top: 0;
        background: rgba(0, 0, 0, 0.5);
        padding: var(--length-padding-base);
        border-bottom-left-radius: var(--length-radius-base);
        border-bottom-right-radius: var(--length-radius-base);
        width: 80px;
        box-sizing: border-box;
        text-align: center;
        left: calc(50% - 40px);
        opacity: 0;
    }

    &:hover .left, &:hover .right, &:hover .counter {
        opacity: 1;
    }
}
</style>
