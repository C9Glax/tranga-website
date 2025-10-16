<template>
    <TrangaPage v-bind="$props">
        <template #left>
            <div class="flex flex-col gap-2">
                <MangaCover v-if="manga" :manga="manga" class="self-center" />
                <USkeleton v-else class="w-[240px] h-[350px]" />
                <p v-if="manga" class="font-semibold text-xl">
                    {{ manga.name }}
                    <MangaconnectorIcon v-for="m in manga.mangaConnectorIds" v-bind="m" :key="m.key" />
                </p>
                <USkeleton v-else as="p" class="h-20 w-full" />
                <div v-if="manga" class="flex flex-row gap-1 flex-wrap">
                    <UBadge v-for="author in manga.authors" :key="author.key" variant="outline" color="neutral"
                        ><NuxtLink :to="`/manga/author/${author.key}?return=${$route.fullPath}`">{{ author.name }}</NuxtLink></UBadge
                    >
                    <UBadge v-for="tag in manga.tags" :key="tag" variant="outline" color="primary"
                        ><NuxtLink :to="`/manga/tag/${tag}?return=${$route.fullPath}`">{{ tag }}</NuxtLink></UBadge
                    >
                    <NuxtLink v-for="link in manga.links" :key="link.key" :to="link.url" external no-prefetch>
                        <UBadge variant="outline" color="secondary">{{ link.provider }}</UBadge>
                    </NuxtLink>
                </div>
                <USkeleton v-else class="w-full h-lh" />
                <MDC v-if="manga" :value="manga.description" class="min-h-lh grow" />
                <USkeleton v-else class="w-full h-30" />
            </div>
        </template>
        <template #actions>
            <slot name="actions" />
        </template>
        <slot />
    </TrangaPage>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
import TrangaPage, { type PageProps } from '~/components/TrangaPage.vue';
type Manga = components['schemas']['Manga'];

export interface MangaDetailPageProps extends PageProps {
    manga?: Manga;
}

defineProps<MangaDetailPageProps>();
</script>
