<template>
    <div class="not-found">
        <NotFoundLayout />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NotFoundLayout from "@/components/pages/notFound/Layout.vue";

export default defineComponent({
    components: { NotFoundLayout }
});
</script>

<style scoped lang="scss">
.not-found {
    --color-background: var(--color-landing-background);
    --color-content: var(--color-landing-content);
}
</style>
