<template>
    <div class="price-range">
        <div class="label">
            Released:
        </div>
        <div class="options">
            <div
                class="option"
                :class="{selected:(timeRange===TimeRange.All)}"
                @click="timeRange=TimeRange.All"
            >
                All Time
            </div>
            <div
                class="option"
                :class="{selected:(timeRange===TimeRange.Months3)}"
                @click="timeRange=TimeRange.Months3"
            >
                3 mths
            </div>
            <div
                class="option"
                :class="{selected:(timeRange===TimeRange.Months12)}"
                @click="timeRange=TimeRange.Months12"
            >
                1 year
            </div>
            <div
                ref="range"
                class="option"
                :class="{selected:(timeRange===TimeRange.Range)}"
                tabindex="0"
                @click="timeRange=TimeRange.Range"
                @focusin="focusRange"
                @focusout="unFocusRange"
            >
                Range
                <div
                    v-if="deploySelector"
                    class="range-selector"
                >
                    <UISlider
                        v-model="max"
                        append="mths"
                        class="slider"
                        :max="MAX_MONTHS"
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

const timeQuery = useRouteQuery<string | null>("time");

const MAX_MONTHS = 24;

enum TimeRange {
    All,
    Months3,
    Months12,
    Range
}

const deploySelector = ref(false);
const max = ref(MAX_MONTHS);
const min = ref(0);
const timeRange = ref(TimeRange.All as TimeRange);

if (timeQuery.value) {
    const [minValue, maxValue] = timeQuery.value.split("-").map(Number);
    if (minValue === 0 && maxValue === 3) {
        timeRange.value = TimeRange.Months3;
    }
    else if (minValue === 0 && maxValue === 12) {
        timeRange.value = TimeRange.Months12;
    }
    else {
        timeRange.value = TimeRange.Range;
        min.value = minValue;
        max.value = maxValue;
    }
}

watch(max, () => {
    max.value = validateInput(max.value);
    min.value = Math.min(min.value, max.value);
});

watch(min, () => {
    min.value = validateInput(min.value);
    max.value = Math.max(min.value, max.value);
});

watch([timeRange, min, max], (newValue, oldValue) => {
    min.value = validateInput(min.value);
    max.value = validateInput(max.value);

    if (oldValue[1] !== newValue[1]) {
        max.value = Math.max(min.value, max.value);
    }

    if (oldValue[2] !== newValue[2]) {
        min.value = Math.min(min.value, max.value);
    }

    switch (timeRange.value) {
    case TimeRange.Months3:
        timeQuery.value = "0-3";
        break;
    case TimeRange.Months12:
        timeQuery.value = "0-12";
        break;
    case TimeRange.Range:
        timeQuery.value = `${ min.value }-${ max.value }`;
        break;
    default:
        timeQuery.value = null;
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

function validateInput(time: number) {
    if (isNaN(time)) {
        time = 0;
    }
    return Math.min(Math.max(time, 0), MAX_MONTHS);
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
