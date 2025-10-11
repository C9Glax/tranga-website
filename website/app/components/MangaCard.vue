<template>
    <UCard
        v-if="!expanded"
        :ui="{ body: 'p-0 sm:p-0', root: 'overflow-visible' }"
        class="relative h-[350px] mt-2"
        @click="$emit('click')">
        <MangaCover :manga="manga" blur />
        <div class="absolute -top-4 -right-4 flex flex-col bg-pink rounded-full">
            <MangaconnectorIcon v-for="m in manga.mangaConnectorIds" v-bind="m" :key="m.key" />
        </div>
    </UCard>
    <UCard
        v-else
        orientation="horizontal"
        reverse
        class="relative max-w-[600px] w-full h-[350px] mt-2 mb-2"
        :ui="{ body: 'p-0 sm:p-0', root: 'overflow-visible' }"
        @click="$emit('click')">
        <div class="flex flex-row w-full h-full basis-auto">
            <MangaCover :manga="manga" class="shrink-0" />
            <div class="absolute -top-4 -right-4 flex flex-col bg-pink rounded-full">
                <MangaconnectorIcon v-for="m in manga.mangaConnectorIds" v-bind="m" :key="m.key" />
            </div>
            <div class="flex flex-col h-[350px] shrink mx-2">
                <p class="font-semibold text-xl">{{ manga.name }}</p>
                <p class="max-h-30 overflow-y-hidden grow">{{ manga.description }}</p>
            </div>
        </div>
        <div class="absolute bottom-0 w-full p-2 flex flex-row justify-end">
            <slot name="actions" v-bind="manga" />
        </div>
    </UCard>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
import type { PageCardProps } from '#ui/components/PageCard.vue';
type Manga = components['schemas']['Manga'];
type MinimalManga = components['schemas']['MinimalManga'];

defineProps<MangaCardProps>();
defineEmits(['click']);

export interface MangaCardProps extends /* @vue-ignore */ PageCardProps {
    manga: Manga | MinimalManga;
    expanded?: boolean;
}
</script>
