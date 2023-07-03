<template>
    <OProductHuntBar />
    <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OProductHuntBar from "@/components/elements/OProductHuntBar.vue";

export default defineComponent({
    components: { OProductHuntBar }
});
</script>

<style lang="scss">
@import "style";
</style>
