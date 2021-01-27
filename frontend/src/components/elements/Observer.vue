<template>
    <div class="observer" />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    props: {
        options: {
            type: Object,
            default: () => ({})
        }
    },
    emits: ["intersect"],
    data () {
        return {
            observer: null
        };
    },
    mounted () {
        this.observer = new IntersectionObserver(([entry]) => {
            if (entry && entry.isIntersecting) {
                this.$emit("intersect");
            }
        }, this.options);

        this.observer.observe(this.$el);
    },
    unmounted () {
        this.observer.disconnect();
    }
});
</script>

<style scoped lang="scss">

</style>
