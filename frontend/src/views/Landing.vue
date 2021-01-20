<template>
    <div class="landing">
        <Layout />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher.vue";
import Layout from "@/components/landing/Layout.vue";

export default defineComponent({
    components: { Layout, ThemeSwitcher }
});
</script>

<style scoped lang="scss">
.landing {
    --color-background: var(--color-landing-background);
    --color-content: var(--color-landing-content);
}
</style>
