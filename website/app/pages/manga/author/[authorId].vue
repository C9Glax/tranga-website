<template>
    <TrangaPage>
        <template #title>
            <h1 class="text-2xl">
                Manga with Author <UBadge variant="outline" color="neutral" class="font-semibold text-xl ml-1">{{ author?.name }}</UBadge>
            </h1>
        </template>
        <LoadingPage :loading="status === 'pending'">
            <MangaCardList :manga="manga" @click="(m) => navigateTo(`/manga/${m.key}?return=${$route.fullPath}`)" />
        </LoadingPage>
    </TrangaPage>
</template>

<script setup lang="ts">
const authorId = useRoute().params.authorId as string;

const { data: author } = await useApi('/v2/Author/{AuthorId}', { path: { AuthorId: authorId } });
const { data: manga, status } = await useApi('/v2/Manga/WithAuthorId/{AuthorId}', { path: { AuthorId: authorId }, lazy: true });

useHead({ title: 'Author Search' });
</script>
