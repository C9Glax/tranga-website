<template>
    <TrangaPage rimless>
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
                <UButton v-if="row.original.mangaId" :to="`/manga/${row.original.mangaId}?return=${$route.fullPath}`">Manga</UButton>
            </template>
            <template #chapter-cell="{ row }">
                <UButton v-if="row.original.chapterId" :to="`/manga/${row.original.chapterId}?return=${$route.fullPath}`">Chapter</UButton>
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

const params = ref<Partial<Filter>>(useRoute().query);
const { data, refresh } = useApi('/v2/Actions/Filter', { method: 'POST', body: params.value, immediate: false });

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
    await refresh();
};
defineShortcuts({ meta_r: { usingInput: true, handler: refreshData } });
</script>
