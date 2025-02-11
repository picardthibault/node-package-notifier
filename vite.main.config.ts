import { defineConfig } from 'vite';
import * as path from 'path';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        sourcemap: true,
        assetsInlineLimit: 0,
    },
    resolve: {
        alias: [
            { find: '@type', replacement: path.resolve(__dirname, 'src/types') },
            { find: '@main/caches', replacement: path.resolve(__dirname, 'src/main/caches') },
            { find: '@main/helpers', replacement: path.resolve(__dirname, 'src/main/helpers') },
            { find: '@main/services', replacement: path.resolve(__dirname, 'src/main/services') },
            { find: '@main/store', replacement: path.resolve(__dirname, 'src/main/store') },
        ],
    },
});