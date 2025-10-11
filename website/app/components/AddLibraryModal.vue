<template>
    <UModal v-bind="$props" title="Add Library">
        <template #body>
            <div class="flex flex-col gap-2">
                <UFormField label="Library Name" required>
                    <UInput v-model="name" placeholder="Name for the library" class="w-full" :disabled="busy" />
                </UFormField>
                <UFormField label="Directory Path" required>
                    <UInput v-model="path" placeholder="Path for the library" class="w-full" :disabled="busy" />
                </UFormField>
                <UButton icon="i-lucide-plus" :loading="busy" @click="onAddClick" class="w-fit">Add</UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type CreateLibraryRecord = components['schemas']['CreateLibraryRecord'];

const name = ref('');
const path = ref('');

const model: ComputedRef = computed((): CreateLibraryRecord => {
    return { basePath: path.value, libraryName: name.value };
});

const busy = ref(false);
const onAddClick = async () => {
    if (!model.value) return;
    busy.value = true;
    await useApi('/v2/FileLibrary', { method: 'PUT', body: model.value })
        .then(() => refreshNuxtData(FetchKeys.FileLibraries))
        .finally(() => (busy.value = false));
};
</script>
