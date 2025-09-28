<template>
    <MangaDetailPage :manga="manga">
        <ChaptersList v-if="manga" :manga-id="manga.key" />
        <template #actions>
            <UButton variant="soft" color="warning" icon="i-lucide-trash" />
        </template>
    </MangaDetailPage>
</template>

<script setup lang="ts">
import MangaDetailPage from '~/components/MangaDetailPage.vue';

const route = useRoute();
const mangaId = route.params.MangaId as string;

const { data: manga } = await useApiData('/v2/Manga/{MangaId}', { path: { MangaId: mangaId }, key: FetchKeys.Manga.Id(mangaId) });
</script>
