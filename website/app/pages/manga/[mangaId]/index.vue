<template>
    <MangaDetailPage :manga="manga">
        <ChaptersList v-if="manga" :manga-id="manga.key" />
        <template #actions>
            <LibrarySelect :library-id="libraryId" />
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
});
const libraryId = ref(manga.value?.fileLibraryId);
</script>
