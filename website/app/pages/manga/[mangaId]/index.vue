<template>
    <MangaDetailPage :manga="manga">
        <div class="grid gap-3 max-xl:grid-flow-row-dense min-2xl:grid-cols-[70%_auto] min-xl:grid-cols-[60%_auto] relative min-xl:h-full">
            <ChaptersList :manga-id="mangaId" class="min-xl:h-full min-xl:overflow-y-scroll" />
            <div class="flex flex-col gap-2">
                <UCard :class="[flashDownloading ? 'animate-[flash_0.75s_ease_0.5s]' : '']">
                    <template #header>
                        <h1 class="font-semibold">Download</h1>
                    </template>
                    <LibrarySelect
                        :manga-id="mangaId"
                        :library-id="manga?.fileLibraryId"
                        class="w-full"
                        @library-changed="refreshNuxtData(FetchKeys.Manga.Id(mangaId))" />
                    <div v-if="manga" class="flex flex-row gap-2 w-full flex-wrap my-2 justify-between">
                        <div
                            v-for="mangaconnectorId in manga.mangaConnectorIds.sort((a, b) =>
                                a.mangaConnectorName < b.mangaConnectorName ? -1 : 1
                            )"
                            :key="mangaconnectorId.key"
                            class="bg-elevated p-1 rounded-lg w-fit flex items-center justify-center gap-2">
                            <MangaconnectorIcon v-bind="mangaconnectorId" />
                            <UTooltip
                                :text="
                                    mangaconnectorId.useForDownload ? 'Stop downloading from this website' : 'Download from this website'
                                ">
                                <UButton
                                    :icon="mangaconnectorId.useForDownload ? 'i-lucide-cloud-off' : 'i-lucide-cloud-download'"
                                    variant="ghost"
                                    :disabled="!manga?.fileLibraryId"
                                    @click="setRequestedFrom(mangaconnectorId.mangaConnectorName, !mangaconnectorId.useForDownload)" />
                            </UTooltip>
                        </div>
                    </div>
                </UCard>
                <UCard :ui="{ body: 'p-0 sm:p-0' }">
                    <template #header>
                        <h1 class="font-semibold">Metadata</h1>
                    </template>
                    <UTable
                        v-if="metadataFetchers && metadata"
                        :data="metadataFetchers"
                        :columns="[
                            { header: 'Name', id: 'name' },
                            { header: '', id: 'link' },
                        ]">
                        <template #name-cell="{ row }">
                            <UTooltip :text="metadata.find((me) => me.metadataFetcherName == row.original)?.identifier ?? undefined">
                                <p class="text-toned">{{ row.original }}</p></UTooltip
                            >
                        </template>
                        <template #link-cell="{ row }">
                            <UButton
                                v-if="metadata.find((me) => me.metadataFetcherName == row.original)"
                                class="float-right"
                                icon="i-lucide-unlink"
                                @click="unlinkMetadataFetcher(row.original)" />
                            <UButton
                                v-else
                                :to="`/manga/${mangaId}/linkMetadata/${row.original}?return=${$route.fullPath}`"
                                class="float-right"
                                icon="i-lucide-link" />
                        </template>
                    </UTable>
                </UCard>
            </div>
        </div>
        <template #actions>
            <UButton
                icon="i-lucide-brick-wall-shield"
                :to="`/actions?mangaId=${mangaId}&return=${$route.fullPath}`"
                variant="soft"
                color="secondary" />
            <UButton trailing-icon="i-lucide-merge" :to="`/manga/${manga?.key}/merge?return=${$route.fullPath}`" color="secondary"
                >Merge</UButton
            >
            <UButton variant="soft" color="warning" icon="i-lucide-trash" @click="remove" />
            <UTooltip text="Reload" :kbds="['meta', 'R']">
                <UButton variant="soft" color="secondary" icon="i-lucide-refresh-ccw" :loading="refreshingData" @click="refreshData" />
            </UTooltip>
        </template>
    </MangaDetailPage>
</template>

<script setup lang="ts">
import MangaDetailPage from '~/components/MangaDetailPage.vue';
const { $api } = useNuxtApp();
const route = useRoute();
const mangaId = route.params.mangaId as string;

const flashDownloading = route.hash.substring(1) == 'download';

const { data: manga } = await useApi('/v2/Manga/{MangaId}', {
    path: { MangaId: mangaId },
    key: FetchKeys.Manga.Id(mangaId),
    onResponseError: (e) => {
        console.error(e);
        navigateTo('/');
    },
    lazy: true,
    server: false,
});

const { data: metadataFetchers } = await useApi('/v2/MetadataFetcher', { key: FetchKeys.Metadata.Fetchers, lazy: true, server: false });
const { data: metadata } = await useApi('/v2/MetadataFetcher/Links/{MangaId}', {
    path: { MangaId: mangaId },
    key: FetchKeys.Metadata.Manga(mangaId),
    lazy: true,
    server: false,
});

const setRequestedFrom = async (MangaConnectorName: string, IsRequested: boolean) => {
    await $api('/v2/Manga/{MangaId}/DownloadFrom/{MangaConnectorName}/{IsRequested}', {
        method: 'PATCH',
        path: { MangaId: mangaId, MangaConnectorName: MangaConnectorName, IsRequested: IsRequested },
    });
    await refreshNuxtData(FetchKeys.Manga.Id(mangaId));
};

const unlinkMetadataFetcher = async (metadataFetcherName: string) => {
    await $api('/v2/MetadataFetcher/{MetadataFetcherName}/Unlink/{MangaId}', {
        method: 'POST',
        path: { MangaId: mangaId, MetadataFetcherName: metadataFetcherName },
    });
    await refreshNuxtData(FetchKeys.Metadata.Manga(mangaId));
};

const remove = async () => {
    await $api('/v2/Manga/{MangaId}', { method: 'DELETE', path: { MangaId: mangaId } });
    await refreshNuxtData(FetchKeys.Manga.All);
    navigateTo('/');
};

const refreshingData = ref(false);
const refreshData = async () => {
    refreshingData.value = true;
    await refreshNuxtData([
        FetchKeys.Manga.Id(mangaId),
        FetchKeys.Metadata.Manga(mangaId),
        FetchKeys.FileLibraries,
        FetchKeys.Chapters.All,
    ]);
    refreshingData.value = false;
};

defineShortcuts({ meta_r: { usingInput: true, handler: refreshData } });

useHead({ title: 'Manga' });
</script>
