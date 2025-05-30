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

<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useRouteQuery } from "@vueuse/router";

const deploySelector = ref(false);
const categoriesQuery = useRouteQuery("categories");

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

const categories = reactive([
    { name: "2d-asset", selected: false },
    { name: "3d-model", selected: false },
    { name: "animation", selected: false },
    { name: "audio", selected: false },
    { name: "education-tutorial", selected: false },
    { name: "environment", selected: false },
    { name: "game-system", selected: false },
    { name: "game-template", selected: false },
    { name: "hdri", selected: false },
    { name: "material", selected: false },
    { name: "smart-asset", selected: false },
    { name: "tool-and-plugin", selected: false },
    { name: "ui", selected: false },
    { name: "vfx", selected: false }
] as TCategories);

if (categoriesQuery.value) {
    const queryCategories = categoriesQuery.value.split(",");

    for (const category of categories) {
        category.selected = queryCategories.includes(category.name);
    }
}

function toggleAll() {
    const toggleTo = !categories[0].selected;

    for (const category of categories) {
        category.selected = toggleTo;
    }
}

watch(categories, () => {
    if (categories.every((category) => category.selected)) {
        categoriesQuery.value = null;
        return;
    }

    if (categories.every((category) => !category.selected)) {
        categoriesQuery.value = null;
        return;
    }

    categoriesQuery.value = categories
        .filter((category) => category.selected)
        .map((category) => category.name)
        .join(",");
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
            white-space: nowrap;


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
