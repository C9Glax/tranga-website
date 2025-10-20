<template>
    <div class="flex flex-row flex-wrap">
        <UPageCard
            v-for="l in fileLibraries"
            :key="l.key"
            variant="soft"
            icon="i-lucide-library-big"
            :title="l.libraryName"
            :description="l.basePath"
            orientation="horizontal">
            <UButton color="warning" :loading="busy" class="w-fit justify-self-end" @click="deleteLibrary(l)">Delete</UButton>
        </UPageCard>
    </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type FileLibrary = components['schemas']['FileLibrary'];
const { $api } = useNuxtApp();

const { data: fileLibraries } = await useApi('/v2/FileLibrary', { key: FetchKeys.FileLibraries, server: false });

const busy = ref(false);
const deleteLibrary = async (library: FileLibrary) => {
    busy.value = true;
    await $api('/v2/FileLibrary/{FileLibraryId}', { path: { FileLibraryId: library.key }, method: 'DELETE' });
    await refreshNuxtData(FetchKeys.FileLibraries);
    busy.value = false;
};
</script>
