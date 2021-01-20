<template>
    <div class="buttons-bar">
        <Button class="button">
            <i class="las la-clock"></i> Latest
        </Button>
        <Button class="button">
            <i class="las la-gem"></i> Toplist
        </Button>
        <Button class="button">
            <i class="las la-random"></i> Random
        </Button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Button from "@/components/ui/Button.vue";

export default defineComponent({
    components: { Button }
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
