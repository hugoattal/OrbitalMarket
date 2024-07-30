<template>
    <div class="ban-list">
        <h2>Ban List</h2>
        <div class="actions">
            <OButton @click="exportBanList">
                Export to clipboard
            </OButton>
            <OButton @click="importBanList">
                Import from clipboard
            </OButton>
            <OButton @click="clearBanList">
                Clear
            </OButton>
        </div>
        <ul class="lists">
            <li
                v-for="(banName, banId) in configStore.banList"
                :key="banId"
                class="author"
            >
                {{ banName }}
                <i
                    class="las la-times unban-icon"
                    title="Unban this author"
                    @click="unBan(banId)"
                />
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import OButton from "@/components/ui/OButton.vue";
import { useConfigStore } from "@/stores/config";

const configStore = useConfigStore();

async function exportBanList() {
    await navigator.clipboard.writeText(JSON.stringify(configStore.banList));
    alert("Ban list copied to clipboard");
}

function clearBanList() {
    if (!confirm("Are you sure you want to clear the ban list?")) {
        return;
    }

    configStore.banList = {};
}

function importBanList() {
    const input = prompt("Paste the ban list here");
    if (!input) {
        return;
    }

    try {
        const bans = JSON.parse(input);
        for (const banId of Object.keys(bans)) {
            configStore.banList[banId] = bans[banId];
        }
    }
    catch (e) {
        alert("Invalid ban list");
    }
}

function unBan(banId: string) {
    delete configStore.banList[banId];
}
</script>

<style scoped lang="scss">
.ban-list {
    display: flex;
    flex-direction: column;
    gap: var(--length-margin-base);

    h2 {
        margin: 0;
        padding: 0;
        font-size: 2rem;
    }

    .actions {
        display: flex;
        gap: var(--length-margin-s);
    }

    .lists {
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;
        gap: var(--length-gap-s);

        .author {
            display: flex;
            align-items: center;
            gap: var(--length-gap-s);
            border-radius: var(--length-radius-base);
            box-shadow: 0 0 10px var(--color-shadow);
            background: var(--color-content-background);
            border: 1px solid var(--color-content-light);
            padding: var(--length-padding-s) var(--length-padding-base);

            .unban-icon {
                font-size: 1rem;
                cursor: pointer;
                opacity: 0.5;

                &:hover {
                    opacity: 1;
                    color: var(--color-primary);
                }
            }
        }
    }
}
</style>
