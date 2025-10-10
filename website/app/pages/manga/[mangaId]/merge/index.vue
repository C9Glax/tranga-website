<template>
    <UPageHeader class="text-3xl px-4"
        >Merge <span v-if="manga">{{ manga.name }}</span
        ><USkeleton v-else as="span" class="w-60 h-lh" /> into</UPageHeader
    >
    <UPageBody class="p-4 flex flex-row flex-wrap gap-6 mt-0">
        <NuxtLink v-for="m in mangas" :to="`${m.key}`">
            <MangaCard :manga="m" />
        </NuxtLink>
    </UPageBody>
</template>

<script setup lang="ts">
const route = useRoute();
const mangaId = route.params.mangaId as string;

const { data: manga } = await useApi('/v2/Manga/{MangaId}', {
    path: { MangaId: mangaId },
    key: FetchKeys.Manga.Id(mangaId),
});
const { data: mangas } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All });
</script>
