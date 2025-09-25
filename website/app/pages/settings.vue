<template>
    <UPageSection title="Settings"> </UPageSection>
    <UPageSection title="Libraries" orientation="horizontal">
        <FileLibraries />
        <UButton icon="i-lucide-plus" @click="() => addLibraryModal.open()" class="w-fit">Add</UButton>
    </UPageSection>
    <UPageSection title="Maintenance" orientation="horizontal">
        <div class="flex flex-col gap-1 items-end basis-1">
            <UButton icon="i-lucide-database" :loading="cleanUpDatabaseBusy" @click="cleanUpDatabase" class="w-fit"
                >Clean database</UButton
            >
        </div>
    </UPageSection>
</template>

<script setup lang="ts">
import { LazyAddLibraryModal } from '#components';
const overlay = useOverlay();
const config = useRuntimeConfig();

const addLibraryModal = overlay.create(LazyAddLibraryModal);

import FileLibraries from '~/components/FileLibraries.vue';

const cleanUpDatabaseBusy = ref(false);
const cleanUpDatabase = () => {
    cleanUpDatabaseBusy.value = true;
    $fetch(`${config.public.openFetch.api.baseURL}v2/Maintenance/CleanupNoDownloadManga`).finally(
        () => (cleanUpDatabaseBusy.value = false)
    );
};
</script>
