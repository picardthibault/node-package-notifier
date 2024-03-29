import type { Configuration } from 'webpack';
import * as path from 'path';
import { rules } from './webpack.rules';
import { rendererPlugins } from './webpack.plugins';

rules.push({
  test: /\.s[ac]ss$/i,
  use: [
    { loader: 'style-loader' },
    { loader: 'css-loader' },
    { loader: 'sass-loader' },
  ],
});

export const rendererConfig: Configuration = {
  module: {
    rules,
  },
  plugins: rendererPlugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', 'ttf'],
    alias: {
      '@type': path.resolve(__dirname, 'src/types'),
      '@renderer/components': path.resolve(
        __dirname,
        'src/renderer/components',
      ),
      '@renderer/effects': path.resolve(__dirname, 'src/renderer/effects'),
      '@renderer/stores': path.resolve(__dirname, 'src/renderer/stores'),
      '@renderer/views': path.resolve(__dirname, 'src/renderer/views'),
    },
  },
};
