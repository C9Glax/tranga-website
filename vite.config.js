// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
    server: {
        port: '8080'
    },
    root: 'Website',
    assetsInclude: ['**/media/*']
})