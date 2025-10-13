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
                <UButton icon="i-lucide-database" :loading="cleanUpDatabaseBusy" class="w-fit mb-2" @click="cleanUpDatabase"
                    >Clean database</UButton
                >
                <UFormField label="API Url" name="apiUrl">
                    <UInput v-model="apiUrl" class="max-w-full w-xs" placeholder="http://<ip:port>/" />
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
    config.public.openFetch.api.baseURL = apiUrl.value.endsWith('/') ? apiUrl.value : apiUrl.value + '/';
    await refreshNuxtData();
    reloading.value = false;
};

const cleanUpDatabaseBusy = ref(false);
const cleanUpDatabase = async () => {
    cleanUpDatabaseBusy.value = true;
    await useApi('/v2/Maintenance/CleanupNoDownloadManga', { method: 'POST' });
    await refreshNuxtData(FetchKeys.Manga.All);
    cleanUpDatabaseBusy.value = false;
};

useHead({ title: 'Settings' });
</script>
