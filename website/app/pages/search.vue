<template>
    <TrangaPage>
        <UPageSection :ui="{ container: 'gap-1 sm:gap-1 lg:gap-1 py-4 sm:py-1 lg:py-1 gap-1 sm:gap-1 lg:gap-1' }" class="h-fit">
            <div class="flex max-sm:flex-col flex-row w-full h-full justify-between gap-4">
                <UStepper v-model="activeStep" orientation="vertical" :items="items" class="h-full" disabled color="secondary" />
                <UCard class="grow">
                    <div class="flex flex-col justify-between gap-2">
                        <UInput v-model="query" class="w-full" :disabled="busy" />
                        <div class="flex flex-wrap gap-1 w-full justify-center">
                            <UButton
                                v-for="c in visibleConnectors"
                                :key="c.key"
                                :color="selectedConnector?.key == c.key ? 'secondary' : 'neutral'"
                                :disabled="busy"
                                @click="connectorClick(c)">
                                <template #leading>
                                    <FallbackImage :src="c.iconUrl" :alt="`${c.name} icon`" class="h-lh" />
                                </template>
                                {{ c.name }}
                            </UButton>
                            <UButton color="primary" :disabled="busy" :loading="busy" @click="performSearch">Search</UButton>
                        </div>
                    </div>
                </UCard>
            </div>
        </UPageSection>
        <UPageSection
            v-if="searchResult.length > 0"
            :ui="{ container: 'gap-1 sm:gap-1 lg:gap-1 py-1 sm:py-1 lg:py-1 gap-1 sm:gap-1 lg:gap-1' }">
            <template #description>
                <p class="text-lg">
                    Result<span v-if="searchResult.length > 1">s</span> for <span class="text-secondary">{{ searchQuery }}</span>
                </p>
            </template>
        </UPageSection>
        <MangaCardList
            :manga="searchResult"
            class="overflow-y-scroll h-full pb-70"
            @click="(m) => navigateTo(`/manga/${m.key}?return=${$route.fullPath}#download`)" />
    </TrangaPage>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
import type { StepperItem } from '@nuxt/ui';
type MangaConnector = components['schemas']['MangaConnector'];
type MinimalManga = components['schemas']['MinimalManga'];

const { data: connectors } = await useApi('/v2/MangaConnector', { key: FetchKeys.MangaConnector.All, server: false });

const { data: showNsfw } = await useApi('/v2/Settings/ShowNSFW', { server: false });

const query = ref<string>();
const connector = useState<MangaConnector | undefined>('search-connector', () => undefined);
const selectedConnector = computed(
    () => connector.value ?? connectors.value?.find((c) => c.name === 'Global') ?? connectors.value?.find((c) => c.enabled)
);
const activeStep = ref(0);
const busy = ref<boolean>(false);

watch(query, (v) => {
    if (!v) activeStep.value = 0;
    else activeStep.value = 1;
});

const isUrl = (input: string): boolean => {
    try {
        new URL(input);
        return true;
    } catch {
        return false;
    }
};

// Filter connectors based on NSFW setting
const visibleConnectors = computed(() =>
    connectors.value?.filter(c => c.enabled && (showNsfw.value || !c.nsfw)) ?? []
);

const connectorClick = (c: MangaConnector) => {
    connector.value = c;
    performSearch();
};

const searchResult = useState<MinimalManga[]>(() => []);
const searchQuery = useState<string>(() => '');
const performSearch = async () => {
    if (!query.value) return;
    busy.value = true;
    searchQuery.value = query.value;
    await search(query.value)
        .then((data) => {
            searchResult.value = data;
            activeStep.value = 2;
        })
        .finally(() => {
            refreshNuxtData(FetchKeys.Manga.All);
            busy.value = false;
        });
};

const search = async (query: string): Promise<MinimalManga[]> => {
    if (isUrl(query)) {
        const { data } = await useApi('/v2/Search', { query: { url: JSON.stringify(query) } });
        if (data.value) {
            connector.value = connectors.value!.find((c) => c.name == data.value!.mangaConnectorIds[0]!.mangaConnectorName)!;
            return [data.value];
        } else return Promise.reject();
    } else if (selectedConnector.value?.name) {
        const { data } = await useApi('/v2/Search/{MangaConnectorName}/{Query}', {
            path: { MangaConnectorName: selectedConnector.value.name, Query: query },
            method: 'GET',
        });
        if (data.value) return data.value;
        else return Promise.reject();
    } else return Promise.reject();
};

const items = ref<StepperItem[]>([
    { title: 'Query', description: 'The name or URL', icon: 'i-lucide-search' },
    { title: 'Site', description: 'Select the site on which to search', icon: 'i-lucide-panel-top' },
    { title: 'Results', icon: 'i-lucide-logs' },
]);

useHead({ title: 'Search Manga' });
</script>
