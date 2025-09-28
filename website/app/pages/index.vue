<template>
    <UPageBody class="p-4 flex flex-row flex-wrap gap-6 mt-0">
        <MangaCard
            v-for="(m, i) in manga"
            :manga="m"
            :expanded="i === expanded"
            @click="expanded = expanded === i ? -1 : i">
            <template #actions="manga">
                <UButton :to="`manga/${manga.key}`">Details</UButton>
            </template>
        </MangaCard>
    </UPageBody>
</template>

<script setup lang="ts">
const { data: manga } = await useApiData('/v2/Manga', { key: FetchKeys.Manga.All });
const expanded = ref(-1);
</script>

<style scoped></style>
