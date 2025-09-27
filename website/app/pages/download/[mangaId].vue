<template>
    <MangaDetailPage :manga="manga" back-path="/search"/>
</template>

<script setup lang="ts">
import MangaDetailPage from '~/components/MangaDetailPage.vue';

const route = useRoute();

const { data: manga } = useApi('/v2/Manga/{MangaId}', { path: { MangaId: route.params.mangaId as string } });
</script>
