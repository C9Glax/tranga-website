<template>
    <LoadingPage :loading="status === 'pending'">
        <TrangaPage>
            <template #title>
                <h1 class="text-2xl">
                    Manga with Tag <UBadge variant="outline" class="text-primary font-semibold text-xl">{{ tag }}</UBadge>
                </h1>
            </template>
            <MangaCardList :manga="manga" />
        </TrangaPage>
    </LoadingPage>
</template>

<script setup lang="ts">
const route = useRoute();
const tag = route.params.tag as string;
const { data: manga, status } = await useApi('/v2/Manga/WithTag/{Tag}', { path: { Tag: tag } });

useHead({ title: 'Tranga' });
</script>
