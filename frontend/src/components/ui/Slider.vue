<template>
    <div class="slider-wrapper">
        <div class="label">
            <slot />
        </div>
        <div class="slider">
            <div class="line" />
            <input
                :value="value"
                type="range"
                :min="min"
                :max="max"
                class="slider"
                @input="updateValue"
            >
        </div>
        <div v-if="withInput">
            <span v-if="prepend">
                {{ prepend }}
            </span>
            <input
                :value="value"
                type="number"
                :min="min"
                :max="max"
                class="input"
                @input="updateValue"
                @focus="$event.target.select()"
            >
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "UISlider",
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 100
        },
        withInput: {
            type: Boolean
        },
        modelValue: {
            type: Number,
            default: 0
        },
        prepend: {
            type: String,
            default: ""
        }
    },
    emits: ["update:modelValue"],
    data () {
        return {
            value: 0
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            async handler () {
                await this.$nextTick();
                this.value = this.modelValue;
            }
        },
        value () {
            this.$emit("update:modelValue", this.value);
        }
    },
    methods: {
        updateValue (event) {
            this.value = event.target.value;
        }
    }
});
</script>

<style scoped lang="scss">
.slider-wrapper {
    display: flex;
    align-items: center;
    gap: var(--length-margin-s);

    .slider {
        display: flex;
        align-items: center;
        position: relative;
        flex-grow: 1;

        .line {
            position: absolute;
            content: "";
            display: block;
            background: var(--color-primary);
            right: 4px;
            left: 4px;
            height: 2px;
        }

        input {
            position: absolute;
            -webkit-appearance: none;
            width: 100%;
            height: 20px;
            background: none;
            cursor: pointer;

            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background: var(--color-background);
                border: 2px solid var(--color-primary);
            }

            &::-moz-range-thumb {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: var(--color-background);
                border: 2px solid var(--color-primary);
            }

            &:hover {
                &::-moz-range-thumb {
                    border: 2px solid var(--color-content);
                }

                &::-webkit-slider-thumb {
                    border: 2px solid var(--color-content);
                }
            }
        }
    }

    .input {
        width: 32px;
        -moz-appearance: textfield;

        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
        }
    }

}
</style>
