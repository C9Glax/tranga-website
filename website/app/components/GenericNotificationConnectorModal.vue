<template>
    <UModal v-bind="$props" title="Connect Notifcation Connector">
        <template #body>
            <UFormField label="Name">
                <UInput v-model="requestData.name" placeholder="Name" class="w-full" />
            </UFormField>
            <UFormField label="URL">
                <UInput v-model="requestData.url" placeholder="https://" class="w-full" />
            </UFormField>
            <UFormField label="HTTP Method">
                <UInput v-model="requestData.httpMethod" class="w-full" />
            </UFormField>
            <UFormField label="Body">
                <UTextarea v-model="requestData.body" type="number" class="w-full" />
            </UFormField>
            <UFormField label="Headers">
                <div class="flex flex-col gap-2">
                    <div v-for="(value, name, index) in requestData.headers" :key="index" class="flex gap-1">
                        <UInput :model-value="name" disabled class="grow" />
                        <UInput :model-value="value" disabled class="grow" />
                        <UButton icon="i-lucide-minus" color="secondary" variant="outline" @click="delete requestData.headers[name]" />
                    </div>
                    <UPopover v-model:open="addHeaderOpen" modal class="w-fit self-end">
                        <UButton icon="i-lucide-plus" color="secondary" variant="soft">Add</UButton>

                        <template #content>
                            <div class="flex gap-1 p-2">
                                <UInput v-model="keyRef" placeholder="key" />
                                <UInput v-model="valRef" placeholder="value" />
                                <UButton icon="i-lucide-plus" @click="addHeader">Add</UButton>
                            </div>
                        </template>
                    </UPopover>
                </div>
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
type CreateNotificationConnectorRecord = components['schemas']['CreateNotificationConnectorRecord'];
const { $api } = useNuxtApp();

const requestData = ref<CreateNotificationConnectorRecord>({ name: '', url: '', httpMethod: 'POST', body: '', headers: {} });

const allowSend = computed(
    () =>
        requestData.value.name &&
        requestData.value.url &&
        requestData.value.httpMethod &&
        requestData.value.body &&
        requestData.value.headers
);

const addHeaderOpen = ref(false);
const keyRef = ref('');
const valRef = ref('');
const addHeader = () => {
    requestData.value.headers[keyRef.value] = valRef.value;
    addHeaderOpen.value = false;
};

const success = ref<boolean | undefined>(undefined);
const emit = defineEmits<{ close: [boolean] }>();
const connect = async () => {
    try {
        await $api('/v2/NotificationConnector', { method: 'PUT', body: requestData.value });
        await refreshNuxtData(FetchKeys.NotificationConnectors.All);
        emit('close', false);
        success.value = true;
    } catch {
        success.value = false;
        setTimeout(() => (success.value = undefined), 200);
    }
};
</script>
