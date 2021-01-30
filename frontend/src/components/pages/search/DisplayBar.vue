<template>
    <UIRadioList v-model="displayType">
        <template #label>
            Display:
        </template>
        <UIRadioElement key="box">
            <i class="las la-cube" />
        </UIRadioElement>
        <UIRadioElement key="square">
            <i class="las la-stop" />
        </UIRadioElement>
        <UIRadioElement key="list">
            <i class="las la-stream" />
        </UIRadioElement>
    </UIRadioList>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import StorageModule from "@/modules/storage.module";
import UIRadioList from "@/components/ui/RadioList.vue";
import UIRadioElement from "@/components/ui/RadioElement.vue";

export default defineComponent({
    components: { UIRadioElement, UIRadioList },
    emits: ["update:modelValue"],
    data () {
        return {
            displayType: StorageModule.getElement("displayType", "box")
        };
    },
    watch: {
        displayType: {
            handler () {
                StorageModule.setElement("displayType", this.displayType);
                this.$emit("update:modelValue", this.displayType);
            },
            immediate: true
        }
    }
});
</script>

<style scoped lang="scss">

</style>
