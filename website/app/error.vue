<template>
    <div>
        <h1>{{ error?.statusCode }}</h1>
        <p>{{ error?.message }}</p>
        <NuxtLink to="/">Go back home</NuxtLink>
        <NuxtLink to="https://github.com/C9Glax/tranga-website/issues/new"
            ><Icon name="i-lucide-github" />Report this issue</NuxtLink
        >
    </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps({
    // eslint-disable-next-line vue/require-default-prop
    error: Object as () => NuxtError,
});
</script>
