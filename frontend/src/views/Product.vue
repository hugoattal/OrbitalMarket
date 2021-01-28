<template>
    <div class="search">
        <ProductLayout />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductLayout from "@/components/pages/product/Layout.vue";

export default defineComponent({
    components: { ProductLayout }
});
</script>

<style scoped lang="scss">
</style>
