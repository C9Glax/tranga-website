<template>
    <MangaCard v-for="(m, i) in manga" :key="m.key" :manga="m" :expanded="i === expanded" @click="expanded = expanded === i ? -1 : i">
        <template #actions="forManga">
            <UButton :to="`manga/${forManga.key}`">Details</UButton>
        </template>
    </MangaCard>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type Manga = components['schemas']['Manga'];
type MinimalManga = components['schemas']['MinimalManga'];

const expanded = ref(-1);
defineProps<{manga?: (MinimalManga | Manga)[]}>()
</script>
