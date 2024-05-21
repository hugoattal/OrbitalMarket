<template>
    <div class="discount-range">
        <div class="label">
            <slot name="label" />
        </div>
        <div class="options">
            <div
                class="option"
                :class="{selected:(timeRange===DiscountRange.All)}"
                @click="timeRange=DiscountRange.All"
            >
                All
            </div>
            <div
                class="option"
                :class="{selected:(timeRange===DiscountRange.Discounted)}"
                @click="timeRange=DiscountRange.Discounted"
            >
                Sale
            </div>
            <div
                ref="range"
                class="option"
                :class="{selected:(timeRange===DiscountRange.Range)}"
                tabindex="0"
                @click="timeRange=DiscountRange.Range"
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
                        append="%"
                        class="slider"
                        :max="100"
                        with-input
                    >
                        <span class="label">Min:</span>
                    </UISlider>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "lodash";
import UISlider from "@/components/ui/Slider.vue";

const MAX_MONTHS = 24;

enum DiscountRange {
    All,
    Discounted,
    Range
}

export default defineComponent({
    name: "UIDiscountRange",
    components: { UISlider },
    emits: ["update:modelValue"],
    data () {
        return {
            debounceUpdate: debounce(this.updateValue, 500),
            deploySelector: false,
            DiscountRange,
            max: MAX_MONTHS,
            MAX_MONTHS,
            min: 0,
            timeRange: DiscountRange.All as DiscountRange
        };
    },
    computed: {
        value () {
            switch (this.timeRange) {
            case DiscountRange.Discounted:
                return { max: 100, min: 10 };
            case DiscountRange.Range:
                return { max: 100, min: this.min };
            }
            return { };
        }
    },
    watch: {
        max () {
            this.max = this.validateInput(this.max);
            this.min = Math.min(this.min, this.max);
            this.debounceUpdate();
        },
        min () {
            this.min = this.validateInput(this.min);
            this.max = Math.max(this.min, this.max);
            this.debounceUpdate();
        },
        timeRange () {
            this.updateValue();
        }
    },
    methods: {
        focusRange () {
            this.deploySelector = true;
        },
        unFocusRange (event: FocusEvent) {
            if (!this.$refs.range.contains(event.relatedTarget)) {
                this.deploySelector = false;
            }
        },
        updateValue () {
            this.$emit("update:modelValue", this.value);
        },
        validateInput (time: number) {
            if (isNaN(time)) {
                time = 0;
            }
            return Math.min(Math.max(time, 0), 100);
        }
    }
});
</script>

<style scoped lang="scss">
.discount-range {
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
