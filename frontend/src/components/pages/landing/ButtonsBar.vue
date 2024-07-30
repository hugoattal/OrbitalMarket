<template>
    <div class="buttons-bar">
        <Button
            class="button"
            @click="goToToplist"
        >
            <i class="las la-rocket" /> Most popular
        </Button>
        <Button
            class="button"
            @click="goToLatest"
        >
            <i class="las la-clock" /> Latest releases
        </Button>
        <Button
            class="button"
            @click="goToReviewed"
        >
            <i class="lar la-star" /> Most reviewed
        </Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/ui/OButton.vue";
import router from "@/router";

export default defineComponent({
    components: { Button },
    methods: {
        goToLatest () {
            router.push({ name: "search", query: { sortDirection: "desc", sortField: "releaseDate" } });
        },
        goToReviewed () {
            router.push({ name: "search", query: { sortDirection: "desc", sortField: "reviews" } });
        },
        goToToplist () {
            router.push({ name: "search" });
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
        width: 168px;
        display: flex;

        @media screen and (max-width: 500px) {
            width: calc(100vw - 2 * var(--length-margin-base) - 2 * var(--length-margin-s));
            flex-basis: 0;
            margin-bottom: var(--length-margin-base);

            &:last-child {
                margin-bottom: 0;
            }
        }

        .las, .lar {
            margin-right: var(--length-margin-s);
        }
    }
}
</style>
