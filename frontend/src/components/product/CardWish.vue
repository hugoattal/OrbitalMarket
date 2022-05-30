<template>
    <div
        class="card-wish"
        @click.stop.prevent="toggleWish"
    >
        <i
            class="la-star"
            :class="iconClass"
        />
    </div>
</template>

<script lang="ts">
export default {
    name: "ProductCardWish"
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { useConfigStore } from "@/stores/config";

const props = defineProps<{
    productId: string;
}>();

const configStore = useConfigStore();

const iconClass = computed(() => {
    return configStore.wishMap.has(props.productId) ? "las" : "lar";
});

function toggleWish() {
    if (configStore.wishMap.has(props.productId)) {
        configStore.wishMap.delete(props.productId);
    }
    else {
        configStore.wishMap.set(props.productId, true);
    }
}
</script>

<style scoped lang="scss">
.card-wish {
    &:hover i {
        color: var(--color-primary);
    }
}
</style>
