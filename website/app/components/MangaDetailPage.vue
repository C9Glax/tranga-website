<template>
    <UPage class="h-full">
        <template #left>
            <div class="flex flex-col gap-2 p-4 bg-elevated">
                <MangaCover v-if="manga" :manga="manga" class="self-center" />
                <USkeleton v-else class="w-[240px] h-[350px]" />
                <p v-if="manga" class="font-semibold text-xl">
                    {{ manga.name }}
                    <MangaconnectorIcon v-for="m in manga.mangaConnectorIds" v-bind="m" :key="m.key" />
                </p>
                <USkeleton v-else class="text-xl h-20 w-full" />
                <div v-if="manga" class="flex flex-row gap-1 flex-wrap">
                    <UBadge v-for="author in manga.authors" :key="author.key" variant="outline" color="neutral">{{
                        author.name
                    }}</UBadge>
                    <UBadge v-for="tag in manga.tags" :key="tag" variant="outline" color="primary">{{ tag }}</UBadge>
                    <NuxtLink v-for="link in manga.links" :key="link.key" :to="link.url" external no-prefetch>
                        <UBadge variant="outline" color="secondary">{{ link.provider }}</UBadge>
                    </NuxtLink>
                </div>
                <USkeleton v-else class="w-full h-lh" />
                <p v-if="manga" class="max-h-30 overflow-y-hidden grow">
                    {{ manga.description }}
                </p>
                <USkeleton v-else class="w-full h-30" />
            </div>
        </template>
        <UPageBody class="relative mr-12">
            <div class="w-full flex flex-row justify-between">
                <div>
                    <UButton variant="soft" :to="backPath ?? '/'" icon="i-lucide-arrow-left">Back</UButton>
                    <p v-if="title" class="text-3xl">{{ title }}</p>
                </div>
                <div v-if="manga" class="flex flex-row gap-2">
                    <UButton trailing-icon="i-lucide-merge" :to="`${manga.key}/merge/`" color="secondary"
                        >Merge</UButton
                    >
                    <slot name="actions" />
                </div>
            </div>
            <slot />
        </UPageBody>
    </UPage>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type Manga = components['schemas']['Manga'];

export interface MangaDetailPageProps {
    manga?: Manga;
    title?: string;
    backPath?: string;
}

defineProps<MangaDetailPageProps>();
</script>
