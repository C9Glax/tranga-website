<template>
    <TrangaPage rimless>
        <template #center>
            <USelect v-model="params.action" :items="ActionTypes?.map(a => a.split(/(?=[A-Z])/).join(' '))" class="w-50" @change="refreshData" />
            <UInput v-model="params.start" trailing-icon="i-lucide-chevron-first" type="datetime-local" @change="refreshData" />
            <UInput v-model="params.end" icon="i-lucide-chevron-last" type="datetime-local" @change="refreshData" />
        </template>
        <template #actions>
            <UTooltip text="Reload" :kbds="['meta', 'R']">
                <UButton variant="soft" color="secondary" icon="i-lucide-refresh-ccw" loading-auto @click="refreshData" />
            </UTooltip>
        </template>
        <UTable :data="data" :columns="columns" :sticky="'header'">
            <template #action-cell="{ row }">
                {{ row.original.action.split(/(?=[A-Z])/).join(' ') }}
            </template>
            <template #timestamp-cell="{ row }">
                {{ new Date(row.original.performedAt).toLocaleString() }}
            </template>
            <template #manga-cell="{ row }">
                <UButton v-if="row.original.mangaId" :to="`/manga/${row.original.mangaId}?return=${$route.fullPath}`" variant="ghost" color="primary">Manga</UButton>
            </template>
            <template #chapter-cell="{ row }">
                <UButton v-if="row.original.chapterId" :to="`/manga/${row.original.chapterId}?return=${$route.fullPath}`" variant="ghost" color="secondary">Chapter</UButton>
            </template>
            <template #additional-cell="{ row }">
                <p v-if="row.original.from">From: {{ row.original.from }}</p>
                <p v-if="row.original.to">To: {{ row.original.to }}</p>
                <p v-if="row.original.filename">Filename: {{ row.original.filename }}</p>
                <p v-if="row.original.metadataFetcher">Metadata Fetcher: {{ row.original.metadataFetcher }}</p>
            </template>
        </UTable>
    </TrangaPage>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
import type { TableColumn } from '#ui/components/Table.vue';
type Filter = components['schemas']['Filter'];
type ActionRecord = components['schemas']['ActionRecord'];

const { $api } = useNuxtApp();

const params = computed<Partial<Filter>>(() => { return  { ...useRoute().query,
    start: new Date(Date.now()-(24 * 60 * 60 * 1000)).toISOString().slice(0, 16),
    end: new Date(Date.now()).toISOString().slice(0, 16),
}});
const data = ref(await $api('/v2/Actions/Filter', { method: 'POST', body: params.value }));
const { data: ActionTypes } = useApi('/v2/Actions/Types', { key : FetchKeys.Actions.Types });

const columns: TableColumn<ActionRecord>[] = [
    {
        id: 'action',
        accessorKey: 'action',
        header: 'Action'
    },
    {
        id: 'timestamp',
        accessorKey: 'performedAt',
        header: 'Timestamp'
    },
    {
        id: 'manga',
        accessorKey: 'mangaId',
        header: 'Manga'
    },
    {
        id: 'chapter',
        accessorKey: 'chapterId',
        header: 'Chapter'
    },
    {
        id: 'additional',
        header: 'Additional'
    },
];

const refreshData = async (): Promise<void> => {
    data.value = await $api('/v2/Actions/Filter', { method: 'POST', body: params.value });
};
defineShortcuts({ meta_r: { usingInput: true, handler: refreshData } });
</script>
