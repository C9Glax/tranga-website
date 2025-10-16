<template>
    <TrangaPage>
        <template #title>
            <h1 class="text-2xl">
                Manga with Tag <UBadge variant="outline" color="primary" class="font-semibold text-xl ml-1">{{ tag }}</UBadge>
            </h1>
        </template>
        <LoadingPage :loading="status === 'pending'">
            <MangaCardList :manga="manga" @click="(m) => navigateTo(`/manga/${m.key}?return=${$route.fullPath}`)" />
        </LoadingPage>
    </TrangaPage>
</template>

<script setup lang="ts">
const tag = useRoute().params.tag as string;
const { data: manga, status } = await useApi('/v2/Manga/WithTag/{Tag}', { path: { Tag: tag }, lazy: true });

useHead({ title: 'Tag search' });
</script>
