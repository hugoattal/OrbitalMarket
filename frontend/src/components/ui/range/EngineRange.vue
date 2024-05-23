<template>
    <div class="engine-range">
        <div class="label">
            <slot name="label" />
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
                :class="{selected:(engineRange===EngineRange.V5_3)}"
                @click="engineRange=EngineRange.V5_3"
            >
                5.3
            </div>
            <div
                class="option"
                :class="{selected:(engineRange===EngineRange.V5_4)}"
                @click="engineRange=EngineRange.V5_4"
            >
                5.4
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

<script lang="ts">
import { defineComponent } from "vue";
import { debounce } from "lodash";
import UISlider from "@/components/ui/Slider.vue";

const MAX_ENGINE = 28 + 4; // 5.4

enum EngineRange {
    All,
    V5_3,
    V5_4,
    Range
}

export default defineComponent({
    name: "UIEngineRange",
    components: { UISlider },
    emits: ["update:modelValue"],
    data() {
        return {
            debounceUpdate: debounce(this.updateValue, 500),
            deploySelector: false,
            engineRange: EngineRange.All as EngineRange,
            EngineRange,
            max: MAX_ENGINE,
            MAX_ENGINE,
            min: 0
        };
    },
    computed: {
        value() {
            switch (this.engineRange) {
            case EngineRange.V5_4:
                return { max: "5.04", min: "5.04" };
            case EngineRange.V5_3:
                return { max: "5.03", min: "5.03" };
            case EngineRange.Range:
                return { max: this.getEngineVersion(this.max), min: this.getEngineVersion(this.min) };
            }
            return {};
        }
    },
    watch: {
        engineRange() {
            this.updateValue();
        },
        max() {
            this.max = this.validateInput(this.max);
            this.min = Math.min(this.min, this.max);
            this.debounceUpdate();
        },
        min() {
            this.min = this.validateInput(this.min);
            this.max = Math.max(this.min, this.max);
            this.debounceUpdate();
        }
    },
    methods: {
        displaySemVer(value: number) {
            return this.getEngineFromValue(value).join(".");
        },
        focusRange() {
            this.deploySelector = true;
        },
        getEngineFromValue(value: number) {
            return value <= 27 ? [4, value] : [5, value - 28];
        },
        getEngineVersion(value: number) {
            const engine = this.getEngineFromValue(value);
            return `${ engine[0] }.${ engine[1].toString().padStart(2, "0") }`;
        },
        unFocusRange(event: FocusEvent) {
            if (!this.$refs.range.contains(event.relatedTarget)) {
                this.deploySelector = false;
            }
        },
        updateValue() {
            this.$emit("update:modelValue", this.value);
        },
        validateInput(engineVersion: number) {
            if (isNaN(engineVersion)) {
                engineVersion = 0;
            }
            return Math.min(Math.max(engineVersion, 0), MAX_ENGINE);
        }
    }
});
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
