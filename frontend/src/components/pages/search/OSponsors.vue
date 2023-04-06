<template>
    <div class="sponsors">
        Sponsored by
        <a
            href="https://welevel.com/"
            target="_blank"
        >
            <img
                alt="WeLevel"
                class="logo"
                :class="{light: !isDarkMode}"
                :src="WeLevelLogo"
            >
        </a>
    </div>
</template>

<script lang="ts">
export default {
    name: "OSponsors"
};
</script>

<script setup lang="ts">
import WeLevelLogo from "@/assets/brands/welevel.svg";
import { isDarkMode } from "@/components/theme/theme";
</script>

<style scoped lang="scss">
.sponsors {
    display: flex;
    flex-direction: column;
    padding: var(--length-padding-base) var(--length-padding-l);
    color: var(--color-content-30);
    gap: var(--length-gap-xs);

    .logo {
        color: var(--color-content);
        width: 120px;
        opacity: 0.5;
        cursor: pointer;
        transition: filter var(--duration-fast), opacity var(--duration-fast);

        &:hover {
            opacity: 1;
        }

        &.light {
            filter: invert(1);
        }
    }
}
</style>
