<template>
    <div class="relative w-[240px] h-[350px] rounded-lg overflow-clip">
        <div
            v-if="blur"
            class="absolute l-0 t-0 w-full h-full rounded-lg overflow-clip"
            style="
                background: linear-gradient(150deg, rgba(245, 169, 184, 0.3) 50%, rgba(91, 206, 250, 0.2));
                box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(2px) brightness(70%);
                -webkit-backdrop-filter: blur(2px) brightness(70%);
            ">
            <p class="p-3 text-xl font-semibold max-h-full overflow-clip">{{ manga?.name }}</p>
        </div>
        <LazyNuxtImg
            :src="`${$config.public.apiParty.endpoints.Api!.url}v2/Manga/${manga.key}/Cover/Medium`"
            class="w-full h-full object-cover" />
    </div>
</template>

<script setup lang="ts">
import type { ApiModel } from '#nuxt-api-party'
type MinimalManga = ApiModel<'MinimalManga'>;
type Manga = ApiModel<'Manga'>;
defineProps<{ manga: Manga | MinimalManga; blur?: boolean }>();
</script>
