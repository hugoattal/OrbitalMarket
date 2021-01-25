<template>
    <div class="landing">
        <LandingLayout />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LandingLayout from "@/components/pages/landing/Layout.vue";

export default defineComponent({
    components: { LandingLayout }
});
</script>

<style scoped lang="scss">
.landing {
    --color-background: var(--color-landing-background);
    --color-content: var(--color-landing-content);
}
</style>
