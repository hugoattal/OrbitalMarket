<template>
    <div class="product-modal">
        <Suspense>
            <template #default>
                <ProductDescription :product-id="productId" />
            </template>
            <template #fallback>
                <Spinner class="spinner" />
            </template>
        </Suspense>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductDescription from "@/components/product/Description.vue";
import Spinner from "@/components/ui/Spinner.vue";

export default defineComponent({
    name: "ProductModal",
    components: { Spinner, ProductDescription },
    props: {
        productId: {
            type: String,
            required: true
        }
    }
});
</script>

<style scoped lang="scss">
.product-modal {
    height: calc(100vh - 100px);
    max-height: 600px;
    width: calc(100vw - 100px);
    max-width: 900px;
    padding: var(--length-padding-l);
    overflow: auto;
}

.spinner {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
}
</style>
