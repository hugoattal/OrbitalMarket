<template>
    <div class="radio-list">
        <div class="label">
            <slot name="label" />
        </div>
        <div class="options">
            <div
                v-for="option in options"
                :key="option.props.key"
                class="option"
                :class="{selected: key === option.props.key}"
                @click="setKey(option.props.key)"
            >
                <VNode :node="option.children.default" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import VNode from "@/components/elements/VNode";

export default defineComponent({
    name: "UIRadioList",
    components: { VNode },
    props: {
        modelValue: {
            type: String,
            default: ""
        }
    },
    emits: ["update:modelValue"],
    data () {
        return {
            key: "",
            options: []
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler () {
                this.key = this.modelValue;
            }
        },
        key () {
            this.$emit("update:modelValue", this.key);
        }
    },
    mounted () {
        this.options = this.$slots.default();
    },
    methods: {
        setKey (key) {
            this.key = key;
        }
    }
});
</script>

<style scoped lang="scss">
.radio-list {
    display: inline-flex;
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
        }

        .selected {
            background: var(--color-primary);
        }
    }
}
</style>
