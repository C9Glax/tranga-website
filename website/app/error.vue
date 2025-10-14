<template>
    <UPageBody>
        <UPageHero :title="String(error?.statusCode) ?? 'Error'" :description="error?.message">
            <UButton to="/" class="w-fit place-self-center">Go back home</UButton>
            <NuxtLink to="https://github.com/C9Glax/tranga-website/issues/new" class="w-fit place-self-center hover:underline"><Icon name="i-lucide-github" class="mr-2" />Report this issue</NuxtLink>
        </UPageHero>
    </UPageBody>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
    // eslint-disable-next-line vue/require-default-prop
    error: Object as () => NuxtError,
});
</script>
