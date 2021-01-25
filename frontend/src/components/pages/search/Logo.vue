<template>
    <div
        class="logo"
        @click="goToHome"
    >
        <svg class="svg-logo">
            <use :href="SVGLogoURL" />
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SVGLogoURL from "@/assets/logo_full.svg";
import router from "@/router";

export default defineComponent({
    data () {
        return {
            SVGLogoURL: `${SVGLogoURL}#Logo`
        };
    },
    methods: {
        goToHome () {
            router.push({ name: "landing" });
        }
    }
});
</script>

<style scoped lang="scss">
.logo {
    padding-bottom: var(--length-padding-s);
    cursor: pointer;

    .svg-logo {
        width: 300px;
        height: 60px;
        color: var(--color-content);
    }
}
</style>
