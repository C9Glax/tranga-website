<template>
    <UPageList class="gap-2">
        <UPageCard
            v-for="l in fileLibraries"
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
import type { ApiModel } from '#nuxt-api-party'
type FileLibrary = ApiModel<"FileLibrary">;
const { data: fileLibraries } = await useApiData('/v2/FileLibrary', { key: FetchKeys.FileLibraries });

const busy = ref(false);
const deleteLibrary = async (l: FileLibrary) => {
    busy.value = true;
    await $api('/v2/FileLibrary/{FileLibraryId}', { path: { FileLibraryId: l.key }, method: 'DELETE' })
        .then(() => refreshNuxtData(FetchKeys.FileLibraries))
        .finally(() => busy.value = false)
};
</script>
