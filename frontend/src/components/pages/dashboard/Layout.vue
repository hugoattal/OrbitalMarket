<template>
    <div class="page">
        <SupportBar />
        <div class="header">
            <RouterLink to="search">
                <i class="la la-satellite-dish" />
                Back to Search
            </RouterLink>
        </div>
        <div class="content">
            <BanList />
            <FavList />
        </div>
    </div>
</template>

<script lang="ts">
export default {
    name: "DashboardLayout"
};
</script>

<script setup lang="ts">

import SupportBar from "@/components/elements/SupportBar.vue";
import FavList from "@/components/pages/dashboard/FavList.vue";
import BanList from "@/components/pages/dashboard/BanList.vue";
</script>

<style scoped lang="scss">
.page {
    background: var(--color-background);
    color: var(--color-content);
    min-height: 100vh;

    .header {
        background-color: var(--color-content-background);
        border-bottom: 1px solid var(--color-content-light);
        box-shadow: 0 0 10px var(--color-shadow);
        padding: var(--length-padding-s) var(--length-padding-base);

        a {
            display: flex;
            align-items: center;
            gap: var(--length-gap-xs);
            color: var(--color-content-50);

            &:hover {
                color: var(--color-primary);
            }
        }

        .la {
            font-size: 1.55rem;
        }
    }

    .content {
        padding: var(--length-padding-xl);
    }
}
</style>
