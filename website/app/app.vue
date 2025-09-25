<template>
    <UApp>
        <UHeader>
            <template #title>
                <div class="h-full flex gap-2 items-center">
                    <img src="/blahaj.png" class="h-lh cursor-grab" />
                    <p
                        style="
                            background: linear-gradient(110deg, var(--color-pink), var(--color-blue));
                            -webkit-background-clip: text;
                            -webkit-text-fill-color: transparent;
                        "
                        class="font-bold cursor-default text-3xl">
                        Tranga
                    </p>
                </div>
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
