<template>
    <UPageBody v-if="loading">
        <UPageHero title="Loading..." />
    </UPageBody>
    <UPageBody v-else v-bind="$props">
        <template v-for="(_, slotName) in $slots" #[slotName]>
            <slot :name="slotName" />
        </template>
    </UPageBody>
</template>

<script setup lang="ts">
import type { PageBodyProps } from '#ui/components/PageBody.vue';

export interface LoadingPageProps extends PageBodyProps {
    loading: boolean;
}

defineProps<LoadingPageProps>();
</script>
