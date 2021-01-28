<template>
    <div class="logo">
        <svg class="svg-text">
            <title>Orbital Market</title>
            <use :href="SVGLogoTextURL" />
        </svg>
        <svg class="svg-satellite">
            <title>Satellite</title>
            <use :href="SVGLogoSatelliteURL" />
        </svg>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SVGLogoTextURL from "@/assets/logo_text.svg";
import SVGLogoSatelliteURL from "@/assets/satellite.svg";

export default defineComponent({
    data () {
        return {
            SVGLogoTextURL: `${SVGLogoTextURL}#Logo`,
            SVGLogoSatelliteURL: `${SVGLogoSatelliteURL}#Logo`
        };
    }
});
</script>

<style scoped lang="scss">
.logo {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin: 2vw 0;

    .svg-text {
        width: 50vw;
    }

    .svg-satellite {
        width: 8vw;
        height: 8vw;
        left: calc(50% - 4vw);
        top: calc(50% - 4vw);
        position: absolute;

        animation: shake 8s infinite;

        @keyframes shake {
            0%, 100% {
                transform: translate(0, -10px);
            }

            50% {
                transform: translate(0px, 10px);
            }

        }
    }

    @media (max-width: 800px) {
        .svg-text {
            width: 400px;
        }

        .svg-satellite {
            width: 64px;
            height: 64px;
            left: calc(50% - 32px);
            top: calc(50% - 32px);
        }
    }
}
</style>
