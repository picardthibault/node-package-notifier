import type { Configuration } from 'webpack';
import * as path from 'path';
import { rules } from './webpack.rules';
import { mainPlugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',
  // Put your normal webpack config below here
  module: {
    rules,
  },
  plugins: mainPlugins,
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    alias: {
      '@type': path.resolve(__dirname, 'src/types'),
      '@main/caches': path.resolve(__dirname, 'src/main/caches'),
      '@main/helpers': path.resolve(__dirname, 'src/main/helpers'),
      '@main/services': path.resolve(__dirname, 'src/main/services'),
      '@main/store': path.resolve(__dirname, 'src/main/store'),
    },
  },
};
