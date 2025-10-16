<template>
    <LoadingPage :loading="status === 'pending'">
        <MangaCardList :manga="manga" class="min-md:mx-4 max-md:mx-0 mt-2" @click="(m) => navigateTo(`/manga/${m.key}`)" />
    </LoadingPage>
</template>

<script setup lang="ts">
const { data: manga, refresh, status } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All, lazy: true });
onMounted(() => refresh());

useHead({ title: 'Tranga' });
</script>
