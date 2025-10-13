<template>
    <MangaDetailPage :manga="manga" back-path="/search">
        <UCard>
            <template #default>
                <div class="flex flex-row gap-2 w-full justify-center">
                    <LibrarySelect :manga-id="mangaId" :library-id="libraryId" />
                    <UButton color="primary" :disabled="!libraryId" :loading="loading" @click="onDownloadClick">
                        Download from {{ mangaConnector?.name }}
                        <template #trailing>
                            <NuxtImg :src="mangaConnector?.iconUrl" class="h-lh" />
                        </template>
                    </UButton>
                </div>
            </template>
        </UCard>
    </MangaDetailPage>
</template>

<script setup lang="ts">
const route = useRoute();
const mangaId = route.params.mangaId as string;
const mangaConnectorName = route.params.mangaconnectorName as string;

const { data: manga } = await useApi('/v2/Manga/{MangaId}', { path: { MangaId: mangaId }, key: FetchKeys.Manga.Id(mangaId) });
const libraryId = ref(manga.value?.fileLibraryId);
const { data: mangaConnector } = await useApi('/v2/MangaConnector/{MangaConnectorName}', {
    path: { MangaConnectorName: mangaConnectorName },
    key: FetchKeys.MangaConnector.Id(mangaConnectorName),
});

const loading = ref(false);
const onDownloadClick = async () => {
    loading.value = true;
    await useApi('/v2/Manga/{MangaId}/SetAsDownloadFrom/{MangaConnectorName}/{IsRequested}', {
        method: 'POST',
        path: { MangaId: mangaId, MangaConnectorName: mangaConnectorName, IsRequested: true },
    });
    loading.value = false;
};

useHead({ title: `Download ${manga.value?.name} from ${mangaConnector.value?.name}` });
</script>
