<template>
    <UPageSection title="Settings"/>
    <UPageSection title="Libraries" orientation="horizontal">
        <FileLibraries />
        <UButton icon="i-lucide-plus" class="w-fit" @click="() => addLibraryModal.open()">Add</UButton>
    </UPageSection>
    <UPageSection title="Maintenance" orientation="horizontal">
        <div class="flex flex-col gap-1 items-end basis-1">
            <UButton icon="i-lucide-database" :loading="cleanUpDatabaseBusy" class="w-fit" @click="cleanUpDatabase"
                >Clean database</UButton
            >
        </div>
    </UPageSection>
</template>

<script setup lang="ts">
import { LazyAddLibraryModal } from '#components';

import FileLibraries from '~/components/FileLibraries.vue';
const overlay = useOverlay();
const config = useRuntimeConfig();

const addLibraryModal = overlay.create(LazyAddLibraryModal);

const cleanUpDatabaseBusy = ref(false);
const cleanUpDatabase = () => {
    cleanUpDatabaseBusy.value = true;
    $fetch(`${config.public.openFetch.api.baseURL}v2/Maintenance/CleanupNoDownloadManga`).finally(
        () => (cleanUpDatabaseBusy.value = false)
    );
};
</script>
