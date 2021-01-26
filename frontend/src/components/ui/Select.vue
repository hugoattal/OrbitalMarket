<template>
    <div class="select-wrapper">
        <slot />
        <select
            v-model="value"
            class="select"
        >
            <option
                v-for="option in options"
                :key="option.key"
                :value="option.key"
            >
                {{ option.value }}
            </option>
        </select>
        <div class="arrow">
            <i class="las la-caret-down" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

export default defineComponent({
    name: "UISelect",
    props: {
        options: {
            type: Array as PropType<Array<{key: string; value: string;}>>,
            required: true
        },
        modelValue: {
            type: String,
            default: ""
        }
    },
    emits: ["update:modelValue"],
    data () {
        return {
            value: ""
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
    }
});
</script>

<style scoped lang="scss">
.select-wrapper {
    height: var(--length-button-base);
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    border: var(--length-border-base) solid var(--color-primary);
    border-radius: var(--length-radius-base);
    transition: all var(--duration-fast);

    padding: var(--length-padding-base);

    .select {
        flex-grow: 1;
        font-weight: bold;
        background: none;
        height: var(--length-button-base);
        border: none;
        outline: none;
        appearance: none;
        cursor: pointer;
        padding-right: var(--length-padding-l);
        padding-left: var(--length-padding-s);

        &:hover {
            color: var(--color-primary);
        }
    }

    .arrow {
        position: absolute;
        right: var(--length-padding-base);
        pointer-events: none;
    }
}
</style>
