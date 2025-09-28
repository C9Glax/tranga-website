import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    vite: { plugins: [tailwindcss()] },
    css: ['~/assets/css/main.css'],
    modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', '@nuxt/ui', 'nuxt-api-party'],
    devServer: { host: '127.0.0.1' },
    runtimeConfig: {
        apiParty: {
            endpoints: {
                api: {
                    url: 'http://127.0.0.1:6531',
                    schema: 'https://raw.githubusercontent.com/C9Glax/tranga/refs/heads/testing/API/openapi/API_v2.json',
                },
            },
        },
    },
});
