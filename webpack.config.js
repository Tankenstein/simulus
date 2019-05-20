const { resolve } = require('path');
const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: resolve(__dirname, 'src', 'index.tsx'),
  output: {
    library: 'simulus',
    libraryTarget: 'umd',
    filename: 'main.js',
    path: resolve(__dirname, 'dist'),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'main.css',
      path: resolve(__dirname, 'dist'),
    }),
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
  module: {
    rules: [
      { test: /.(eot|woff|svg|png|woff2|ttf)$/, loader: 'file-loader' },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: { configFileName: resolve(__dirname, 'atlconfig.json') },
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
        ],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
  },
};
