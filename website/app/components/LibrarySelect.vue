<template>
    <USelect
        v-model="library"
        placeholder="Library"
        icon="i-lucide-library-big"
        color="secondary"
        :items="libraries?.map((l) => l.key)"
        class="w-xs"
        :loading="loading"
        @change="onLibrarySelectChange">
        <template #default="{ modelValue }">
            <p v-if="modelValue">
                <span class="mr-2">{{ libraries?.find((l) => l.key == modelValue)?.libraryName }}</span>
                <span class="text-secondary">({{ libraries?.find((l) => l.key == modelValue)?.basePath }})</span>
            </p>
        </template>
        <template #item="{ item }">
            <p>
                <span class="mr-2">{{ libraries?.find((l) => l.key == item)?.libraryName }}</span>
                <span class="text-secondary">({{ libraries?.find((l) => l.key == item)?.basePath }})</span>
            </p>
        </template>
    </USelect>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp();

export interface LibrarySelectProps {
    mangaId: string;
    libraryId?: string;
}

const props = defineProps<LibrarySelectProps>();

const library = ref(props.libraryId);
const { data: libraries } = await useApi('/v2/FileLibrary', { key: FetchKeys.FileLibraries });

const loading = ref(false);
const onLibrarySelectChange = async () => {
    if (!library.value) return;
    loading.value = true;
    await $api('/v2/Manga/{MangaId}/ChangeLibrary/{LibraryId}', {
        method: 'POST',
        path: { MangaId: props.mangaId, LibraryId: library.value },
    });
    await refreshNuxtData(FetchKeys.Manga.Id(props.mangaId));
    loading.value = false;
    emit('libraryChanged', library.value);
};

const emit = defineEmits<{
    (e: 'libraryChanged', id?: string): void;
}>();
</script>
