<template>
    <div class="w-6 h-6 inline-block align-middle m-1">
        <NuxtLink :href="props.websiteUrl ?? ''" target="_blank" external no-prefetch>
            <UTooltip :text="`${props.useForDownload ? 'Downloading' : 'Not downloading'}, click to see website`">
                <NuxtImg
                    v-if="mangaConnector"
                    :src="mangaConnector?.iconUrl"
                    :class="[
                        'w-full rounded-full outline-2 -outline-offset-1',
                        props.useForDownload ? 'outline-green-500' : 'outline-red-500',
                    ]" />
                <p v-else>{{ mangaConnectorName }}</p>
            </UTooltip>
        </NuxtLink>
    </div>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type MangaConnectorId = components['schemas']['MangaConnectorId'];

const props = defineProps<MangaConnectorId>();

const { data: mangaConnector } = await useApi('/v2/MangaConnector/{MangaConnectorName}', {
    path: { MangaConnectorName: props.mangaConnectorName },
    key: FetchKeys.MangaConnector.Id(props.mangaConnectorName),
    server: false,
});
</script>
