<template>
    <TrangaPage :back="{ href: backUrl ?? `/manga/${mangaId}/merge/`, text: 'Back', icon: 'i-lucide-arrow-left' }">
        <div class="flex flex-col items-center justify-center gap-10">
            <div class="flex flex-row justify-evenly items-center">
                <MangaCard v-if="manga" :manga="manga" :expanded="true" />
                <USkeleton v-else class="max-w-[600px] w-full h-[350px]" />
                <UButton
                    icon="i-lucide-merge"
                    :class="[reverse ? 'rotate-270' : 'rotate-90', 'px-20 transition-transform duration-200 p-5 m-10', 'rounded-full']"
                    size="xl"
                    variant="soft"
                    color="primary"
                    @click="reverse = !reverse" />
                <MangaCard v-if="target" :manga="target" :expanded="true" />
                <USkeleton v-else class="max-w-[600px] w-full h-[350px]" />
            </div>
            <p class="text-red-500 animate-pulse font-bold text-3xl">This action is irreversible!</p>
            <UButton color="warning" variant="outline" class="w-fit" @click="merge">Merge</UButton>
        </div>
    </TrangaPage>
</template>

<script setup lang="ts">
const route = useRoute();
const targetId = route.params.targetId as string;
const mangaId = route.params.mangaId as string;
const path = route.fullPath;
const backUrl = route.query.return as string | undefined;
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
