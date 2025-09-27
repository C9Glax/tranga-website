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
                <UButton icon="i-lucide-plus" :loading="busy" @click="onAddClick">Add</UButton>
            </div>
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';

const name = ref('');
const path = ref('');

const model = computed((): components['schemas']['CreateLibraryRecord'] => {
    return { basePath: path.value, libraryName: name.value };
});

const config = useRuntimeConfig();
const busy = ref(false);
const onAddClick = () => {
    busy.value = true;
    $fetch(new Request(`${config.public.openFetch.api.baseURL}v2/FileLibrary`), { method: 'PUT', body: model.value })
        .then(() => emit('change'))
        .finally(() => (busy.value = false));
};

const emit = defineEmits(['change']);
</script>
