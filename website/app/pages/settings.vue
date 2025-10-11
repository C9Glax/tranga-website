<template>
    <UPageBody>
        <UPageSection title="Settings" />
        <UPageSection title="Libraries" orientation="horizontal">
            <template #footer>
                <UButton icon="i-lucide-plus" class="w-fit" @click="addLibraryModal.open()">Add</UButton>
            </template>
            <FileLibraries />
        </UPageSection>
        <UPageSection title="Maintenance" orientation="horizontal">
            <div class="flex flex-col gap-1 items-end basis-1">
                <UButton icon="i-lucide-database" :loading="cleanUpDatabaseBusy" class="w-fit" @click="cleanUpDatabase"
                    >Clean database</UButton
                >
            </div>
        </UPageSection>
    </UPageBody>
</template>

<script setup lang="ts">
import { LazyAddLibraryModal } from '#components';
import FileLibraries from '~/components/FileLibraries.vue';
import { refreshNuxtData } from '#app';
const overlay = useOverlay();

const addLibraryModal = overlay.create(LazyAddLibraryModal);

const cleanUpDatabaseBusy = ref(false);
const cleanUpDatabase = async () => {
    cleanUpDatabaseBusy.value = true;
    await useApi('/v2/Maintenance/CleanupNoDownloadManga', { method: 'POST' })
        .then(() => refreshNuxtData(FetchKeys.Manga.All))
        .finally(() => (cleanUpDatabaseBusy.value = false));
};
</script>
