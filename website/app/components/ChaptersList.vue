<template>
    <UPageList class="gap-2 h-full overflow-y-scroll">
        <UPageCard
            v-for="chapter in chapters"
            :id="chapter.key"
            :key="chapter.key"
            orientation="horizontal"
            :ui="{ container: 'p-2 sm:p-2' }"
            :class="[$route.hash.substring(1) == chapter.key ? 'animate-[flash_0.75s_ease_0.5s]' : '']">
            <template #title>
                <p class="text-primary">{{ chapter.title }}</p>
                <p class="text-secondary">
                    <span v-if="chapter.volume" class="mr-1">Vol. {{ chapter.volume }}</span>
                    <span class="inline">Ch. {{ chapter.chapterNumber }}</span>
                </p>
            </template>
            <template #description>
                <p>{{ chapter.fileName }}</p>
            </template>
            <template #default>
                <div class="flex flex-row gap-2 w-full items-center">
                    <UTooltip :text="chapter.downloaded ? 'Downloaded' : 'Not downloaded'">
                        <UIcon :name="chapter.downloaded ? 'i-lucide-cloud-check' : 'i-lucide-cloud-alert'" size="20" />
                    </UTooltip>
                    <div
                        v-for="mangaconnectorId in chapter.mangaConnectorIds.sort((a, b) =>
                            a.mangaConnectorName < b.mangaConnectorName ? -1 : 1
                        )"
                        :key="mangaconnectorId.key"
                        class="bg-elevated p-1 rounded-lg w-fit flex items-center justify-center gap-2">
                        <MangaconnectorIcon v-bind="mangaconnectorId" />
                        <UTooltip text="Not implemented yet.">
                            <!-- TODO: :text="mangaconnectorId.useForDownload ? 'Stop downloading from this website' : 'Download from this website'"> -->
                            <UButton
                                :icon="mangaconnectorId.useForDownload ? 'i-lucide-cloud-off' : 'i-lucide-cloud-download'"
                                variant="ghost"
                                disabled />
                        </UTooltip>
                    </div>
                    <!-- TODO: Not implemented yet -->
                    <UButton variant="outline" color="secondary" class="ml-auto" disabled>Force (re)download</UButton>
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

const { data: chapters } = await useApi('/v2/Chapters/Manga/{MangaId}', { path: { MangaId: props.mangaId }, key: FetchKeys.Chapters.All });
</script>
