<template>
    <div class="w-full pt-2">
        <div class="flex justify-center">
            <UPagination
                :default-page="pagination.pageIndex + 1"
                :items-per-page="pagination.pageSize"
                :total="data?.totalCount ?? 0"
                class="mb-2"
                @update:page="(p) => (pagination.pageIndex = p - 1)" />
        </div>
        <UPageList class="gap-2 overflow-y-scroll px-[1px] py-[1px]">
            <UPageCard
                v-for="chapter in data?.data"
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
    </div>
</template>

<script setup lang="ts">
const pagination = ref({ pageIndex: 0, pageSize: 10 });

export interface ChaptersListProps {
    mangaId: string;
}
const props = defineProps<ChaptersListProps>();
const { $api } = useNuxtApp();

const { data } = useAsyncData(
    () =>
        $api('/v2/Chapters/Manga/{MangaId}', {
            method: 'GET',
            query: { page: pagination.value.pageIndex + 1, pageSize: pagination.value.pageSize },
            path: { MangaId: props.mangaId },
        }),
    { watch: [pagination.value], lazy: true, server: false }
);
</script>
