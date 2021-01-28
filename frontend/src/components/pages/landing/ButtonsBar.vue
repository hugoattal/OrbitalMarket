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

    @media screen and (max-width: 500px) {
        flex-direction: column;
    }

    .button {
        margin: 0 var(--length-margin-base);
        width: 122px;
        display: flex;

        @media screen and (max-width: 500px) {
            width: calc(100vw - 2 * var(--length-margin-base) - 2 * var(--length-margin-s));
            flex-basis: 0;
            margin-bottom: var(--length-margin-base);

            &:last-child {
                margin-bottom: 0;
            }
        }

        .las {
            margin-right: var(--length-margin-s);
        }
    }
}
</style>
