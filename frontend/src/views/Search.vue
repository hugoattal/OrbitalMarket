<template>
    <div class="search">
        <SearchLayout />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SearchLayout from "@/components/pages/search/Layout.vue";

export default defineComponent({
    components: { SearchLayout }
});
</script>

<style scoped lang="scss">
</style>
