import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    devtools: { enabled: true },
    vite: { plugins: [tailwindcss()] },
    css: ['~/assets/css/main.css'],
    modules: ['@nuxt/content', '@nuxt/eslint', '@nuxt/image', '@nuxt/ui', 'nuxt-open-fetch'],
    devServer: { host: '127.0.0.1' },
    openFetch: {
        openAPITS: { exportType: false, enum: true, alphabetize: true },
        clients: {
            api: { schema: 'http://127.0.0.1:6531/swagger/v2/swagger.json', baseURL: 'http://127.0.0.1:6531/' },
        },
    },
});
