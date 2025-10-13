<template>
    <MangaDetailPage :manga="manga">
        <div class="grid gap-3 grid-cols-[70%_30%]">
            <ChaptersList v-if="manga" :manga-id="manga.key" />
            <UCard>
                <template #header>
                    <h1>Download</h1>
                </template>
                <LibrarySelect :manga-id="mangaId" :library-id="libraryId" />
            </UCard>
        </div>
        <template #actions>
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
