<template>
    <MangaDetailPage :manga="manga" :back-url="backUrl" title="Merge with">
        <USkeleton v-if="!mangas" class="w-full h-[350px]" />
        <MangaCardList :manga="mangas" @click="(m) => navigateTo(`/manga/${mangaId}/merge/${m.key}?return=${path}`)" />
    </MangaDetailPage>
</template>

<script setup lang="ts">
const route = useRoute();
const mangaId = route.params.mangaId as string;
const backUrl = route.query.return as string | undefined;
const path = route.fullPath;

const { data: manga } = await useApi('/v2/Manga/{MangaId}', { path: { MangaId: mangaId }, key: FetchKeys.Manga.Id(mangaId) });
const { data: mangas } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All });

useHead({ title: 'Merge Manga' });
</script>
