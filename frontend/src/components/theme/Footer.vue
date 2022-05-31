<template>
    <div class="footer">
        <a href="https://github.com/hugoattal/OrbitalMarket"><i
            class="lab la-github"
        /> GitHub Repo</a>
        <span class="separator">|</span>
        <a href="https://twitter.com/HugoAttal"><i
            class="lab la-twitter"
        /> Hugo Attal</a>
        <span class="separator">|</span>
        <a href="https://forums.unrealengine.com/unreal-engine/marketplace/1857381-orbital-market-search-engine-for-the-ue-marketplace"><i
            class="las la-comments"
        /> Unreal Topic</a>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({});
</script>

<style scoped lang="scss">
.footer {
    text-align: center;
    padding: var(--length-padding-l);

    .las, .lab {
        font-size: inherit;
    }

    .separator {
        opacity: 0.5;
        padding: var(--length-padding-l);
    }

    a {
        display: inline-block;
        color: var(--color-primary);
        opacity: 0.5;

        &:hover {
            opacity: 1;
        }
    }
}
</style>
