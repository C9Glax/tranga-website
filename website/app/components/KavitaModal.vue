<template>
    <UModal v-bind="$props" title="Connect Kavita">
        <template #body>
            <UFormField label="URL">
                <UInput v-model="requestData.url" placeholder="https://" class="w-full" :disabled="busy" />
            </UFormField>
            <UFormField label="ApiKey">
                <UInput v-model="requestData.apiKey" class="w-full" :disabled="busy" />
            </UFormField>
            <UButton
                icon="i-lucide-link"
                :class="['mt-2 float-right', success == false ? 'animate-[shake_0.2s] bg-error' : '']"
                :loading="busy"
                :disabled="busy || !allowSend"
                @click="connect"
                >Connect</UButton
            >
        </template>
    </UModal>
</template>

<script setup lang="ts">
import type { components } from '#open-fetch-schemas/api';
type CreateKavitaRecord = components['schemas']['CreateKavitaRecord'];
const { $api } = useNuxtApp();

const requestData = ref<CreateKavitaRecord>({});

const allowSend = computed(() => requestData.value.url && requestData.value.apiKey);

const busy = ref<boolean>(false);
const success = ref<boolean | undefined>(undefined);
const emit = defineEmits<{ close: [boolean] }>();
const connect = async () => {
    busy.value = true;
    try {
        await $api('/v2/LibraryConnector/Kavita', { method: 'PUT', body: requestData.value });
        await refreshNuxtData(FetchKeys.Libraries.All);
        emit('close', false);
        success.value = true;
    } catch {
        success.value = false;
        setTimeout(() => (success.value = undefined), 200);
    } finally {
        busy.value = false;
    }
};
</script>
