<template>
    <div class="external-link">
        <span
            class="link"
            @click="isOpenned = !isOpenned"
        >
            Imagine Blueprints, but for JavaScript... Discover Luna Park 🎡! <i
                class="las la-caret-left"
                :class="{open: isOpenned}"
            />
        </span>
        <div
            v-if="isOpenned"
            class="description"
        >
            Hey everyone! So I've been building some kind of Blueprint for Javascript.<br>
            It's called Luna Park and it's out of early access, you can <a
                href="https://luna-park.app/"
                target="_blank"
            >try it out here <i class="las la-external-link-alt" /></a>.<br>
            I also created a little game to learn how to use it, you can <a
                href="https://luna-park.app/challenge/"
                target="_blank"
            >play here <i class="las la-external-link-alt" /></a>!<br>
            <br>
            Hope you didn't mind this little ad ❤️ - Hugo
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "ExternalLink"
};
</script>

<script setup lang="ts">
import { ref } from "vue";

const isOpenned = ref(false);
</script>

<style scoped lang="scss">
.external-link {
    padding: var(--length-padding-l);
    display: flex;
    flex-direction: column;
    align-items: center;

    .link {
        color: var(--color-content-30);
        cursor: pointer;

        &:hover {
            color: var(--color-content);
        }

        .las {
            font-size: 0.8rem;

            &.open {
                transform: rotate(-90deg);
            }
        }
    }

    .description {
        padding: var(--length-padding-base);
        background: var(--color-background);
        border-radius: var(--length-radius-base);
        margin-top: var(--length-margin-s);

        a {
            color: var(--color-primary);

            &:hover {
                text-decoration: underline;
            }
        }

        .las {
            font-size: 0.8rem;
        }
    }
}
</style>
