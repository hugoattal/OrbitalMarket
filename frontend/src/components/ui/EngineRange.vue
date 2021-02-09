<template>
    <div class="price-range">
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
                :class="{selected:(engineRange===EngineRange.V426)}"
                @click="engineRange=EngineRange.V426"
            >
                4.26
            </div>
            <div
                class="option"
                :class="{selected:(engineRange===EngineRange.V425)}"
                @click="engineRange=EngineRange.V425"
            >
                4.25
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
                        with-input
                        prepend="4."
                        class="slider"
                        :max="MAX_ENGINE"
                    >
                        <span class="label">Min:</span>
                    </UISlider>
                    <UISlider
                        v-model="max"
                        with-input
                        prepend="4."
                        class="slider"
                        :max="MAX_ENGINE"
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

const MAX_ENGINE = 26;

enum EngineRange {
    All,
    V426,
    V425,
    Range
}

export default defineComponent({
    name: "UIEngineRange",
    components: { UISlider },
    emits: ["update:modelValue"],
    data () {
        return {
            min: 0,
            max: MAX_ENGINE,
            engineRange: EngineRange.All as EngineRange,
            EngineRange,
            MAX_ENGINE,
            deploySelector: false,
            debounceUpdate: debounce(this.updateValue, 500)
        };
    },
    computed: {
        value () {
            switch (this.engineRange) {
            case EngineRange.V426:
                return { min: [4, 26], max: [4, 26] };
            case EngineRange.V425:
                return { min: [4, 25], max: [4, 25] };
            case EngineRange.Range:
                return { min: [4, this.min], max: [4, this.max] };
            }
            return {};
        }
    },
    watch: {
        engineRange () {
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
        unFocusRange (event: FocusEvent) {
            if (!this.$refs.range.contains(event.relatedTarget)) {
                this.deploySelector = false;
            }
        },
        validateInput (engineVersion) {
            if (isNaN(engineVersion)) {
                engineVersion = 0;
            }
            return Math.min(Math.max(engineVersion, 0), MAX_ENGINE);
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
