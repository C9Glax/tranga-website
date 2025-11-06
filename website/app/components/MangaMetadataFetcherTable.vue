<template>
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
                <div class="flex flex-row gap-2 justify-end">
                    <UButton
                        v-if="metadata.find((me) => me.metadataFetcherName === row.original)"
                        icon="i-lucide-unlink"
                        loading-auto
                        @click="unlinkMetadataFetcher(row.original)" />
                    <UTooltip v-if="metadata.find((me) => me.metadataFetcherName === row.original)" text="Update Metadata">
                        <UButton icon="i-lucide-refresh-ccw-dot" loading-auto @click="updateMetadata(row.original)" />
                    </UTooltip>
                    <UButton
                        v-if="metadata.find((me) => me.metadataFetcherName === row.original) === undefined"
                        :to="`/manga/${mangaId}/linkMetadata/${row.original}?return=${$route.fullPath}`"
                        loading-auto
                        icon="i-lucide-link" />
                </div>
            </template>
        </UTable>
    </UCard>
</template>

<script setup lang="ts">
const props = defineProps<{ mangaId: string }>();
const mangaId = props.mangaId;

const { $api } = useNuxtApp();

const { data: metadataFetchers } = await useApi('/v2/MetadataFetcher', { key: FetchKeys.Metadata.Fetchers, lazy: true, server: false });
const { data: metadata } = await useApi('/v2/MetadataFetcher/Links/{MangaId}', {
    path: { MangaId: mangaId },
    key: FetchKeys.Metadata.Manga(mangaId),
    lazy: true,
    server: false,
});

const unlinkMetadataFetcher = async (metadataFetcherName: string) => {
    await $api('/v2/MetadataFetcher/{MetadataFetcherName}/Unlink/{MangaId}', {
        method: 'POST',
        path: { MangaId: mangaId, MetadataFetcherName: metadataFetcherName },
    });
    await refreshNuxtData(FetchKeys.Metadata.Manga(mangaId));
};

const updateMetadata = async (metadataFetcherName: string) => {
    await $api('/v2/MetadataFetcher/{MetadataFetcherName}/Update/{MangaId}', {
        method: 'POST',
        path: { MangaId: mangaId, MetadataFetcherName: metadataFetcherName },
    });
    await refreshNuxtData(FetchKeys.Manga.Id(mangaId));
};
</script>
