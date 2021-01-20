<template>
    <div class="input-wrapper">
        <div v-if="$slots.prepend" class="prepend">
            <slot name="prepend"></slot>
        </div>
        <div class="input"
             :class="{
        'has-append': $slots.append,
        'has-prepend': $slots.prepend
         }">
        <span v-if="$slots.prefix || prefixIcon" class="el-input__prefix">
            <slot name="prefix"></slot>
            <i
                v-if="prefixIcon"
                class="las"
                :class="prefixIcon"
            ></i>
        </span>
            <input
                type="text"
                :placeholder="placeholder"
            />
        </div>
        <div v-if="$slots.append" class="append">
            <slot name="append"></slot>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        placeholder: String,
        prefixIcon: String
    }
});
</script>

<style scoped lang="scss">
.input-wrapper {
    display: flex;
}

.input {
    border: var(--length-border-base) solid var(--color-content);
    border-radius: var(--length-radius-base);
    height: var(--length-button-base);
    padding: var(--length-padding-s) var(--length-padding-base);
    box-sizing: border-box;
    display: flex;
    flex-grow: 1;

    .las {
        padding-right: var(--length-padding-base);
    }

    input {
        background: none;
        border: none;
        outline: none;
        flex-grow: 1;
    }

    &.has-prepend {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
    }

    &.has-append {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
    }
}
</style>
