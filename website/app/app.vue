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
                                background-clip: text;
                                -webkit-background-clip: text;
                                -webkit-text-fill-color: transparent;
                            "
                            class="font-bold cursor-pointer text-3xl">
                            Tranga
                        </p>
                    </div>
                </NuxtLink>
            </template>
            <template #body>
                <UNavigationMenu :items="items" orientation="vertical" variant="link" color="neutral" />
            </template>
            <template #default>
                <UNavigationMenu :items="items" orientation="horizontal" variant="link" color="neutral" />
            </template>
            <template #right>
                <UButton
                    icon="i-lucide-brick-wall-shield"
                    :to="`/actions?return=${$route.fullPath}`"
                    :disabled="$route.fullPath.startsWith('/actions')"
                    variant="soft"
                    color="secondary" />
                <UButton icon="i-lucide-plus" to="/search" color="primary" label="Manga" />
                <UColorModeButton color="secondary" />
                <UButton
                    icon="i-lucide-settings"
                    variant="ghost"
                    :to="`/settings?return=${$route.fullPath}`"
                    :disabled="$route.fullPath.startsWith('/settings')"
                    color="secondary" />
            </template>
        </UHeader>
        <UMain>
            <UPage>
                <NuxtPage />
            </UPage>
        </UMain>
    </UApp>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '#ui/components/NavigationMenu.vue';

const items = computed<NavigationMenuItem[]>(() => [
    { label: 'API', to: 'https://github.com/C9Glax/tranga', icon: 'i-lucide-github', target: '_blank' },
    { label: 'Website', to: 'https://github.com/C9Glax/tranga/website', icon: 'i-lucide-github', target: '_blank' },
    { label: 'Swagger', to: `${useRuntimeConfig().public.openFetch.api.baseURL}swagger`, icon: 'i-lucide-book-open', target: '_blank' },
]);
</script>
