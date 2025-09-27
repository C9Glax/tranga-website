<template>
    <UPage class="h-full">
        <template #left>
            <div class="flex flex-col gap-2 p-4 bg-elevated">
                <MangaCover v-if="manga" :manga="manga" class="self-center" />
                <USkeleton v-else class="w-[240px] h-[350px]" />
                <p v-if="manga" class="font-semibold text-xl">
                    {{ manga.name }}
                    <MangaconnectorIcon v-for="m in manga.mangaConnectorIds" v-bind="m" />
                </p>
                <USkeleton v-else class="text-xl h-20 w-full" />
                <div v-if="manga" class="flex flex-row gap-1 flex-wrap">
                    <UBadge variant="outline" v-for="author in manga.authors" color="neutral">{{ author.name }}</UBadge>
                    <UBadge variant="outline" v-for="tag in manga.tags">{{ tag }}</UBadge>
                    <NuxtLink v-for="link in manga.links" :to="link.url">
                        <UBadge variant="outline" color="warning">{{ link.provider }}</UBadge>
                    </NuxtLink>
                </div>
                <USkeleton v-else class="w-full h-lh" />
                <p v-if="manga" class="max-h-30 overflow-y-hidden grow">
                    {{ manga.description }}
                </p>
                <USkeleton v-else class="w-full h-30" />
            </div>
        </template>
        <UPageBody class="relative pr-4">
            <div class="w-full flex flex-row justify-between">
                <div>
                    <UButton variant="soft" :to="backPath ?? '/'" icon="i-lucide-arrow-left">Back</UButton>
                    <p v-if="title" class="text-3xl">{{ title }}</p>
                </div>
                <div v-if="manga" class="flex flex-row gap-2">
                    <UButton trailing-icon="i-lucide-merge" :to="`${manga.key}/merge/`">Merge</UButton>
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
