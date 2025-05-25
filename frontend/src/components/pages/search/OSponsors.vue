<template>
    <div class="sponsors">
        Sponsored by
        <a
            href="https://luna-park.app/"
            target="_blank"
        >
            <img
                alt="Luna Park"
                class="logo"
                :src="logoUrl"
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
import { computed } from "vue";
import SponsorLogo from "@/assets/brands/lunapark.svg";
import SponsorLogoLight from "@/assets/brands/lunapark-light.svg";
import { isDarkMode } from "@/components/theme/theme";

const logoUrl = computed(() => isDarkMode.value ? SponsorLogoLight : SponsorLogo);
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
        width: 240px;
        opacity: 0.75;
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
