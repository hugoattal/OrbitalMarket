<template>
    <div class="tabs">
        <div class="tabs-bar">
            <div
                v-for="(tab, key) in tabs"
                :key="key"
                class="tab"
                :class="{selected: key === currentTab}"
                @click="currentTab = key"
            >
                <VNode :node="tab.children.title" />
            </div>
        </div>
        <div class="tabs-content">
            <div
                v-for="(tab, key) in tabs"
                :key="key"
            >
                <VNode
                    v-if="key === currentTab"
                    :node="tab.children.content"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import VNode from "@/components/elements/VNode";

export default defineComponent({
    name: "UITabs",
    components: { VNode },
    data () {
        return {
            tabs: [],
            currentTab: 0
        };
    },
    mounted () {
        this.tabs = this.$slots.default();
    }
});
</script>

<style scoped lang="scss">
.tabs {
    .tabs-bar {
        overflow: hidden;
        position: relative;
        z-index: 1;
        display: inline-flex;
        border: 2px solid var(--color-content-highlight);
        border-bottom: none;
        border-top-left-radius: var(--length-radius-base);
        border-top-right-radius: var(--length-radius-base);

        .tab {
            background: var(--color-background);
            padding: var(--length-padding-base);
            border-right: 2px solid var(--color-content-highlight);
            border-bottom: 2px solid var(--color-content-highlight);
            cursor: pointer;
            transition: color var(--duration-fast), background var(--duration-fast);

            &:hover {
                color: var(--color-primary);
            }

            &.selected {
                border-bottom: none;
                background: var(--color-content-background);
            }

            &:last-child {
                border-right: none;
            }
        }
    }

    .tabs-content {
        position: relative;
        top: -2px;
        border: 2px solid var(--color-content-highlight);
        border-radius: var(--length-radius-base);
        border-top-left-radius: 0;
        padding: var(--length-padding-s) var(--length-padding-base);
        background: var(--color-content-background);
    }
}
</style>
