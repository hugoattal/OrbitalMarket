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
        <UIPriceRange v-model="priceRange">
            <template #label>
                Price:
            </template>
        </UIPriceRange>
        <UIRadioButton v-model="discounted">
            Discounted
        </UIRadioButton>
        <UIEngineRange v-model="engineRange">
            <template #label>
                Engine:
            </template>
        </UIEngineRange>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StorageModule from "@/modules/storage.module";
import UIRadioList from "@/components/ui/RadioList.vue";
import UIRadioElement from "@/components/ui/RadioElement.vue";
import UIPriceRange from "@/components/ui/PriceRange.vue";
import UIEngineRange from "@/components/ui/EngineRange.vue";
import UIRadioButton from "@/components/ui/RadioButton.vue";

export default defineComponent({
    components: { UIEngineRange, UIPriceRange, UIRadioButton, UIRadioElement, UIRadioList },
    emits: ["update:modelValue"],
    data () {
        return {
            discounted: false,
            displayType: StorageModule.getElement("displayType", "square"),
            engineRange: {},
            priceRange: {}
        };
    },
    watch: {
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
        }
    },
    methods: {
        updateValue () {
            const options = {};

            options.displayType = this.displayType;

            if (Object.keys(this.priceRange).length) {
                options.priceRange = this.priceRange;
            }

            if (Object.keys(this.engineRange).length) {
                options.engineRange = this.engineRange;
            }

            if (this.discounted) {
                options.discounted = this.discounted;
            }

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
