import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires

const tsCheckerWebpackPlugin = new ForkTsCheckerWebpackPlugin({
  logger: 'webpack-infrastructure',
});

export const rendererPlugins = [tsCheckerWebpackPlugin];

export const mainPlugins = [
  tsCheckerWebpackPlugin,
  new CopyPlugin({
    patterns: [{ from: 'src/main/ressources', to: 'ressources' }],
  }),
];
