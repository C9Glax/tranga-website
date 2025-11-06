<template>
    <TrangaPage rimless>
        <template #center>
            <UButton color="primary" icon="i-lucide-rotate-ccw" class="max-md:order-1" @click="resetFilter" />
            <USelect v-model="params.action" :items="ActionTypes" class="w-70 max-md:order-3" @change="refreshData" />
            <UInput
                v-model="params.start"
                icon="i-lucide-chevron-first"
                class="w-70 max-md:order-4"
                type="datetime-local"
                @change="refreshData" />
            <UTooltip text="No timelimit" class="max-md:order-2">
                <UButton color="primary" icon="i-lucide-infinity" @click="noTimeLimit" />
            </UTooltip>
            <UInput
                v-model="params.end"
                icon="i-lucide-chevron-last"
                type="datetime-local"
                class="w-70 max-md:order-5"
                @change="refreshData" />
        </template>
        <template #actions>
            <UTooltip text="Reload" :kbds="['meta', 'R']">
                <UButton variant="soft" color="secondary" icon="i-lucide-refresh-ccw" loading-auto @click="refreshData" />
            </UTooltip>
        </template>
        <div class="w-full pt-2">
            <div class="flex gap-2 justify-center items-center max-sm:flex-col">
                <p class="text-dimmed basis-0 text-nowrap">{{ data?.totalCount }} Actions</p>
                <UPagination
                    :default-page="pagination.pageIndex + 1"
                    :items-per-page="pagination.pageSize"
                    :total="data?.totalCount ?? 0"
                    class="basis-0"
                    @update:page="(p) => (pagination.pageIndex = p - 1)" />
            </div>
            <UTable ref="table" :data="data?.data" :columns="columns" :sticky="'header'" :loading="status === 'pending'" class="h-full">
                <template #action-cell="{ row }">
                    {{ row.original.action.split(/(?=[A-Z])/).join(' ') }}
                </template>
                <template #timestamp-cell="{ row }">
                    {{ new Date(row.original.performedAt).toLocaleString() }}
                </template>
                <template #manga-cell="{ row }">
                    <UButton
                        v-if="row.original.mangaId"
                        :to="`/manga/${row.original.mangaId}?return=${$route.fullPath}`"
                        variant="ghost"
                        color="primary"
                        >Manga</UButton
                    >
                </template>
                <template #chapter-cell="{ row }">
                    <UButton
                        v-if="row.original.chapterId"
                        :to="`/manga/${row.original.mangaId}?return=${$route.fullPath}#${row.original.chapterId}`"
                        variant="ghost"
                        color="secondary"
                        >Chapter</UButton
                    >
                </template>
                <template #additional-cell="{ row }">
                    <p v-if="row.original.from">From: {{ row.original.from }}</p>
                    <p v-if="row.original.to">To: {{ row.original.to }}</p>
                    <p v-if="row.original.filename">Filename: {{ row.original.filename }}</p>
                    <p v-if="row.original.metadataFetcher">Metadata Fetcher: {{ row.original.metadataFetcher }}</p>
                </template>
            </UTable>
        </div>
    </TrangaPage>
</template>

<script setup lang="ts">
import type { TableColumn } from '#ui/components/Table.vue';
import type { UTable } from '#components';
import type { components } from '#open-fetch-schemas/api';
type ActionsFilterRecord = components['schemas']['ActionsFilterRecord'];
type ActionRecord = components['schemas']['ActionRecord'];

const { $api } = useNuxtApp();

const pagination = ref({ pageIndex: 0, pageSize: 10 });

const timezoneOffsetMillis = new Date().getTimezoneOffset() * 60 * 1000;
const params = ref<Partial<ActionsFilterRecord>>({
    ...useRoute().query,
    start: new Date(Date.now() - 24 * 60 * 60 * 1000 - timezoneOffsetMillis).toISOString().slice(0, 16),
    end: new Date(Date.now() - timezoneOffsetMillis).toISOString().slice(0, 16),
});
const { data, refresh, status } = useAsyncData(
    FetchKeys.Actions.Page(params.value, pagination.value.pageIndex),
    () =>
        $api('/v2/Actions/Filter', {
            method: 'POST',
            body: params.value,
            query: { page: pagination.value.pageIndex + 1, pageSize: pagination.value.pageSize },
        }),
    { watch: [pagination.value], lazy: true, server: false }
);
const { data: ActionTypes } = useApi('/v2/Actions/Types', { key: FetchKeys.Actions.Types, server: false });

const columns: TableColumn<ActionRecord>[] = [
    { id: 'action', accessorKey: 'action', header: 'Action' },
    { id: 'timestamp', accessorKey: 'performedAt', header: 'Timestamp' },
    { id: 'manga', accessorKey: 'mangaId', header: 'Manga' },
    { id: 'chapter', accessorKey: 'chapterId', header: 'Chapter' },
    { id: 'additional', header: 'Additional' },
];

const resetFilter = async () => {
    params.value = {
        ...useRoute().query,
        start: new Date(Date.now() - 24 * 60 * 60 * 1000 - timezoneOffsetMillis).toISOString().slice(0, 16),
        end: new Date(Date.now() - timezoneOffsetMillis).toISOString().slice(0, 16),
    };
    await refreshData();
};

const noTimeLimit = async () => {
    params.value = {
        ...params.value,
        start: new Date(0).toISOString().slice(0, 16),
        end: new Date(Date.now() - timezoneOffsetMillis).toISOString().slice(0, 16),
    };
    await refreshData();
};

const refreshData = async (): Promise<void> => {
    if (!params.value.start || !params.value.end) return Promise.reject();
    pagination.value.pageIndex = 0;
    await refresh();
};
defineShortcuts({ meta_r: { usingInput: true, handler: refreshData } });
</script>
