<template>
    <div class="scene">
        <div class="box">
            <div
                class="front"
                :style="frontBackground"
            />
            <div
                class="side"
                :style="sideBackground"
            />
        </div>
    </div>
</template>

<script lang="ts">
import SVGUnrealLogoTextURL from "@/assets/unreal/side_package.png";
import { defineComponent } from "vue";

export default defineComponent({
    name: "UIBox3D",
    props: {
        background: {
            type: String,
            required: true
        }
    },
    data () {
        return {
            sideBackground: { backgroundImage: `url(${SVGUnrealLogoTextURL})` }
        };
    },
    computed: {
        frontBackground () {
            return {
                backgroundImage: `url(${ this.background })`
            };
        }
    }
});
</script>

<style scoped lang="scss">
.scene {
    width: 150px;
    height: 120px;
    perspective: 300px;

    .box {
        width: 150px;
        height: 150px;
        position: relative;
        transform-style: preserve-3d;
        transform: translate3d(0px, 25px, 0) rotate3d(0, 1, 0, 25deg);

        .front {
            position: absolute;
            width: 100px;
            height: 80px;
            background-color: var(--color-background);
            background-size: contain;
            background-position: center center;
            background-repeat: no-repeat;
            box-shadow: 0 0 5px var(--color-shadow-dark), inset 0 0 20px var(--color-shadow);
            transform: translate3d(40px, 0px, 0px);
            border: 1px solid black;
            box-sizing: border-box;
        }

        .side {
            background-size: contain;
            background-repeat: no-repeat;
            background-color: black;
            position: absolute;
            width: 40px;
            height: 80px;
            transform: translate3d(20px, 0px, -20px) rotate3d(0, 1, 0, -90deg);
            box-shadow: 0 0 5px var(--color-shadow-dark);
        }
    }
}
</style>
