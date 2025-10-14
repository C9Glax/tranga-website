<template>
    <MangaDetailPage
        :manga="manga"
        :back="{ text: 'Back', href: `/manga/${mangaId}`, icon: 'i-lucide-arrow-left' }"
        :title="metadataFetcherName">
        <USkeleton v-if="status === 'pending'" class="w-full h-14" />
        <UCard v-else class="flex flex-wrap gap-2">
            <div
                v-for="data in searchData"
                :key="data.identifier"
                class="grid grid-cols-[var(--mangacover-width)_auto_auto] grid-flow-col gap-4">
                <NuxtImg
                    :src="data.coverUrl ?? '/blahaj.png'"
                    alt="cover"
                    class="row-span-3 object-contain max-sm:w-[calc(var(--mangacover-width)/2)] max-sm:h-[calc(var(--mangacover-height)/2)] w-(--mangacover-width) h-(--mangacover-height) rounded-lg overflow-clip" />
                <NuxtLink :href="data.url" no-prefetch external target="_blank" class="underline underline-offset-2">
                    <h2 class="text-xl text-secondary italic">{{ data.name }}</h2>
                </NuxtLink>
                <MDC :value="data.description ?? undefined" />
                <UButton class="w-min h-min px-4 place-self-end" @click="link(data.identifier)">Link</UButton>
            </div>
        </UCard>
    </MangaDetailPage>
</template>

<script setup lang="ts">
const route = useRoute();
const mangaId = route.params.mangaId as string;
const metadataFetcherName = route.params.metadataFetcherName as string;
const { $api } = useNuxtApp();

const { data: manga } = await useApi('/v2/Manga/{MangaId}', {
    path: { MangaId: mangaId },
    key: FetchKeys.Manga.Id(mangaId),
    onResponseError: (e) => {
        console.error(e);
        navigateTo('/');
    },
});

const { data: searchData, status } = await useApi('/v2/MetadataFetcher/{MetadataFetcherName}/SearchManga/{MangaId}', {
    method: 'POST',
    path: { MetadataFetcherName: metadataFetcherName, MangaId: mangaId },
    lazy: true,
});

const link = async (identifier: string) => {
    await $api('/v2/MetadataFetcher/{MetadataFetcherName}/Link/{MangaId}', {
        method: 'POST',
        path: { MangaId: mangaId, MetadataFetcherName: metadataFetcherName },
        body: identifier,
    });
    await refreshNuxtData(FetchKeys.Metadata.Manga(mangaId));
    navigateTo(`/manga/${mangaId}`);
};

useHead({ title: 'Link Metadata' });
</script>
