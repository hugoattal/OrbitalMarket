<template>
    <div class="discount-range">
        <div class="label">
            Discount:
        </div>
        <div class="options">
            <div
                class="option"
                :class="{selected:(discountRange===DiscountRange.All)}"
                @click="discountRange=DiscountRange.All"
            >
                All
            </div>
            <div
                class="option"
                :class="{selected:(discountRange===DiscountRange.Discounted)}"
                @click="discountRange=DiscountRange.Discounted"
            >
                Sale
            </div>
            <div
                ref="range"
                class="option"
                :class="{selected:(discountRange===DiscountRange.Range)}"
                tabindex="0"
                @click="discountRange=DiscountRange.Range"
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

<script setup lang="ts">
import { ref, watch } from "vue";
import UISlider from "@/components/ui/Slider.vue";
import { useRouteQuery } from "@vueuse/router";

const discountQuery = useRouteQuery<string | null>("discount");

enum DiscountRange {
    All,
    Discounted,
    Range
}

const deploySelector = ref(false);
const min = ref(0);
const discountRange = ref<DiscountRange>(DiscountRange.All);

if (discountQuery.value) {
    min.value = parseInt(discountQuery.value?.split("-")[0]);
    if (min.value === 10) {
        discountRange.value = DiscountRange.Discounted;
    }
    else {
        discountRange.value = DiscountRange.Range;
    }
}

watch([discountRange, min], () => {
    min.value = validateInput(min.value);

    switch (discountRange.value) {
    case DiscountRange.Discounted:
        discountQuery.value = "10-100";
        break;
    case DiscountRange.Range:
        discountQuery.value = `${ min.value }-100`;
        break;
    default:
        discountQuery.value = null;
    }
});

function focusRange() {
    deploySelector.value = true;
}

function unFocusRange(event: FocusEvent) {
    if (!(event.relatedTarget as HTMLElement)?.closest(".range-selector")) {
        deploySelector.value = false;
    }
}

function validateInput(discount: number) {
    if (isNaN(discount)) {
        discount = 0;
    }
    return Math.min(Math.max(discount, 0), 100);
}
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
