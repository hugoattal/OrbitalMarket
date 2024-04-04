<template>
    <div
        class="category-select"
        tabindex="0"
        @focusin="focusRange"
        @focusout="unFocusRange"
    >
        Categories
        <div
            v-if="deploySelector"
            class="category-selector"
        >
            <div
                class="toggle"
                @click="toggleAll"
            >
                Toggle All
            </div>
            <div
                v-for="category of categories"
                :key="category"
                class="category"
                @click="category.selected = !category.selected"
            >
                <i
                    class="las la-check-square icon"
                    :class="{hidden: !category.selected}"
                />
                <span class="name">{{ category.name }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "UICategorySelect"
};
</script>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";

const deploySelector = ref(false);

function focusRange() {
    deploySelector.value = true;
}

function unFocusRange() {
    deploySelector.value = false;
}

type TCategory = {
    name: string;
    selected: boolean;
};
type TCategories = Array<TCategory>;

const emits = defineEmits<{
    (e: "update:modelValue", categories: Array<string>): void;
}>();

const categories = reactive([
    { name: "2d", selected: false },
    { name: "animations", selected: false },
    { name: "archvis", selected: false },
    { name: "blueprints", selected: false },
    { name: "characters", selected: false },
    { name: "codeplugins", selected: false },
    { name: "environments", selected: false },
    { name: "features", selected: false },
    { name: "fx", selected: false },
    { name: "games", selected: false },
    { name: "materials", selected: false },
    { name: "megascans", selected: false },
    { name: "music", selected: false },
    { name: "onlinelearning", selected: false },
    { name: "props", selected: false },
    { name: "showcasedemos", selected: false },
    { name: "soundfx", selected: false },
    { name: "textures", selected: false },
    { name: "weapons", selected: false }
] as TCategories);

function toggleAll() {
    const toggleTo = !categories[0].selected;

    for (const category of categories) {
        category.selected = toggleTo;
    }
}

watch(categories, () => {
    emits("update:modelValue", categories
        .filter((category) => category.selected)
        .map((category) => category.name)
    );
}, {
    immediate: true
});
</script>

<style scoped lang="scss">
.category-select {
    display: flex;
    border: 2px solid var(--color-primary);
    border-radius: var(--length-radius-base);

    height: var(--length-button-base);
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: var(--length-padding-base);
    gap: var(--length-padding-base);

    cursor: pointer;
    position: relative;

    &:focus {
        border-bottom-left-radius: 0;
    }

    &:hover:not(.selected) {
        color: var(--color-primary);
    }

    .category-selector {
        position: absolute;
        left: -2px;
        z-index: 1000;
        top: calc(100%);
        background: var(--color-background);
        border: 2px solid var(--color-primary);
        border-bottom-left-radius: var(--length-radius-base);
        border-bottom-right-radius: var(--length-radius-base);
        border-top-right-radius: var(--length-radius-base);
        display: flex;
        flex-direction: column;

        .toggle {
            color: var(--color-content);
            padding: var(--length-padding-s) var(--length-padding-base);

            &:hover {
                background: var(--color-primary);

                .icon.la-check-square {
                    color: var(--color-content);
                }
            }
        }

        .category {
            color: var(--color-content);
            padding: var(--length-padding-s) var(--length-padding-base);
            display: flex;
            align-items: baseline;
            gap: var(--length-gap-s);


            &:hover {
                background: var(--color-primary);

                .icon.la-check-square {
                    color: var(--color-content);
                }
            }

            .name {
                text-transform: capitalize;
                display: inline-block;
            }

            .icon {
                font-size: 0.8rem;

                &.la-check-square {
                    color: var(--color-primary);
                }

                &.hidden {
                    opacity: 0;
                }
            }
        }
    }
}
</style>
