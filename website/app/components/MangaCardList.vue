<template>
    <div class="flex flex-row flex-wrap gap-2 justify-evenly">
        <MangaCard
            v-for="(m, i) in manga"
            :key="m.key"
            :manga="m"
            :expanded="i === expanded"
            class="cursor-pointer"
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
