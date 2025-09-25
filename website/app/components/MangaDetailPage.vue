<template>
    <UPage class="p-4 h-full">
        <template #left>
            <div class="flex flex-col gap-2 border-r-2 pr-4">
                <MangaCover :manga="manga" class="self-center" />
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
        <UPageBody class="mt-0 relative">
            <div>
                <UButton variant="soft" to="/" icon="i-lucide-arrow-left">Back</UButton>
                <p v-if="title" class="text-3xl">{{ title }}</p>
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
}

defineProps<MangaDetailPageProps>();
</script>
