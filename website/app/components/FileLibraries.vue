<template>
    <UPageList divide>
        <UPageCard
            v-for="l in fileLibraries"
            variant="ghost"
            icon="i-lucide-library-big"
            :title="l.libraryName"
            :description="l.basePath"
            orientation="horizontal">
            <UButton color="warning" @click="deleteLibrary(l)" :loading="busy">Delete</UButton>
        </UPageCard>
    </UPageList>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type FileLibrary = components['schemas']['FileLibrary'];
const { data: fileLibraries, refresh } = useApi('/v2/FileLibrary');

const config = useRuntimeConfig();
const busy = ref(false);
const deleteLibrary = (l: FileLibrary) => {
    busy.value = true;
    $fetch(new Request(`${config.public.openFetch.api.baseURL}v2/FileLibrary/${l.key}`), { method: 'DELETE' }).finally(
        () => {
            refresh();
            busy.value = false;
        }
    );
};
</script>
