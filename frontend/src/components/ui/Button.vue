<template>
    <component
        :is="componentTag"
        class="button"
        :href="href"
        :target="target"
        @click="$emit('click')"
    >
        <slot />
    </component>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "UIButton",
    props: {
        href: {
            type: String,
            default: ""
        },
        target: {
            type: String,
            default: ""
        }
    },
    emits: ["click"],
    computed: {
        componentTag () {
            return this.href ? "a" : "div";
        }
    }
});
</script>

<style scoped lang="scss">
.button {
    height: var(--length-button-base);

    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    border: var(--length-border-base) solid var(--color-primary);
    border-radius: var(--length-radius-base);
    cursor: pointer;
    transition: all var(--duration-fast);

    padding: var(--length-padding-base);

    &:hover {
        color: var(--color-primary);
    }
}

.prepend .button {
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    margin-right: 0;
}

.append .button {
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    margin-left: 0;
}
</style>
