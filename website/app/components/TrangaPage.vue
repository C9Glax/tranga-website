<template>
    <UPageBody v-bind="$props" class="mt-0 pb-0 h-[calc(100dvh-var(--ui-header-height))] relative min-xl:overflow-clip">
        <div class="flex min-md:flex-row max-md:flex-col gap-4 h-full relative">
            <div v-if="$slots.left" class="flex flex-col gap-2 bg-elevated min-md:w-3/7 min-xl:w-2/7 max-md:w-full py-4 pl-4 pr-2">
                <slot name="left" />
            </div>
            <div class="flex flex-col gap-2 w-full h-full py-4 relative">
                <div :class="['w-full flex flex-row justify-between', $slots.left ? 'min-md:pr-4 max-md:px-2' : 'px-4']">
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
                <div
                    :class="[$slots.left ? (rimless ? '' : 'min-md:mr-4 max-md:mx-2') : rimless ? '' : 'mx-4', 'h-full overflow-y-scroll']">
                    <div v-if="$slots.center" class="flex flex-col min-md:flex-row gap-2 w-full min-md:justify-center max-md:items-center">
                        <slot name="center" />
                    </div>
                    <slot />
                </div>
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
    rimless?: boolean;
}

defineProps<PageProps>();
</script>
