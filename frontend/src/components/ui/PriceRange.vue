<template>
    <div class="price-range">
        <div class="label">
            <slot name="label" />
        </div>
        <div class="options">
            <div
                class="option"
                :class="{selected:(priceRange===PriceRange.All)}"
                @click="priceRange=PriceRange.All"
            >
                All
            </div>
            <div
                class="option"
                :class="{selected:(priceRange===PriceRange.Free)}"
                @click="priceRange=PriceRange.Free"
            >
                Free
            </div>
            <div
                class="option"
                :class="{selected:(priceRange===PriceRange.Paid)}"
                @click="priceRange=PriceRange.Paid"
            >
                Paid
            </div>
            <div
                ref="range"
                class="option"
                :class="{selected:(priceRange===PriceRange.Range)}"
                tabindex="0"
                @click="priceRange=PriceRange.Range"
                @focusin="focusRange"
                @focusout="unFocusRange"
            >
                Range
                <div
                    v-if="deploySelector"
                    class="range-selector"
                >
                    <UISlider
                        v-model="min"
                        with-input
                        prepend="$"
                        class="slider"
                        :max="MAX_PRICE"
                    >
                        <span class="label">Min:</span>
                    </UISlider>
                    <UISlider
                        v-model="max"
                        with-input
                        prepend="$"
                        class="slider"
                        :max="MAX_PRICE"
                    >
                        <span class="label">Max:</span>
                    </UISlider>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import UISlider from "@/components/ui/Slider.vue";
import { debounce } from "lodash";

const MAX_PRICE = 999;

enum PriceRange {
    All,
    Free,
    Paid,
    Range
}

export default defineComponent({
    name: "UIPriceRange",
    components: { UISlider },
    emits: ["update:modelValue"],
    data () {
        return {
            min: 0,
            max: MAX_PRICE,
            priceRange: PriceRange.All as PriceRange,
            PriceRange,
            MAX_PRICE,
            deploySelector: false,
            debounceUpdate: debounce(this.updateValue, 500)
        };
    },
    computed: {
        value () {
            switch (this.priceRange) {
            case PriceRange.Free:
                return { min: 0, max: 0 };
            case PriceRange.Paid:
                return { min: 1, max: MAX_PRICE * 100 };
            case PriceRange.Range:
                return { min: this.min * 100, max: this.max * 100 };
            }
            return { };
        }
    },
    watch: {
        priceRange () {
            this.updateValue();
        },
        min () {
            this.min = this.validateInput(this.min);
            this.max = Math.max(this.min, this.max);
            this.debounceUpdate();
        },
        max () {
            this.max = this.validateInput(this.max);
            this.min = Math.min(this.min, this.max);
            this.debounceUpdate();
        }
    },
    methods: {
        focusRange () {
            this.deploySelector = true;
        },
        unFocusRange (event:FocusEvent) {
            if (!this.$refs.range.contains(event.relatedTarget)) {
                this.deploySelector = false;
            }
        },
        validateInput (price) {
            if (isNaN(price)) {
                price = 0;
            }
            return Math.min(Math.max(price, 0), MAX_PRICE);
        },
        updateValue () {
            this.$emit("update:modelValue", this.value);
        }
    }
});
</script>

<style scoped lang="scss">
.price-range {
    display: flex;
    border: 2px solid var(--color-primary);
    border-radius: var(--length-radius-base);

    height: var(--length-button-base);
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding-left: var(--length-padding-base);
    gap: var(--length-padding-base);

    .options {
        display: flex;
        height: 100%;

        .option {
            position: relative;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0 var(--length-padding-base);
            border-left: 2px solid var(--color-primary);
            cursor: pointer;

            &:hover:not(.selected) {
                color: var(--color-primary);
            }

            .range-selector {
                position: absolute;
                left: -2px;
                z-index: 1000;
                top: calc(100%);
                background: var(--color-background);
                border: 2px solid var(--color-primary);
                border-bottom-left-radius: var(--length-radius-base);
                border-bottom-right-radius: var(--length-radius-base);
                border-top-right-radius: var(--length-radius-base);
                padding: var(--length-padding-base);

                .label {
                    display: inline-block;
                    width: 32px;
                }

                .slider {
                    width: 256px;
                    color: var(--color-content);
                }
            }
        }

        .selected {
            background: var(--color-primary);
        }
    }
}
</style>
