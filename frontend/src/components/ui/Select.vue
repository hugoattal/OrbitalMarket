<template>
    <div
        class="select-wrapper"
    >
        <label :for="elementId">
            {{ label }}
        </label>:
        <div
            ref="select"
            class="select"
            tabindex="0"
            @focusin="deploy = true"
            @focusout="deploy = false"
        >
            <input
                :id="elementId"
                :value="value"
                type="button"
                readonly
            >
            <ul
                v-if="deploy"
                class="select-options"
            >
                <li
                    v-for="optionKey in Object.keys(options)"
                    :key="optionKey"
                    @click.prevent="setKey(optionKey)"
                >
                    {{ options[optionKey] }}
                </li>
            </ul>
            <div
                class="arrow"
                :class="{deploy}"
            >
                <i class="las la-caret-down" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { getUniqueId } from "@/modules/id.module";

export default defineComponent({
    name: "UISelect",
    props: {
        label: {
            type: String,
            required: true
        },
        options: {
            type: Object as PropType<Record<string, string>>,
            required: true
        },
        modelValue: {
            type: String,
            default: ""
        }
    },
    emits: ["update:modelValue"],
    data () {
        return {
            key: "",
            deploy: false,
            elementId: `select-${getUniqueId()}`
        };
    },
    computed: {
        value () {
            return this.options[this.key];
        }
    },
    watch: {
        modelValue: {
            immediate: true,
            handler () {
                this.key = this.modelValue;
            }
        },
        value () {
            this.$emit("update:modelValue", this.key);
        }
    },
    methods: {
        setKey (key) {
            this.key = key;
            this.$refs.select.blur();
        }
    }
});
</script>

<style scoped lang="scss">
.select-wrapper {
    height: var(--length-button-base);
    position: relative;

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    border: var(--length-border-base) solid var(--color-primary);
    border-radius: var(--length-radius-base);
    transition: all var(--duration-fast);

    padding: var(--length-padding-base);

    .select {
        width: 0;
        flex-grow: 1;
        background: none;
        height: var(--length-button-base);
        cursor: pointer;
        position: relative;

        input {
            font-weight: bold;
            height: 100%;
            width: 100%;
            box-sizing: border-box;
            padding-right: var(--length-padding-l);
            padding-left: var(--length-padding-s);
            pointer-events: none;
            text-align: left;
        }

        &:hover{
            input, .arrow {
                color: var(--color-primary);
            }
        }
    }

    .select-options {
        margin: 0;
        padding: 0;
        position: absolute;
        z-index: 1000;
        top: 100%;
        left: 0;
        right: 0;
        border: 2px solid var(--color-primary);
        border-bottom-left-radius: var(--length-radius-base);
        border-bottom-right-radius: var(--length-radius-base);
        border-top: none;
        overflow: hidden;

        background: var(--color-background);

        li {
            padding: var(--length-padding-s) var(--length-padding-base);
            list-style-type: none;

            &:hover {
                color: var(--color-primary);
                background: var(--color-content-background);
            }
        }
    }

    .arrow {
        position: absolute;
        right: 0;
        pointer-events: none;
        top: calc(50% - 12px);
        transition: transform var(--duration-fast);

        &.deploy {
            transform: translateY(2px) rotate(180deg);
        }
    }
}
</style>
