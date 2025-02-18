import { defineConfig } from 'vite';
import * as path from 'path';

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: [
      { find: '@type', replacement: path.resolve(__dirname, 'src/types') },
      {
        find: '@renderer/components',
        replacement: path.resolve(__dirname, 'src/renderer/components'),
      },
      {
        find: '@renderer/effects',
        replacement: path.resolve(__dirname, 'src/renderer/effects'),
      },
      {
        find: '@renderer/stores',
        replacement: path.resolve(__dirname, 'src/renderer/stores'),
      },
      {
        find: '@renderer/views',
        replacement: path.resolve(__dirname, 'src/renderer/views'),
      },
    ],
  },
});
