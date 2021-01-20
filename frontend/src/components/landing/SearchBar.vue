<template>
    <div class="search-bar">
        <Input
            class="search-input"
            prefix-icon="la-satellite-dish"
            autofocus
        >
            <template #append>
                <Button class="search-button">Search</Button>
            </template>
        </Input>
        <ThemeSwitcher/>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Input from "@/components/ui/Input.vue";
import ThemeSwitcher from "@/components/theme/ThemeSwitcher.vue";
import Button from "@/components/ui/Button.vue";

export default defineComponent({
    components: { Button, ThemeSwitcher, Input }
});
</script>

<style scoped lang="scss">
.search-bar {
    display: flex;

    & > * {
        margin: 0 var(--length-margin-base);
    }

    .search-input {
        width: 500px;

        .las {
            padding-right: var(--length-padding-base);
            color: var(--color-primary);
        }
    }
}
</style>
