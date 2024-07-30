<template>
    <div class="price-range">
        <div class="label">
            Price:
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
                        class="slider"
                        :max="MAX_PRICE"
                        prepend="$"
                        with-input
                    >
                        <span class="label">Min:</span>
                    </UISlider>
                    <UISlider
                        v-model="max"
                        class="slider"
                        :max="MAX_PRICE"
                        prepend="$"
                        with-input
                    >
                        <span class="label">Max:</span>
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

const priceQuery = useRouteQuery<string | null>("price");

const MAX_PRICE = 1500;

enum PriceRange {
    All,
    Free,
    Paid,
    Range
}

const deploySelector = ref(false);
const min = ref(0);
const max = ref(MAX_PRICE);
const priceRange = ref<PriceRange>(PriceRange.All);

if (priceQuery.value) {
    const [minPrice, maxPrice] = priceQuery.value.split("-").map(Number);
    if (minPrice === 0 && maxPrice === 0) {
        priceRange.value = PriceRange.Free;
    }
    else if (minPrice === 1 && maxPrice === MAX_PRICE) {
        priceRange.value = PriceRange.Paid;
    }
    else {
        priceRange.value = PriceRange.Range;
        min.value = minPrice;
        max.value = maxPrice;
    }
}

watch([priceRange, min, max], (newValue, oldValue) => {
    min.value = validateInput(min.value);
    max.value = validateInput(max.value);

    if (oldValue[1] !== newValue[1]) {
        max.value = Math.max(min.value, max.value);
    }

    if (oldValue[2] !== newValue[2]) {
        min.value = Math.min(min.value, max.value);
    }

    switch (priceRange.value) {
    case PriceRange.Free:
        priceQuery.value = "0-0";
        break;
    case PriceRange.Paid:
        priceQuery.value = `1-${ MAX_PRICE }`;
        break;
    case PriceRange.Range:
        priceQuery.value = `${ min.value }-${ max.value }`;
        break;
    default:
        priceQuery.value = null;
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

function validateInput(price: number) {
    if (isNaN(price)) {
        price = 0;
    }
    return Math.min(Math.max(price, 0), MAX_PRICE);
}
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
