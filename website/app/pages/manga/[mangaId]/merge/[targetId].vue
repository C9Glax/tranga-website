<template>
    <TrangaPage>
        <div class="flex flex-col items-center justify-center gap-10">
            <div class="flex flex-row max-sm:flex-col justify-evenly items-center">
                <MangaCard v-if="manga" :manga="manga" :expanded="true" />
                <USkeleton v-else class="max-w-[600px] w-full h-[350px]" />
                <UButton
                    icon="i-lucide-merge"
                    :class="[
                        reverse ? 'min-sm:-rotate-90 rotate-0' : 'min-sm:rotate-90 rotate-180',
                        'transition-transform duration-200 p-5 ml-6 mr-10 mt-10 mb-6',
                        'rounded-full',
                    ]"
                    size="xl"
                    variant="soft"
                    color="primary"
                    @click="reverse = !reverse" />
                <MangaCard v-if="target" :manga="target" :expanded="true" />
                <USkeleton v-else class="max-w-[600px] w-full h-[350px]" />
            </div>
            <p class="text-red-500 animate-pulse font-bold min-sm:text-3xl">This action is irreversible!</p>
            <UButton color="warning" variant="outline" class="w-fit" @click="merge">Merge</UButton>
        </div>
    </TrangaPage>
</template>

<script setup lang="ts">
const route = useRoute();
const targetId = route.params.targetId as string;
const mangaId = route.params.mangaId as string;
const { $api } = useNuxtApp();

const reverse = ref(false);
const { data: target } = await useApi('/v2/Manga/{MangaId}', { path: { MangaId: targetId }, key: FetchKeys.Manga.Id(targetId) });
const { data: manga } = await useApi('/v2/Manga/{MangaId}', { path: { MangaId: mangaId }, key: FetchKeys.Manga.Id(mangaId) });

const merge = async () => {
    const from = reverse.value ? mangaId : targetId;
    const to = reverse.value == false ? targetId : mangaId;
    await $api('/v2/Manga/{MangaIdFrom}/MergeInto/{MangaIdInto}', { method: 'POST', path: { MangaIdFrom: from, MangaIdInto: to } });
    navigateTo(`/manga/${to}?return=${path}`);
};

useHead({ title: 'Confirm merge' });
</script>
