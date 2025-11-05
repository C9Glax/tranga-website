<template>
    <div class="flex flex-row flex-wrap">
        <UPageCard
            v-for="n in connectors"
            :key="n.name"
            variant="soft"
            icon="i-lucide-megaphone"
            :title="n.name"
            :description="n.url"
            orientation="horizontal">
            <UButton color="warning" loading-auto class="w-fit justify-self-end" @click="deleteConnector(n)">Delete</UButton>
        </UPageCard>
    </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type NotificationConnector = components['schemas']['NotificationConnector'];
const { $api } = useNuxtApp();

const { data: connectors } = await useApi('/v2/NotificationConnector', { key: FetchKeys.NotificationConnectors.All, server: false });

const deleteConnector = async (connector: NotificationConnector) => {
    await $api('/v2/NotificationConnector/{Name}', { path: { Name: connector.name }, method: 'DELETE' });
    await refreshNuxtData(FetchKeys.NotificationConnectors.All);
};
</script>
