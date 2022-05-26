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
    <div
        ref="previewElement"
        class="slides"
        @wheel.prevent="scrollPreviews">
        <UISlideshowPreview
            v-for="(slide, key) of slides"
            :key="key"
            class="slide"
            :selected="currentIndex === key"
            :url="slide"
            @click="currentIndex = key"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import UISlideshowContent from "@/components/ui/slideshow/SlideshowContent.vue";
import UISlideshowPreview from "@/components/ui/slideshow/SlideshowPreview.vue";

const props = defineProps<{
    slides: Array<string>;
}>();

const slideshow = ref(null);
const previewElement = ref(null);
const currentIndex = ref(0);

function next () {
    currentIndex.value = (currentIndex.value + 1) % props.slides.length;
}
function previous () {
    currentIndex.value = (currentIndex.value - 1 + props.slides.length) % props.slides.length;
}

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

function scrollPreviews(event: WheelEvent) {
    previewElement.value.scrollLeft += event.deltaY;
}

const imageSlides = computed(() => {
    return props.slides.filter;
});
</script>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "UISlideshow",
});
</script>

<style scoped lang="scss">

.viewer {
    display: grid;
    grid-template-columns: 1fr;
    background: black;
    position: relative;
    color: white;

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

        .arrow {
            border-top-right-radius: var(--length-radius-base);
            border-bottom-right-radius: var(--length-radius-base);
        }
    }

    .right {
        right: 0;

        .arrow {
            border-top-left-radius: var(--length-radius-base);
            border-bottom-left-radius: var(--length-radius-base);
        }
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

.slides {
    display: flex;
    gap: var(--length-gap-s);
    margin: var(--length-margin-s);
    overflow-x: scroll;
    overflow-y: hidden;

    .slide {
        cursor: pointer;
        flex-shrink: 0;
    }
}
</style>
