<template>
    <div class="product-modal">
        <Suspense>
            <template #default>
                <ProductDescription :product-id="productId" />
            </template>
            <template #fallback>
                <div class="spinner">
                    <i class="las la-circle-notch" />
                </div>
            </template>
        </Suspense>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProductDescription from "@/components/product/Description.vue";

export default defineComponent({
    name: "ProductModal",
    components: { ProductDescription },
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
    max-height: 400px;
    width: calc(100vw - 100px);
    max-width: 900px;
    padding: var(--length-padding-l);
}

.spinner {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .las {
        opacity: 0.5;
        font-size: 50px;
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
