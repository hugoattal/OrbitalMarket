<template>
    <div class="display-bar">
        <UIRadioList v-model="configStore.displayType">
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
        <UIRadioButton v-model="searchStore.discounted">
            Discounted
        </UIRadioButton>
        <UIRadioButton v-model="searchStore.favorites">
            Favorites
        </UIRadioButton>
        <UICategorySelect v-model="searchStore.categories" />
        <UIPriceRange v-model="searchStore.priceRange">
            <template #label>
                Price:
            </template>
        </UIPriceRange>
        <UIEngineRange v-model="searchStore.engineRange">
            <template #label>
                Engine:
            </template>
        </UIEngineRange>
        <UITimeRange v-model="searchStore.timeRange">
            <template #label>
                Released:
            </template>
        </UITimeRange>
    </div>
</template>

<script setup lang="ts">
import UIRadioList from "@/components/ui/RadioList.vue";
import UIRadioElement from "@/components/ui/RadioElement.vue";
import UIPriceRange from "@/components/ui/range/PriceRange.vue";
import UIEngineRange from "@/components/ui/range/EngineRange.vue";
import UIRadioButton from "@/components/ui/RadioButton.vue";
import UICategorySelect from "@/components/ui/CategorySelect.vue";
import UITimeRange from "@/components/ui/range/TimeRange.vue";
import { useConfigStore } from "@/stores/config";
import { useSearchStore } from "@/stores/search";

const configStore = useConfigStore();
const searchStore = useSearchStore();
</script>

<style scoped lang="scss">
.display-bar {
    display: flex;
    gap: var(--length-margin-base);
    flex-wrap: wrap;
}
</style>
