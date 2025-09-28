<template>
    <UApp>
        <UHeader>
            <template #left>
                <NuxtLink to="https://github.com/C9Glax/tranga"><Icon name="i-lucide-github" />API</NuxtLink>
                <NuxtLink to="https://github.com/C9Glax/tranga-website"
                    ><Icon name="i-lucide-github" />Website</NuxtLink
                >
                <NuxtLink :to="`${$config.public.apiParty.endpoints.api?.url}swagger`"
                    ><Icon name="i-lucide-book-open" />Swagger</NuxtLink
                >
            </template>
            <template #default>
                <NuxtLink to="/">
                    <div class="h-full flex gap-2 items-center">
                        <img src="/blahaj.png" class="h-lh cursor-grab" />
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
            <template #right>
                <UButton icon="i-lucide-plus" to="/search">Add</UButton>
                <UColorModeButton />
                <UButton icon="i-lucide-settings" variant="ghost" to="/settings" />
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
