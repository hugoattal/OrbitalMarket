<template>
    <Button
        class="button"
        @click="toggleDarkMode"
    >
        <div
            class="theme-switcher"
            title="Toggle dark/light theme"
        >
            <i
                class="las"
                :class="{'la-moon':isDarkMode, 'la-sun':!isDarkMode}"
            />
        </div>
    </Button>
</template>

<script lang="ts">

export default {
    name: "ThemeSwitcher"
};
</script>

<script setup lang="ts">
import Button from "@/components/ui/Button.vue";
import { isDarkMode, toggleDarkMode } from "@/components/theme/theme";
</script>

<style scoped lang="scss">
.button {
    width: var(--length-button-base);
    height: var(--length-button-base);
}
</style>
