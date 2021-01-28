<template>
    <div class="spinner">
        <i class="las la-circle-notch" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
});
</script>

<style scoped lang="scss">
.spinner {
    .las {
        font-size: inherit;
        opacity: 0.5;
        animation: rotating 2s linear infinite;
    }

    @keyframes rotating {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
}
</style>
