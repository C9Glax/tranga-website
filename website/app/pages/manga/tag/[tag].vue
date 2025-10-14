<template>
    <TrangaPage>
        <template #title>
            <h1 class="text-2xl">
                Manga with Tag <UBadge variant="outline" class="text-primary font-semibold text-xl">{{ tag }}</UBadge>
            </h1>
        </template>
        <LoadingPage :loading="status === 'pending'">
            <MangaCardList :manga="manga" />
        </LoadingPage>
    </TrangaPage>
</template>

<script setup lang="ts">
const route = useRoute();
const tag = route.params.tag as string;
const { data: manga, status } = await useApi('/v2/Manga/WithTag/{Tag}', { path: { Tag: tag }, lazy: true });

useHead({ title: 'Tranga' });
</script>
