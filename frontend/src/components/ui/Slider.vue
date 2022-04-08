<template>
    <div class="slider-wrapper">
        <div class="label">
            <slot />
        </div>
        <div class="slider">
            <div class="line" />
            <input
                class="slider"
                :max="max"
                :min="min"
                type="range"
                :value="value"
                @input="updateValue"
            >
        </div>
        <div
            v-if="withDisplay"
            class="display"
        >
            {{ displayFunction(value) }}
        </div>
        <div v-if="withInput">
            <span v-if="prepend">
                {{ prepend }}
            </span>
            <input
                class="input"
                :max="max"
                :min="min"
                type="number"
                :value="value"
                @focus="$event.target.select()"
                @input="updateValue"
            >
            <span v-if="append">
                {{ append }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "UISlider",
    props: {
        append: {
            type: String,
            default: ""
        },
        displayFunction: {
            type: Function,
            default: (value: string) => value
        },
        max: {
            type: Number,
            default: 100
        },
        min: {
            type: Number,
            default: 0
        },
        modelValue: {
            type: Number,
            default: 0
        },
        prepend: {
            type: String,
            default: ""
        },
        withDisplay: {
            type: Boolean
        },
        withInput: {
            type: Boolean
        }
    },
    emits: ["update:modelValue"],
    data() {
        return {
            value: 0
        };
    },
    watch: {
        modelValue: {
            async handler() {
                await this.$nextTick();
                this.value = this.modelValue;
            },
            immediate: true
        },
        value() {
            this.$emit("update:modelValue", this.value);
        }
    },
    methods: {
        updateValue(event) {
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

    .display {
        width: 48px;
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
