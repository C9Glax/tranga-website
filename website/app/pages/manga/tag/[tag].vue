<template>
    <LoadingPage :loading="status === 'pending'" class="p-4 flex flex-row flex-wrap gap-6 mt-0">
        <UButton variant="soft" to="/" icon="i-lucide-arrow-left">Home</UButton>
        <h1 class="text-2xl">Manga with Tag <span class="text-primary font-semibold">{{ tag }}</span></h1>
        <MangaCardList :manga="manga" />
    </LoadingPage>
</template>

<script setup lang="ts">
const route = useRoute();
const tag = route.params.tag as string;
const { data: manga, status } = await useApi('/v2/Manga/WithTag/{Tag}', { path: { Tag: tag } });

useHead({ title: 'Tranga' });
</script>
