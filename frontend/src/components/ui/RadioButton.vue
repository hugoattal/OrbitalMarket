<template>
    <button
        class="button"
        :class="{toggled: value}"
        @click="toggle"
    >
        <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "UIRadioButton",
    props: {
        modelValue: {
            type: Boolean
        }
    },
    emits: ["update:modelValue"],
    data () {
        return {
            value: false
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler () {
                this.value = this.modelValue;
            }
        },
        value () {
            this.$emit("update:modelValue", this.value);
        }
    },
    methods: {
        toggle () {
            this.value = !this.value;
        }
    }
});
</script>

<style scoped lang="scss">
.button {
    height: var(--length-button-base);

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    border: var(--length-border-base) solid var(--color-primary);
    border-radius: var(--length-radius-base);
    cursor: pointer;
    transition: all var(--duration-fast);

    padding: var(--length-padding-base);

    &:hover:not(.toggled) {
        color: var(--color-primary);
    }

    &.toggled {
        background: var(--color-primary);
    }
}
</style>
