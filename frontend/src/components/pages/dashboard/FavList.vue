<template>
    <div class="fav-list">
        <h2>Favlist</h2>
        {{ configStore.favSet }}
    </div>
</template>

<script lang="ts">
export default {
    name: "FavList"
};
</script>

<script setup lang="ts">
import { useConfigStore } from "@/stores/config";

const configStore = useConfigStore();
</script>

<style scoped lang="scss">
.fav-list {
    h2 {
        margin: 0;
        padding: 0;
        font-size: 2rem;
    }
}
</style>
