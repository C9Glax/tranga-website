<template>
    <LoadingPage :loading="status === 'pending'" class="p-4 flex flex-row flex-wrap gap-6 mt-0">
        <MangaCardList :manga="manga" />
    </LoadingPage>
</template>

<script setup lang="ts">
const { data: manga, refresh, status } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All, lazy: true });
onMounted(() => refresh());

useHead({ title: 'Tranga' });
</script>
