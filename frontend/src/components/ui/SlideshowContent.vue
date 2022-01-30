<template>
    <div class="slideshow-content">
        <img
            v-if="contentType === EContentType.image"
            alt="screenshot"
            class="slideshow-content image"
            :src="url"
        >
        <iframe
            v-if="contentType === EContentType.youtubeVideo"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="slideshow-content iframe"
            :src="'https://www.youtube.com/embed/' + contentId"
            title="YouTube video player"
        />
        <iframe
            v-if="contentType === EContentType.youtubePlaylist"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="slideshow-content iframe"
            :src="'https://www.youtube.com/embed/videoseries?list=' + contentId"
            title="YouTube video player"
        />
        <iframe
            v-if="contentType === EContentType.sketchfab"
            allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="slideshow-content iframe"
            :src="'https://sketchfab.com/models/' + contentId + '/embed?autostart=1&internal=1&tracking=0&ui_ar=0&ui_infos=0&ui_snapshots=1&ui_stop=0&ui_theatre=1&ui_watermark=0'"
            title="YouTube video player"
        />
    </div>
</template>

<script lang="ts">
export default {
    name: "UISlideshowContent"
};
</script>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
    url: string;
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
</script>

<style scoped lang="scss">
.slideshow-content {
    width: 100%;
    height: 100%;

    .image {
        object-fit: contain;
    }

    .iframe {
        border: none;
    }
}
</style>
