<template>
    <TrangaPage>
        <UPageSection title="Settings">
            <template #description>
                <div>
                    <p>API Url</p>
                    <UInput v-model="apiUrl" class="max-w-full w-xs" placeholder="http://<ip:port>/" />
                    <UButton :loading="reloading" class="mx-1" @click="setUrl">Set</UButton>
                    <p v-if="settingsStatus === 'error'" class="text-warning">Unable to connect to api.</p>
                </div>
            </template>
            <UCard v-if="settingsStatus === 'success'">
                <template #header>
                    <h1>Libraries</h1>
                </template>
                <template #footer>
                    <div class="flex flex-row gap-2">
                        <UButton icon="i-lucide-plus" class="w-fit" @click="addLibraryModal.open()">Add FileLibrary</UButton>
                        <UTooltip :text="komgaConnected ? 'Disconnect Komga' : 'Connect Komga'">
                            <UButton
                                :icon="komgaConnected ? 'i-lucide-unlink' : 'i-lucide-link'"
                                class="w-fit"
                                label="Komga"
                                @click="onKomgaClick" />
                        </UTooltip>
                        <UTooltip :text="kavitaConnected ? 'Disconnect Kavita' : 'Connect Kavita'">
                            <UButton
                                :icon="kavitaConnected ? 'i-lucide-unlink' : 'i-lucide-link'"
                                class="w-fit"
                                label="Kavita"
                                @click="onKavitaClick" />
                        </UTooltip>
                    </div>
                </template>
                <FileLibraries />
            </UCard>
            <UCard v-if="settingsStatus === 'success'">
                <template #header>
                    <h1>Maintenance</h1>
                </template>
                <UButton icon="i-lucide-database" :loading="cleanUpDatabaseBusy" class="w-fit mb-2" @click="cleanUpDatabase"
                    >Clean database</UButton
                >
            </UCard>
        </UPageSection>
    </TrangaPage>
</template>

<script setup lang="ts">
import { LazyAddLibraryModal, LazyKavitaModal, LazyKomgaModal } from '#components';
import FileLibraries from '~/components/FileLibraries.vue';
import { refreshNuxtData } from '#app';
const overlay = useOverlay();
const { $api } = useNuxtApp();

const addLibraryModal = overlay.create(LazyAddLibraryModal);
const komgaModal = overlay.create(LazyKomgaModal);
const kavitaModal = overlay.create(LazyKavitaModal);

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

const { data: libraries } = useApi('/v2/LibraryConnector', { key: FetchKeys.Libraries.All });
const komgaConnected = computed(() => libraries.value?.find((l) => l.type === 'Komga')?.key);
const onKomgaClick = async () => {
    if (!komgaConnected.value) {
        komgaModal.open();
    } else {
        await $api('/v2/LibraryConnector/{LibraryConnectorId}', { method: 'DELETE', path: { LibraryConnectorId: komgaConnected.value } });
        await refreshNuxtData(FetchKeys.Libraries.All);
    }
};
const kavitaConnected = computed(() => libraries.value?.find((l) => l.type === 'Kavita')?.key);
const onKavitaClick = async () => {
    if (!kavitaConnected.value) {
        kavitaModal.open();
    } else {
        await $api('/v2/LibraryConnector/{LibraryConnectorId}', { method: 'DELETE', path: { LibraryConnectorId: kavitaConnected.value } });
        await refreshNuxtData(FetchKeys.Libraries.All);
    }
};

const { status: settingsStatus } = useApi('/v2/Settings', { key: FetchKeys.Settings.All });

useHead({ title: 'Settings' });
</script>
