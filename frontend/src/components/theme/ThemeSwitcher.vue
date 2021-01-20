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
import { defineComponent } from "vue";
import Button from "@/components/ui/Button.vue";

export default defineComponent({
    components: {
        Button
    },
    data() {
        return {
            isDarkMode: getIsDarkMode()
        };

        function getIsDarkMode(): boolean {
            if (localStorage.getItem("theme")) {
                return localStorage.getItem("theme") === "dark";
            }

            return !!window?.matchMedia("(prefers-color-scheme: dark)").matches;
        }
    },
    watch: {
        isDarkMode: {
            immediate: true,
            handler() {
                const theme = this.isDarkMode ? "dark" : "light";
                document.documentElement.setAttribute("data-theme", theme);
                localStorage.setItem("theme", theme);
            }
        }
    },
    methods: {
        switchTheme() {
            this.isDarkMode = !this.isDarkMode;
        }
    }
});
</script>

<style scoped lang="scss">
.button {
    width: var(--length-button-base);
    height: var(--length-button-base);
}
</style>
