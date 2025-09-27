<template>
    <UPageSection :ui="{ container: 'gap-4 sm:gap-4 lg:gap-4 ' }">
        <UButton variant="ghost" to="/" icon="i-lucide-arrow-left" class="w-min">Back</UButton>
        <div class="flex flex-row w-full h-full justify-between gap-4">
            <UStepper v-model="activeStep" orientation="vertical" :items="items" class="h-full" disabled />
            <UCard class="grow">
                <div class="flex flex-col justify-between gap-2">
                    <UInput v-model="query" class="w-full" :disabled="busy" />
                    <div class="flex gap-1 w-full justify-center">
                        <UButton
                            v-for="c in connectors"
                            @click="connectorClick(c)"
                            :color="connector?.key == c.key ? 'success' : 'neutral'"
                            :disabled="busy">
                            <template #leading>
                                <NuxtImg :src="c.iconUrl" class="h-lh" />
                            </template>
                            {{ c.name }}
                        </UButton>
                        <UButton color="secondary" :disabled="busy" @click="performSearch" :loading="busy"
                            >Search</UButton
                        >
                    </div>
                </div>
            </UCard>
        </div>
    </UPageSection>
    <UPageSection v-if="searchResult.length > 0" :ui="{ container: 'py-0 sm:py-0 lg:py-0' }">
        <template #description>
            <p class="text-lg">Result for '{{ searchQuery }}'</p>
        </template>
        <template #default>
            <div class="relative flex flex-row flex-wrap gap-6 mt-0">
                <MangaCard
                    v-for="(m, i) in searchResult"
                    :manga="m"
                    :expanded="i === expanded"
                    @click="expanded = expanded === i ? -1 : i">
                    <template #actions="manga">
                        <UButton :to="`download/${manga.key}`">Download</UButton>
                    </template>
                </MangaCard>
            </div>
        </template>
    </UPageSection>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
import type { StepperItem } from '@nuxt/ui';
type MangaConnector = components['schemas']['MangaConnector'];
type MinimalManga = components['schemas']['MinimalManga'];

const { data: connectors } = useApi('/v2/MangaConnector');

const query = ref<string>();
const connector = useState<MangaConnector>();
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

const connectorClick = (c: MangaConnector) => {
    connector.value = c;
    performSearch();
};

const searchResult = useState<MinimalManga[]>(() => []);
const expanded = useState(() => -1);
const searchQuery = useState<string>(() => '');
const performSearch = () => {
    if (!query.value) return;
    busy.value = true;
    searchQuery.value = query.value;
    search(query.value)
        .then((data) => {
            searchResult.value = data;
            activeStep.value = 2;
        })
        .finally(() => (busy.value = false));
};

const config = useRuntimeConfig();

const search = async (query: string): Promise<MinimalManga[]> => {
    if (isUrl(query)) {
        return await $fetch<MinimalManga>(new Request(`${config.public.openFetch.api.baseURL}v2/Search/Url`), {
            method: 'POST',
            body: JSON.stringify(query),
        }).then(x => [x]);
    } else if (connector.value) {
        return await $fetch<MinimalManga[]>(
            new Request(`${config.public.openFetch.api.baseURL}v2/Search/${connector.value.name}/${query}`)
        );
    }
    return Promise.reject();
};

const items = ref<StepperItem[]>([
    { title: 'Query', description: 'The name or URL', icon: 'i-lucide-search' },
    { title: 'Site', description: 'Select the site on which to search', icon: 'i-lucide-panel-top' },
    { title: 'Results', icon: 'i-lucide-logs' },
]);
</script>
