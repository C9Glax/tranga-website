<template>
    <UPageBody class="flex flex-col items-center">
        <UButton icon="i-lucide-arrow-left" class="w-fit self-start m-20" variant="soft" :to="`/manga/${mangaId}/merge/`">Back</UButton>
        <div class="flex flex-row justify-evenly items-center">
            <MangaCard v-if="manga" :manga="manga" :expanded="true" />
            <USkeleton v-else class="max-w-[600px] w-full h-[350px]" />
            <UIcon name="i-lucide-merge" class="rotate-90 px-20" size="50" />
            <MangaCard v-if="target" :manga="target" :expanded="true" />
            <USkeleton v-else class="max-w-[600px] w-full h-[350px]" />
        </div>
        <p class="text-warning">This action is irreversible!</p>
        <UButton color="warning" class="w-fit">Merge</UButton>
    </UPageBody>
</template>

<script setup lang="ts">
const route = useRoute();
const targetId = route.params.targetId as string;
const mangaId = route.params.mangaId as string;

const { data: target } = await useApi('/v2/Manga/{MangaId}', { path: { MangaId: targetId }, key: FetchKeys.Manga.Id(targetId) });
const { data: manga } = await useApi('/v2/Manga/{MangaId}', { path: { MangaId: mangaId }, key: FetchKeys.Manga.Id(mangaId) });
</script>
