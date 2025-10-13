<template>
    <UPageList>
        <UPageCard
            v-for="chapter in chapters"
            :key="chapter.key"
            orientation="horizontal"
            :ui="{ container: 'p-2 sm:p-2' }">
            <template #title>
                <p class="text-primary">{{ chapter.title }}</p>
            </template>
            <template #leading>
                <p class="mr-1">Downloaded:</p>
                <Icon v-if="chapter.downloaded" name="i-lucide-circle-check-big" />
                <Icon v-else name="i-lucide-circle-x" />
            </template>
            <template #footer>
                <p class="text-secondary">
                    <span v-if="chapter.volume" class="mr-1">Vol. {{ chapter.volume }}</span>
                    <span class="inline">Ch. {{ chapter.chapterNumber }}</span>
                </p>
            </template>
            <template #description>
                <p>{{ chapter.fileName }}</p>
            </template>
            <template #default>
                <div>
                    <div
                        v-for="mangaconnectorId in chapter.mangaConnectorIds.sort((a, b) =>
                            a.mangaConnectorName < b.mangaConnectorName ? -1 : 1
                        )"
                        :key="mangaconnectorId.key"
                        class="bg-elevated p-1 rounded-lg w-fit flex items-center justify-center gap-2"
                    >
                        <MangaconnectorIcon v-bind="mangaconnectorId" />
                        <UTooltip :text="mangaconnectorId.useForDownload ? 'Stop downloading from this website' : 'Download from this website'">
                            <UButton :icon="mangaconnectorId.useForDownload ? 'i-lucide-cloud-off' : 'i-lucide-cloud-download'" variant="ghost" disabled /> <!-- Not implemented yet -->
                        </UTooltip>
                    </div>
                </div>
            </template>
        </UPageCard>
    </UPageList>
</template>

<script setup lang="ts">
export interface ChaptersListProps {
    mangaId: string;
}
const props = defineProps<ChaptersListProps>();

const { data: chapters } = await useApi('/v2/Manga/{MangaId}/Chapters', {
    path: { MangaId: props.mangaId },
    key: FetchKeys.Chapters.All,
});
</script>
