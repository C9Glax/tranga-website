<template>
    <UApp>
        <UHeader :toggle="true">
            <template #left>
                <NuxtLink to="/">
                    <div class="h-full flex gap-2 items-center">
                        <img src="/blahaj.png" class="h-lh cursor-grab" alt="Blahaj" />
                        <p
                            style="
                                background: linear-gradient(110deg, var(--color-pink), var(--color-blue));
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                            "
                            class="font-bold cursor-pointer text-3xl">
                            Tranga
                        </p>
                    </div>
                </NuxtLink>
            </template>
            <template #content>
                <NuxtLink to="https://github.com/C9Glax/tranga" external no-prefetch><Icon name="i-lucide-github" />API</NuxtLink>
                <NuxtLink to="https://github.com/C9Glax/tranga-website" external no-prefetch
                    ><Icon name="i-lucide-github" />Website</NuxtLink
                >
                <NuxtLink :to="`${$config.public.openFetch.api.baseURL}swagger`" external no-prefetch
                    ><Icon name="i-lucide-book-open" />Swagger</NuxtLink
                >
            </template>
            <template #default>
                <div class="flex text-dimmed gap-2">
                    <NuxtLink to="https://github.com/C9Glax/tranga" external no-prefetch><Icon name="i-lucide-github" />API</NuxtLink>
                    <NuxtLink to="https://github.com/C9Glax/tranga-website" external no-prefetch
                        ><Icon name="i-lucide-github" />Website</NuxtLink
                    >
                    <NuxtLink :to="`${$config.public.openFetch.api.baseURL}swagger`" external no-prefetch
                        ><Icon name="i-lucide-book-open" />Swagger</NuxtLink
                    >
                </div>
            </template>
            <template #right>
                <UButton icon="i-lucide-plus" to="/search" color="primary">Manga</UButton>
                <UColorModeButton color="secondary" />
                <UButton icon="i-lucide-settings" variant="ghost" to="/settings" color="secondary" />
            </template>
        </UHeader>
        <UMain>
            <UPage>
                <NuxtPage />
            </UPage>
        </UMain>
    </UApp>
</template>
<script setup lang="ts"></script>
