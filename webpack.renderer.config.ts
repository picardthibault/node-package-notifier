import type { Configuration } from 'webpack';
import * as path from 'path';
import { rules } from './webpack.rules';
import { rendererPlugins } from './webpack.plugins';
import { loader as miniCssLoader } from 'mini-css-extract-plugin';

const getStyleLoaderPlugin = () => {
  if (process.env.ENVIRONMENT !== undefined && process.env.ENVIRONMENT === 'DEV') {
    return { 
      loader: 'style-loader',
      options: {
        attributes: {
          nonce: "devOnly"
        }
      }
    };
  }
  return { loader: miniCssLoader };
}

rules.push({
  test: /\.s[ac]ss$/i,
  use: [
    getStyleLoaderPlugin(),
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
  devtool: 'source-map'
};
