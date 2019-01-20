// @ts-check
const webpack = require("webpack")
const { join } = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const CleanPlugin = require("clean-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const merge = require("webpack-merge")

const rootFolder = __dirname
const sourceFolder = join(rootFolder, "src")
const buildFolder = join(rootFolder, "build")
const publicFolder = join(rootFolder, "public")

/** @type {webpack.Configuration} */
const baseConfig = {
  context: rootFolder,
  entry: join(sourceFolder, "index"),
  output: {
    path: buildFolder,
    publicPath: "/",
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "babel-loader", include: [sourceFolder] }],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    mainFields: ["module", "jsnext:main", "main"],
  },
  plugins: [
    new HtmlPlugin({
      template: join(sourceFolder, "index.html"),
    }),
    new CleanPlugin(buildFolder, { verbose: false }),
    new CopyPlugin([{ from: publicFolder, to: buildFolder }]),
    new ForkTsCheckerWebpackPlugin(),
  ],
  devServer: {
    stats: "errors-only",
    historyApiFallback: true,
  },
  stats: {
    modules: false,
    entrypoints: false,
    children: false,
    excludeAssets: (assetName) => /\.map$/.test(assetName),
  },
}

/** @type {webpack.Configuration} */
const devConfig = {
  mode: "development",
  devtool: "eval-source-map",
  performance: {
    maxAssetSize: Infinity,
  },
}

/** @type {webpack.Configuration} */
const prodConfig = {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "[name].[contenthash].js",
  },
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
  plugins: [new webpack.HashedModuleIdsPlugin()],
}

module.exports =
  process.env.NODE_ENV === "production"
    ? merge(baseConfig, prodConfig)
    : merge(baseConfig, devConfig)
