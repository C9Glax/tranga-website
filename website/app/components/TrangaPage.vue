<template>
    <UPageBody v-bind="$props" class="mt-0 pb-0 min-md:pr-4 h-full">
        <div class="flex min-md:flex-row max-md:flex-col gap-4 h-full relative">
            <div v-if="$slots.left" class="flex flex-col gap-2 bg-elevated min-md:w-3/7 min-xl:w-2/7 max-md:w-full px-4 max-md:px-2 py-4">
                <slot name="left" />
            </div>
            <div :class="['flex flex-col gap-2 w-full py-4 relative max-md:px-2', $slots.left ? '' : 'pl-4']">
                <div class="w-full flex flex-row justify-between mb-4">
                    <div class="flex flex-row gap-6">
                        <UButton
                            variant="outline"
                            color="neutral"
                            :to="backUrl ?? '/'"
                            :icon="backUrl ? 'i-lucide-arrow-left' : 'i-lucide-home'"
                            >{{ backUrl ? 'Back' : 'Home' }}</UButton
                        >
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

const route = useRoute();
const backUrl = route.query.return as string | undefined;

export interface PageProps extends PageBodyProps {
    title?: string;
}

defineProps<PageProps>();
</script>
