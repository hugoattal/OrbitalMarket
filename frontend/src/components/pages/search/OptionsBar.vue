<template>
    <div class="display-bar">
        <UIRadioList v-model="displayType">
            <template #label>
                Display:
            </template>
            <UIRadioElement key="box">
                <div title="3D Box">
                    <i class="las la-cube" />
                </div>
            </UIRadioElement>
            <UIRadioElement key="square">
                <div title="2D Square">
                    <i class="las la-stop" />
                </div>
            </UIRadioElement>
            <UIRadioElement key="list">
                <div title="List">
                    <i class="las la-stream" />
                </div>
            </UIRadioElement>
        </UIRadioList>
        <UIRadioButton v-model="discounted">
            Discounted
        </UIRadioButton>
        <UICategorySelect v-model="categories" />
        <UIPriceRange v-model="priceRange">
            <template #label>
                Price:
            </template>
        </UIPriceRange>
        <UIEngineRange v-model="engineRange">
            <template #label>
                Engine:
            </template>
        </UIEngineRange>
        <UITimeRange v-model="timeRange">
            <template #label>
                Released:
            </template>
        </UITimeRange>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StorageModule from "@/modules/storage.module";
import UIRadioList from "@/components/ui/RadioList.vue";
import UIRadioElement from "@/components/ui/RadioElement.vue";
import UIPriceRange from "@/components/ui/range/PriceRange.vue";
import UIEngineRange from "@/components/ui/range/EngineRange.vue";
import UIRadioButton from "@/components/ui/RadioButton.vue";
import UICategorySelect from "@/components/ui/CategorySelect.vue";
import UITimeRange from "@/components/ui/range/TimeRange.vue";

export default defineComponent({
    components: { UICategorySelect, UIEngineRange, UIPriceRange, UIRadioButton, UIRadioElement, UIRadioList, UITimeRange },
    emits: ["update:modelValue"],
    data () {
        return {
            categories: [],
            discounted: false,
            displayType: StorageModule.getElement("displayType", "square"),
            engineRange: {},
            priceRange: {},
            timeRange: {}
        };
    },
    watch: {
        categories: {
            handler () {
                this.updateValue();
            }
        },
        discounted: {
            handler () {
                this.updateValue();
            }
        },
        displayType: {
            handler () {
                StorageModule.setElement("displayType", this.displayType);
                this.updateValue();
            },
            immediate: true
        },
        engineRange: {
            handler () {
                this.updateValue();
            }
        },
        priceRange: {
            handler () {
                this.updateValue();
            }
        },
        timeRange: {
            handler () {
                this.updateValue();
            }
        }
    },
    methods: {
        updateValue () {
            const options = {} as Record<string, any>;

            options.displayType = this.displayType;

            if (Object.keys(this.priceRange).length) {
                options.priceRange = this.priceRange;
            }

            if (Object.keys(this.engineRange).length) {
                options.engineRange = this.engineRange;
            }

            if (Object.keys(this.timeRange).length) {
                options.timeRange = this.timeRange;
            }

            if (this.discounted) {
                options.discounted = this.discounted;
            }

            options.categories = this.categories;

            this.$emit("update:modelValue", options);
        }
    }
});
</script>

<style scoped lang="scss">
.display-bar {
    display: flex;
    gap: var(--length-margin-l);
    flex-wrap: wrap;
}
</style>
