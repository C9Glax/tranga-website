<template>
    <MangaDetailPage :manga="manga" :back="{ text: 'Back', href: `/manga/${mangaId}`, icon: 'i-lucide-arrow-left' }" title="Merge with">
        <USkeleton v-if="!mangas" class="w-full h-[350px]" />
        <MangaCardList :manga="mangas" @click="(m) => navigateTo(`/manga/${mangaId}/merge/${m.key}`)" />
    </MangaDetailPage>
</template>

<script setup lang="ts">
const route = useRoute();
const mangaId = route.params.mangaId as string;

const { data: manga } = await useApi('/v2/Manga/{MangaId}', { path: { MangaId: mangaId }, key: FetchKeys.Manga.Id(mangaId) });
const { data: mangas } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All });

useHead({ title: 'Merge Manga' });
</script>
