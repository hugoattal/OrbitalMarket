<template>
    <div class="history">
        <p>
            <b>Warning:</b><br>
            - The price history does not take sales into account. This is only the raw prices history.<br>
            - Some high prices anterior to 02/2021 may be shifted of a few dollars.<br>
            - Generally speaking, there might be some bugs, this feature is experimental.
        </p>
        <br >
        <div class="head">
            <div class="header">
                Price
            </div>
            <div class="header">
                Date
            </div>
        </div>
        <div
            v-for="(price, key) of sortedHistory"
            :key="key"
            class="content">
            <div class="element">
                {{ displayPrice(price.value) }}
            </div>
            <div class="element">
                {{ displayDate(price.date) }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "ProductHistory"
};
</script>

<script setup lang="ts">
import { computed } from "vue";
import { displayDate, displayPrice } from "@/components/product/product";

const props = defineProps<{
    history: Array<{
        value: string,
        date: string
    }>
}>()

const sortedHistory = computed(() => {
    return props.history
        .map((element)=> ({value: element.value, date: new Date(element.date)}))
        .sort((a,b)=> b.date.getTime() - a.date.getTime())
})
</script>

<style scoped lang="scss">
.history {
    .head {
        display: flex;
        gap: var(--length-gap-s);

        .header {
            width: 120px;
            background: var(--color-background);
            padding: var(--length-padding-s) var(--length-padding-base);
            border-radius: var(--length-radius-base);
        }
    }

    .content {
        display: flex;
        gap: var(--length-gap-s);

        .element {
            width: 120px;
            padding: var(--length-padding-s) var(--length-padding-base);
        }
    }
}
</style>
