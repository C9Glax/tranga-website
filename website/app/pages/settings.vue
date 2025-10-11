<template>
    <UPageBody>
        <UPageSection title="Settings">
            <UCard>
                <template #header>
                    <h1>Libraries</h1>
                </template>
                <template #footer>
                    <UButton icon="i-lucide-plus" class="w-fit" @click="addLibraryModal.open()">Add</UButton>
                </template>
                <FileLibraries />
            </UCard>
            <UCard>
                <template #header>
                    <h1>Maintenance</h1>
                </template>
                <div class="flex flex-col gap-1 items-end basis-1">
                    <UButton
                        icon="i-lucide-database"
                        :loading="cleanUpDatabaseBusy"
                        class="w-fit"
                        @click="cleanUpDatabase"
                        >Clean database</UButton
                    >
                </div>
                <UFormField label="API Url" name="apiUrl">
                    <UInput v-model="apiUrl" class="max-w-full w-lg" placeholder="http://<ip:port>/" />
                    <UButton :loading="reloading" class="mx-1" @click="setUrl">Set</UButton>
                </UFormField>
            </UCard>
        </UPageSection>
    </UPageBody>
</template>

<script setup lang="ts">
import { LazyAddLibraryModal } from '#components';
import FileLibraries from '~/components/FileLibraries.vue';
import { refreshNuxtData } from '#app';
const overlay = useOverlay();

const addLibraryModal = overlay.create(LazyAddLibraryModal);

const config = useRuntimeConfig();
const apiUrl = ref(config.public.openFetch.api.baseURL);
const reloading = ref(false);
const setUrl = async () => {
    reloading.value = true;
    config.public.openFetch.api.baseURL = apiUrl.value;
    await refreshNuxtData();
    reloading.value = false;
};

const cleanUpDatabaseBusy = ref(false);
const cleanUpDatabase = async () => {
    cleanUpDatabaseBusy.value = true;
    await useApi('/v2/Maintenance/CleanupNoDownloadManga', { method: 'POST' })
        .then(() => refreshNuxtData(FetchKeys.Manga.All))
        .finally(() => (cleanUpDatabaseBusy.value = false));
};
</script>
