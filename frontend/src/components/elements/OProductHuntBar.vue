<template>
    <div
        v-if="displayPh && hasStarted"
        class="product-hunt"
    >
        <div class="text">
            <span class="logo">Luna Park</span>, a product I'm working on, is live on <span class="logo">Product Hunt! 🚀</span> - [<a
                href="https://www.producthunt.com/posts/luna-park-no-code-challenge?utm_source=header"
                target="_blank"
            >Check it out here <i class="las la-external-link-alt icon" /></a>]
        </div>
        <code>{{ display }}</code>
        <div
            class="close"
            title="Close banner"
        >
            <i
                class="las la-times icon"
                @click="close"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";
import { useStorage } from "@vueuse/core";

const endTime = new Date("2023-07-04T07:00:00.000Z");
const displayPh = useStorage("lp-display-ph", true);

const chrono = reactive({
    hours: 0,
    minutes: 0,
    seconds: 0
});

function updateChrono() {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();

    if (diff <= 0) {
        displayPh.value = false;
        return;
    }

    chrono.hours = Math.floor(diff / (1000 * 60 * 60));
    chrono.minutes = Math.floor((diff / (1000 * 60)) % 60);
    chrono.seconds = Math.floor((diff / 1000) % 60);
}

updateChrono();

setInterval(() => {
    updateChrono();
}, 1000);

const display = computed(() => {
    const hours = chrono.hours.toString().padStart(2, "0");
    const minutes = chrono.minutes.toString().padStart(2, "0");
    const seconds = chrono.seconds.toString().padStart(2, "0");

    return `${ hours }:${ minutes }:${ seconds }`;
});

const hasStarted = computed(() => chrono.hours < 24);

function close() {
    displayPh.value = false;
}
</script>

<style scoped lang="scss">
.product-hunt {
    background: #d54b29;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--length-padding-base);
    position: relative;
    z-index: 100;
    gap: var(--length-gap-s);
    color: hsla(0, 0%, 100%, 50%);

    .logo {
        color: hsl(0, 0%, 100%);
        font-weight: 600;
    }

    .icon {
        font-size: 1rem;
    }

    a {
        font-weight: 600;
        color: hsl(0, 0%, 100%);
        text-decoration: none;

        &:hover {
            text-decoration: underline;
        }
    }

    code {
        background: hsla(0, 0%, 0%, 0.2);
        padding: var(--length-padding-xs) var(--length-padding-s);
        border-radius: var(--length-radius-base);
    }

    .close {
        position: absolute;
        right: 0;
        padding: var(--length-padding-base);
        cursor: pointer;

        &:hover {
            color: var(--color-content);
        }
    }
}
</style>
