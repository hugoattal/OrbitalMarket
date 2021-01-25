<template>
    <div class="input-wrapper">
        <div
            v-if="$slots.prepend"
            class="prepend"
        >
            <slot name="prepend" />
        </div>
        <div
            class="input"
            :class="{
                'has-append': $slots.append,
                'has-prepend': $slots.prepend
            }"
        >
            <span
                v-if="$slots.prefix || prefixIcon"
                class="el-input__prefix"
            >
                <slot name="prefix" />
                <i
                    v-if="prefixIcon"
                    class="las"
                    :class="prefixIcon"
                />
            </span>
            <input
                ref="input"
                v-model="value"
                type="text"
                :placeholder="placeholder"
                :autofocus="autofocus"
                @keyup.enter="$emit('validate')"
            >
        </div>
        <div
            v-if="$slots.append"
            class="append"
        >
            <slot name="append" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "UIInput",
    props: {
        placeholder: {
            type: String,
            default: ""
        },
        prefixIcon: {
            type: String,
            default: ""
        },
        autofocus: Boolean,
        modelValue: {
            type: String,
            default: ""
        }
    },
    emits: ["update:modelValue", "validate"],
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
