<template>
    <UModal v-bind="$props" title="Connect Komga">
        <template #body>
            <UFormField label="URL">
                <UInput v-model="requestData.url" placeholder="https://" class="w-full" />
            </UFormField>
            <UFormField label="ApiKey">
                <template #description>
                    <ULink class="underline" :disabled="!apiLink" :to="apiLink" target="_blank" external no-prefetch>Get your API Key</ULink>
                </template>
                <UInput v-model="requestData.apiKey" class="w-full" />
            </UFormField>
            <UButton
                icon="i-lucide-link"
                :class="['mt-2 float-right', success == false ? 'animate-[shake_0.2s] bg-error' : '']"
                loading-auto
                :disabled="!allowSend"
                @click="connect"
                >Connect</UButton
            >
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type CreateKomgaRecord = components['schemas']['CreateKomgaRecord'];
const { $api } = useNuxtApp();

const requestData = ref<CreateKomgaRecord>({ url: '', apiKey: '' });

const allowSend = computed(() => requestData.value.url && requestData.value.apiKey);

const apiLink = computed(() => {
    console.log(requestData.value.url)
    if (!requestData.value.url)
        return undefined;
    try {
        const url = new URL(requestData.value.url);
        return `${url.protocol}//${url.host}/account/api-keys`;
    }catch{
        return undefined;
    }
});

const success = ref<boolean | undefined>(undefined);
const emit = defineEmits<{ close: [boolean] }>();
const connect = async () => {
    try {
        await $api('/v2/LibraryConnector/Komga', { method: 'PUT', body: requestData.value });
        await refreshNuxtData(FetchKeys.Libraries.All);
        emit('close', false);
        success.value = true;
    } catch {
        success.value = false;
        setTimeout(() => (success.value = undefined), 200);
    }
};
</script>
