<template>
    <UPageList>
        <UPageCard
            v-for="chapter in chapters"
            :key="chapter.key"
            :title="chapter.title"
            orientation="horizontal"
            :ui="{ container: 'p-2 sm:p-2' }">
            <template #leading>
                <Icon v-if="chapter.downloaded" name="i-lucide-circle-x" />
                <Icon v-else name="i-lucide-circle-check-big" class="stroke-green-500" />
            </template>
            <template #footer>
                <p v-if="chapter.volume" class="inline mr-1">Vol. {{ chapter.volume }}</p>
                <p class="inline">Ch. {{ chapter.chapterNumber }}</p>
            </template>
            <template #description>
                {{ chapter.fileName }}
            </template>
            <template #default>
                <div>
                    <MangaconnectorIcon
                        v-for="mangaconnectorId in chapter.mangaConnectorIds.sort((a, b) =>
                            a.mangaConnectorName < b.mangaConnectorName ? -1 : 1
                        )"
                        v-bind="mangaconnectorId" />
                </div>
            </template>
        </UPageCard>
    </UPageList>
</template>

<script setup lang="ts">
import { id } from '#ui/locale';

export interface ChaptersListProps {
    mangaId: string;
}
const props = defineProps<ChaptersListProps>();

const { data: chapters } = useApi('/v2/Manga/{MangaId}/Chapters', { path: { MangaId: props.mangaId } });
</script>
