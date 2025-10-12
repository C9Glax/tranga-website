<template>
    <USelect
        v-model="library"
        placeholder="Library"
        icon="i-lucide-library-big"
        color="secondary"
        :items="libraries?.map((l) => l.key)"
        class="w-xs">
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
export interface LibrarySelectProps {
    libraryId?: string;
}

const props = defineProps<LibrarySelectProps>();

const library = ref(props.libraryId);
const { data: libraries } = await useApi('/v2/FileLibrary', { key: FetchKeys.FileLibraries });
</script>
