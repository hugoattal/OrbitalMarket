<template>
    <div class="page">
        <Background />
        <div class="content">
            <div class="title">
                You got lost in space.
            </div>
            <div class="text">
                <router-link to="/">
                    Quick, click here to find the orbital market!
                </router-link>
            </div>
        </div>
        <Footer class="footer" />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Background from "@/components/pages/landing/Background.vue";
import Footer from "@/components/theme/Footer.vue";

export default defineComponent({
    name: "NotFoundLayout",
    components: { Footer, Background }
});
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .content {
        z-index: 1;
        flex-direction: column;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: var(--length-margin-base);
        gap: var(--length-padding-l);
        padding: var(--length-padding-l);

        .title {
            font-size: 64px;
            font-weight: bold;
        }

        .text {
            font-size: 16px;
            color: var(--color-primary);

            &:hover {
                color: var(--color-content);
            }
        }
    }

    .footer {
        position: absolute;
        z-index: 5;
        bottom: 0;
        right: 0;
        left: 0;
    }
}
</style>
