<template>
    <div
        ref="slideshow"
        class="slideshow"
        @click="toggleFullScreen"
    >
        <div class="viewer">
            <UISlideshowContent
                :key="currentIndex"
                class="content"
                :url="slides[currentIndex]"
            />
            <div class="left">
                <div
                    class="arrow"
                    @click.stop="previous"
                >
                    <i class="las la-chevron-left" />
                </div>
            </div>
            <div class="right">
                <div
                    class="arrow"
                    @click.stop="next"
                >
                    <i class="las la-chevron-right" />
                </div>
            </div>
            <div class="counter">
                {{ currentIndex + 1 }} / {{ slides.length }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import UISlideshowContent from "@/components/ui/SlideshowContent.vue";

const slideshow = ref(null);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        slideshow.value.requestFullscreen();
    }
    else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

</script>

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
        padding-bottom: calc(100% / (16 / 10));
        grid-area: 1 / 1 / 1 / 1;
    }

    & > *:first-child {
        grid-area: 1 / 1 / 1 / 1;
        background: rgba(0, 0, 0, 0.1);
    }

    .left, .right {
        pointer-events: none;
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 0;
        bottom: 0;

        .arrow {
            pointer-events: auto;
            cursor: pointer;
            padding: var(--length-padding-l);
            background: rgba(0, 0, 0, 0.5);
            opacity: 0;
        }
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

    &:hover .arrow, &:hover .counter {
        opacity: 1;
    }

    .content {
        position: absolute;
        inset: 0;
    }
}
</style>
