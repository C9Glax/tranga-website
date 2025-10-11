import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    css: ['~/assets/css/main.css'],
    modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', '@nuxt/ui', 'nuxt-open-fetch'],
    devServer: { host: '127.0.0.1' },
    openFetch: {
        clients: {
            api: {
                baseURL: '/api/',
                schema: 'https://raw.githubusercontent.com/C9Glax/tranga/refs/heads/testing/API/openapi/API_v2.json',
            },
        },
    },
    vite: { plugins: [tailwindcss()] },
    nitro: { prerender: { failOnError: false } },
});
