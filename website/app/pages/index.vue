<template>
    <LoadingPage :loading="status === 'pending'">
        <MangaCardList :manga="manga" class="mx-4 mt-2" />
    </LoadingPage>
</template>

<script setup lang="ts">
const { data: manga, refresh, status } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All, lazy: true });
onMounted(() => refresh());

useHead({ title: 'Tranga' });
</script>
