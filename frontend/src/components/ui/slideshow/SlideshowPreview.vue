<template>
    <div
        class="slideshow-preview"
        :class="{selected}">
        <div
            v-if="contentType === EContentType.image"
            class="preview">
            <img
                alt="screenshot"
                :src="url"
            >
        </div>
        <div
            v-if="contentType === EContentType.youtubeVideo"
            class="preview">
            <img
                alt="video preview"
                :src="youtubePreviewUrl"
            >
            <i class="las la-play-circle" />
        </div>
        <div
            v-if="contentType === EContentType.youtubePlaylist"
            class="preview"
        >
            <i class="las la-play-circle" />
        </div>
        <div
            v-if="contentType === EContentType.sketchfab"
            class="preview"
        >
            <i class="las la-cube" />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "UISlideshowPreview"
};
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    url: string;
    selected: boolean;
}>();

const enum EContentType {
    image,
    youtubeVideo,
    youtubePlaylist,
    sketchfab
}

const contentType = computed(() => {
    if (props.url.startsWith("youtubeVideo:")) {
        return EContentType.youtubeVideo;
    }
    if (props.url.startsWith("youtubePlaylist:")) {
        return EContentType.youtubePlaylist;
    }
    if (props.url.startsWith("sketchfab:")) {
        return EContentType.sketchfab;
    }

    return EContentType.image;
});

const contentId = computed(() => {
    return props.url.split(":")[1];
})

const youtubePreviewUrl = computed(() => {
    return `https://i.ytimg.com/vi/${contentId.value}/maxresdefault.jpg`
})
</script>

<style scoped lang="scss">
.slideshow-preview {
    width: 120px;
    height: 68px;

    .image {
    }

    .iframe {
        border: none;
    }

    &:hover .preview img, &.selected .preview img {
        filter: grayscale(0%) contrast(100%) brightness(100%);
    }

    .preview {
        background: var(--color-background);
        width: 120px;
        height: 68px;
        position: relative;
        display: flex;

        img {
            object-fit: contain;
            filter: grayscale(75%) contrast(50%) brightness(75%);
            transition: filter .2s ease-in-out;
            width: 100%;
        }

        i {
            opacity: 0.5;
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 2rem;
            text-shadow: 2px 2px 0 var(--color-background), 0 0 16px var(--color-background);
        }
    }
}
</style>
