<template>
    <Button class="button" @click="switchTheme">
        <div class="theme-switcher">
            <i
                class="las"
                :class="{'la-moon':isDarkMode, 'la-sun':!isDarkMode}"
            />
        </div>
    </Button>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import Button from "@/components/ui/Button.vue";

import Theme from "./theme";

export default defineComponent({
    name: "ThemeSwitcher",
    components: {
        Button
    },
    setup() {
        const isDarkMode = ref(Theme.isDarkMode());

        const switchTheme = () => {
            isDarkMode.value = !isDarkMode.value;
        };

        watch(
            () => isDarkMode.value,
            (isDarkMode) => {
                Theme.update(isDarkMode);
            },
            { lazy: true }
        );

        return {
            switchTheme,
            isDarkMode
        };
    }
});
</script>

<style scoped lang="scss">
.button {
    width: var(--length-button-base);
    height: var(--length-button-base);
}
</style>
