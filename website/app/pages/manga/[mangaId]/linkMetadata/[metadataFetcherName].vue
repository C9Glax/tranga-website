<template>
    <MangaDetailPage :manga="manga">
        <UCard>
            <template #header>
                <h1>{{ metadataFetcherName }}</h1>
            </template>
            <template #default>
                <p>tbd</p>
            </template>
        </UCard>
    </MangaDetailPage>
</template>


<script setup lang="ts">

const route = useRoute();
const mangaId = route.params.mangaId as string;
const metadataFetcherName = route.params.metadataFetcherName as string;

const { data: manga } = await useApi('/v2/Manga/{MangaId}', {
    path: { MangaId: mangaId },
    key: FetchKeys.Manga.Id(mangaId),
    onResponseError: (e) => {
        console.error(e);
        navigateTo('/');
    },
});

useHead({ title: `Link Metadata ${manga.value?.name} ${metadataFetcherName}` });
</script>
