<template>
    <div class="buttons-bar">
        <Button
            class="button"
            @click="goToLatest"
        >
            <i class="las la-clock" /> Latest
        </Button>
        <Button
            class="button"
            @click="goToToplist"
        >
            <i class="las la-rocket" /> Toplist
        </Button>
        <Button
            class="button"
            @click="goToUpdated"
        >
            <i class="las la-wrench" /> Updated
        </Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/ui/Button.vue";
import router from "@/router";

export default defineComponent({
    components: { Button },
    methods: {
        goToLatest () {
            router.push({ name: "search", query: { sortField: "releaseDate", sortDirection: "desc" } });
        },
        goToToplist () {
            router.push({ name: "search" });
        },
        goToUpdated () {
            router.push({ name: "search", query: { sortField: "lastUpdate", sortDirection: "desc" } });
        }
    }
});
</script>

<style scoped lang="scss">
.buttons-bar {
    margin-top: var(--length-margin-base);
    display: flex;

    .button {
        margin: 0 var(--length-margin-base);
        width: 122px;
        display: flex;

        .las {
            margin-right: var(--length-margin-s);
        }
    }
}
</style>
