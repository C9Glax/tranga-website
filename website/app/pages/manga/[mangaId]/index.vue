<template>
    <MangaDetailPage :manga="manga">
        <div class="grid gap-3 max-sm:grid-flow-row-dense min-sm:grid-cols-[70%_30%]">
            <ChaptersList v-if="manga" :manga-id="manga.key" />
            <div class="flex flex-col gap-2">
                <UCard>
                    <template #header>
                        <h1>Download</h1>
                    </template>
                    <LibrarySelect :manga-id="mangaId" :library-id="libraryId" class="w-full" />
                    <div v-if="manga" class="flex flex-row gap-2 w-full flex-wrap my-2 justify-between">
                        <div
                            v-for="mangaconnectorId in manga.mangaConnectorIds.sort((a, b) =>
                            a.mangaConnectorName < b.mangaConnectorName ? -1 : 1
                        )"
                            :key="mangaconnectorId.key"
                            class="bg-elevated p-1 rounded-lg w-fit flex items-center justify-center gap-2">
                            <MangaconnectorIcon v-bind="mangaconnectorId" />
                            <UTooltip
                                :text="mangaconnectorId.useForDownload ? 'Stop downloading from this website' : 'Download from this website'">
                                <UButton
                                    :icon="mangaconnectorId.useForDownload ? 'i-lucide-cloud-off' : 'i-lucide-cloud-download'"
                                    variant="ghost"
                                    @click="setRequestedFrom(mangaconnectorId.mangaConnectorName, !mangaconnectorId.useForDownload)" />
                            </UTooltip>
                        </div>
                    </div>
                </UCard>
                <UCard>
                    <template #header>
                        <h1>Metadata</h1>
                    </template>
                    <UTable v-if="metadataFetchers && metadata" :data="metadataFetchers" :columns="[{header: 'Name', id: 'name'}, {header: '', id: 'link'}]">
                        <template #name-cell="{ row }">
                            {{ row.original }}
                        </template>
                        <template #link-cell="{ row }">
                            <UButton v-if="metadata.find(me => me.metadataFetcherName == row.original)" @click="unlinkMetadataFetcher(row.original)">Unlink</UButton>
                            <UButton v-else :to="`/manga/${mangaId}/linkMetadata/${row.original}`">Link</UButton>
                        </template>
                    </UTable>
                </UCard>
            </div>
        </div>
        <template #actions>
            <UButton trailing-icon="i-lucide-merge" :to="`/manga/${manga?.key}/merge/`" color="secondary">Merge</UButton>
            <UButton variant="soft" color="warning" icon="i-lucide-trash" />
        </template>
    </MangaDetailPage>
</template>

<script setup lang="ts">
import MangaDetailPage from '~/components/MangaDetailPage.vue';

const route = useRoute();
const mangaId = route.params.mangaId as string;

const { data: manga } = await useApi('/v2/Manga/{MangaId}', {
    path: { MangaId: mangaId },
    key: FetchKeys.Manga.Id(mangaId),
    onResponseError: (e) => {
        console.error(e);
        navigateTo('/');
    },
    lazy: true
});
const libraryId = ref(manga.value?.fileLibraryId);

const { data: metadataFetchers } = await useApi('/v2/MetadataFetcher', { key: FetchKeys.Metadata.Fetchers, lazy: true });
const { data: metadata } = await useApi('/v2/MetadataFetcher/Links/{MangaId}', { path: { MangaId: mangaId }, key: FetchKeys.Metadata.Manga(mangaId), lazy: true });

const setRequestedFrom = async (MangaConnectorName: string, IsRequested: boolean) => {
    await useApi('/v2/Manga/{MangaId}/DownloadFrom/{MangaConnectorName}/{IsRequested}', {
        method: 'PATCH',
        path: { MangaId: mangaId, MangaConnectorName: MangaConnectorName, IsRequested: IsRequested },
    });
    await refreshNuxtData(FetchKeys.Manga.Id(mangaId));
};

const unlinkMetadataFetcher = async (metadataFetcherName: string) => {
    await useApi('/v2/MetadataFetcher/{MetadataFetcherName}/Unlink/{MangaId}', { method: 'POST', path: { MangaId: mangaId, MetadataFetcherName: metadataFetcherName } });
    await refreshNuxtData(FetchKeys.Metadata.Manga(mangaId) );
}

useHead({ title: `Manga ${manga.value?.name}` });
</script>
