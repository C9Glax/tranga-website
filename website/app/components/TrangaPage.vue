<template>
    <UPageBody v-bind="$props" class="mt-0 pb-0 pr-4 h-full">
        <div class="flex flex-row gap-4 h-full relative">
            <div v-if="$slots.left" class="flex flex-col gap-2 bg-elevated w-2/7 h-full px-4 py-4">
                <slot name="left" />
            </div>
            <div :class="['flex flex-col gap-2 w-full py-4 relative', $slots.left ? '' : 'pl-4']">
                <div class="w-full flex flex-row justify-between mb-4">
                    <div class="flex flex-row gap-6">
                        <UButton variant="outline" color="neutral" :to="back?.href ?? '/'" :icon="back?.icon ?? 'i-lucide-home'">{{
                            back?.text ?? 'Home'
                        }}</UButton>
                        <slot name="title">
                            <p v-if="title" class="text-2xl text-primary font-semibold">{{ title }}</p>
                        </slot>
                    </div>
                    <div class="flex flew-row gap-2">
                        <slot name="actions" />
                    </div>
                </div>
                <slot />
            </div>
        </div>
    </UPageBody>
</template>

<script setup lang="ts">
import type { PageBodyProps } from '#ui/components/PageBody.vue';

export interface PageProps extends PageBodyProps {
    title?: string;
    back?: { href?: string; text?: string; icon?: string };
}

defineProps<PageProps>();
</script>
