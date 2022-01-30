<template>
    <div class="product-modal">
        <Suspense>
            <template #default>
                <div class="product-container">
                    <div class="icons">
                        <a
                            :href="`/product/${productSlug}`"
                            target="_blank"
                            @click.stop.prevent="$emit('expand')"
                        >
                            <i class="las la-expand" />
                        </a>
                        <i
                            class="las la-times"
                            @click="$emit('close')"
                        />
                    </div>
                    <ProductDescription
                        class="product-description"
                        :product-id="productId"
                    />
                </div>
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
    components: { ProductDescription, Spinner },
    props: {
        productId: {
            type: String,
            required: true
        },
        productSlug: {
            type: String,
            required: true
        }
    },
    emits: ["expand", "close"]
});
</script>

<style scoped lang="scss">
.product-modal {
    height: calc(100vh - 100px);
    max-height: 600px;
    min-width: 55vw;
    min-height: 60vh;
    width: calc(100vw - 100px);
    max-width: 1200px;
    overflow: auto;

    .product-container {
        display: flex;
        flex-direction: column;
        height: 100%;

        .product-description {
            height: 100%;
            overflow: auto;
        }
    }

    .icons {
        display: flex;
        justify-content: flex-end;

        .las {
            padding: var(--length-padding-base);
            display: inline-block;
            color: var(--color-content-50);
            cursor: pointer;

            &:hover {
                color: var(--color-primary);
            }
        }
    }
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
