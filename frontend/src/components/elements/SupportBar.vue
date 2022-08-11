<template>
    <div class="support-bar">
        <span>🇺🇦 Orbital Market stands with Ukraine. <a
            href="https://www.icrc.org/en/donate/ukraine"
            target="_blank"
        >Support the Red Cross</a></span>
    </div>
</template>

<script lang="ts">
export default {
    name: "SupportBar"
};
</script>

<script setup lang="ts">

</script>

<style scoped lang="scss">


.support-bar {
    display: flex;
    justify-content: center;
    padding: var(--length-padding-base);
    text-align: center;

    a {
        color: #ffd500;
        font-weight: 600;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>
