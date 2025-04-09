import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        react(), // Add React plugin
        tailwindcss({
            darkMode: 'class',
            safelist: [
                'bg-white', 'dark:bg-gray-900',
                'bg-gray-100', 'dark:bg-gray-800',
                // Add all your dynamic classes here
            ],
            theme: {
                extend: {}
            }
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'resources/js'),
        },
    },
});
