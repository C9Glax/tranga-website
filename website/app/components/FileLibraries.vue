<template>
    <UPageList class="gap-2">
        <UPageCard
            v-for="l in fileLibraries"
            :key="l.key"
            variant="soft"
            icon="i-lucide-library-big"
            :title="l.libraryName"
            :description="l.basePath"
            orientation="horizontal">
            <UButton color="warning" :loading="busy" @click="deleteLibrary(l)">Delete</UButton>
        </UPageCard>
    </UPageList>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type FileLibrary = components['schemas']['FileLibrary'];
const { data: fileLibraries } = await useApi('/v2/FileLibrary', { key: FetchKeys.FileLibraries });

const busy = ref(false);
const deleteLibrary = async (library: FileLibrary) => {
    busy.value = true;
    await useApi('/v2/FileLibrary/{FileLibraryId}', { path: { FileLibraryId: library.key }, method: 'DELETE' })
        .then(() => refreshNuxtData(FetchKeys.FileLibraries))
        .finally(() => (busy.value = false));
};
</script>
