<template>
    <router-view />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Theme from "@/components/theme/theme";

export default defineComponent({
    mounted () {
        Theme.update(Theme.isDarkMode());
    }
});
</script>

<style lang="scss">
@import "style";
</style>
