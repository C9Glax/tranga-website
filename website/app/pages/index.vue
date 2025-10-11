<template>
    <UPageBody class="p-4 flex flex-row flex-wrap gap-6 mt-0">
        <USkeleton v-if="status !== 'success'" class="w-[240px] h-[350px]" />
        <MangaCard
            v-for="(m, i) in manga"
            v-else
            :key="m.key"
            :manga="m"
            :expanded="i === expanded"
            @click="expanded = expanded === i ? -1 : i">
            <template #actions="formanga">
                <UButton :to="`manga/${formanga.key}`">Details</UButton>
            </template>
        </MangaCard>
    </UPageBody>
</template>

<script setup lang="ts">
const { data: manga, status } = await useApi('/v2/Manga', { key: FetchKeys.Manga.All, lazy: true });
const expanded = ref(-1);
</script>
