<template>
    <UCard
        :ui="{ body: 'p-0 sm:p-0', root: 'overflow-visible' }"
        class="relative max-sm:w-[calc(var(--mangacover-width)/2)] max-sm:h-[calc(var(--mangacover-height)/2)] w-(--mangacover-width) h-(--mangacover-height) mt-4 mr-4">
        <MangaCover :manga="manga" blur />
        <div class="absolute -top-4 -right-4 flex flex-col bg-pink rounded-full">
            <MangaconnectorIcon v-for="m in manga.mangaConnectorIds" v-bind="m" :key="m.key" />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
import type { PageCardProps } from '#ui/components/PageCard.vue';
type Manga = components['schemas']['Manga'];
type MinimalManga = components['schemas']['MinimalManga'];

defineProps<MangaCardProps>();

export interface MangaCardProps extends /* @vue-ignore */ PageCardProps {
    manga: Manga | MinimalManga;
}
</script>
