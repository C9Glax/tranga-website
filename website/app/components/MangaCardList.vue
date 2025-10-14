<template>
    <div class="grid grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-4">
        <MangaCard
            v-for="(m, i) in manga"
            :key="m.key"
            :manga="m"
            :expanded="i === expanded"
            class="cursor-pointer basis-(--mangacover-width)"
            @click="$emit('click', m)" />
    </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type Manga = components['schemas']['Manga'];
type MinimalManga = components['schemas']['MinimalManga'];

const expanded = ref(-1);

defineEmits<{ (e: 'click', manga: MinimalManga | Manga): void }>();
defineProps<{ manga?: (MinimalManga | Manga)[] }>();
</script>
