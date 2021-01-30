<template>
    <div class="radio-element">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "RadioElement",
    props: {
        key: {
            type: String,
            required: true
        }
    }
});
</script>

<style scoped lang="scss">

</style>
