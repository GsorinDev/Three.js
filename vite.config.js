import { defineConfig } from 'vite';

export default defineConfig({
    root: 'public',
    server: {
        port: 3030,
    },
    preview: {
        port: 8080
    }
});