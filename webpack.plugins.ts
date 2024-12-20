import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const tsCheckerWebpackPlugin = new ForkTsCheckerWebpackPlugin({
  logger: 'webpack-infrastructure',
});

export const rendererPlugins = [
  tsCheckerWebpackPlugin,
  new MiniCssExtractPlugin({
    filename: 'css/[name].css',
    chunkFilename: 'css/[name].css',
  }),
];

export const mainPlugins = [
  tsCheckerWebpackPlugin,
  new CopyPlugin({
    patterns: [{ from: 'src/main/ressources', to: 'ressources' }],
  }),
];
