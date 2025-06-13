<template>
    <div class="engine-range">
        <div class="label">
            Engine:
        </div>
        <div class="options">
            <div
                class="option"
                :class="{selected:(engineRange===EngineRange.All)}"
                @click="engineRange=EngineRange.All"
            >
                All
            </div>
            <div
                class="option"
                :class="{selected:(engineRange===EngineRange.VLast)}"
                @click="engineRange=EngineRange.VLast"
            >
                5.4
            </div>
            <div
                class="option"
                :class="{selected:(engineRange===EngineRange.VCurrent)}"
                @click="engineRange=EngineRange.VCurrent"
            >
                5.5
            </div>
            <div
                ref="range"
                class="option"
                :class="{selected:(engineRange===EngineRange.Range)}"
                tabindex="0"
                @click="engineRange=EngineRange.Range"
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
                        :display-function="displaySemVer"
                        :max="MAX_ENGINE"
                        with-display
                    >
                        <span class="label">Min:</span>
                    </UISlider>
                    <UISlider
                        v-model="max"
                        class="slider"
                        :display-function="displaySemVer"
                        :max="MAX_ENGINE"
                        with-display
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

const engineQuery = useRouteQuery<string | null>("engine");

const MAX_ENGINE = 28 + 6; // 5.6
const CURRENT_ENGINE = MAX_ENGINE;
const LAST_ENGINE = MAX_ENGINE - 1;

enum EngineRange {
    All,
    VLast,
    VCurrent,
    Range
}

const deploySelector = ref(false);
const engineRange = ref(EngineRange.All as EngineRange);
const max = ref(MAX_ENGINE);
const min = ref(0);

if (engineQuery.value) {
    const engineSplit = engineQuery.value?.split("-");
    min.value = getEngineValue(engineSplit[0]);
    max.value = getEngineValue(engineSplit[1]);

    if (min.value === max.value && min.value === CURRENT_ENGINE) {
        engineRange.value = EngineRange.VCurrent;
    }
    else if (min.value === max.value && min.value === LAST_ENGINE) {
        engineRange.value = EngineRange.VLast;
    }
    else {
        engineRange.value = EngineRange.Range;
    }
}

watch([engineRange, min, max], (newValue, oldValue) => {
    min.value = validateInput(min.value);
    max.value = validateInput(max.value);

    if (oldValue[1] !== newValue[1]) {
        max.value = Math.max(min.value, max.value);
    }

    if (oldValue[2] !== newValue[2]) {
        min.value = Math.min(min.value, max.value);
    }

    switch (engineRange.value) {
    case EngineRange.VCurrent:
        engineQuery.value = `${ getEngineVersion(CURRENT_ENGINE) }-${ getEngineVersion(CURRENT_ENGINE) }`;
        break;
    case EngineRange.VLast:
        engineQuery.value = `${ getEngineVersion(LAST_ENGINE) }-${ getEngineVersion(LAST_ENGINE) }`;
        break;
    case EngineRange.Range:
        engineQuery.value = `${ getEngineVersion(min.value) }-${ getEngineVersion(max.value) }`;
        break;
    default:
        engineQuery.value = null;
    }
});

function displaySemVer(value: number) {
    return getEngineFromValue(value).join(".");
}

function focusRange() {
    deploySelector.value = true;
}

function getEngineValue(engineVersion: string) {
    const [major, minor] = engineVersion.split(".").map(Number);
    return major === 5 ? minor + 28 : minor;
}

function getEngineFromValue(value: number) {
    return value <= 27 ? [4, value] : [5, value - 28];
}

function getEngineVersion(value: number) {
    const engine = getEngineFromValue(value);
    return `${ engine[0] }.${ engine[1].toString().padStart(2, "0") }`;
}

function unFocusRange(event: FocusEvent) {
    if (!(event.relatedTarget as HTMLElement)?.closest(".range-selector")) {
        deploySelector.value = false;
    }
}

function validateInput(engineVersion: number) {
    if (isNaN(engineVersion)) {
        engineVersion = 0;
    }
    return Math.min(Math.max(engineVersion, 0), MAX_ENGINE);
}
</script>

<style scoped lang="scss">
.engine-range {
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
