// @ts-check
const { join } = require("path")
const CompressionPlugin = require("compression-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const merge = require("webpack-merge")

const root = __dirname
const sourcePath = join(root, "src")
const entryPath = join(sourcePath, "index")
const outputPath = join(root, "build")
const publicPath = join(root, "public")
const htmlTemplatePath = join(publicPath, "index.html")

/** @type {import('webpack').Configuration} */
const baseConfig = {
  entry: entryPath,
  output: {
    path: outputPath,
    filename: "static/js/[name].[contenthash:8].js",
  },
  module: {
    rules: [
      { test: /\.(js|ts)x?$/, use: "babel-loader", include: [sourcePath] },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: htmlTemplatePath,
    }),
    new CopyWebpackPlugin([{ from: publicPath }]),
    new CleanWebpackPlugin(),
  ],
  stats: {
    modules: false,
    entrypoints: false,
    children: false,
  },
}

/** @type {import('webpack').Configuration} */
const devConfig = {
  mode: "development",
  module: {
    rules: [{ test: /\.css$/, use: ["style-loader", "css-loader"] }],
  },
}

/** @type {import('webpack').Configuration} */
const prodConfig = {
  mode: "production",
  module: {
    rules: [
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
    ],
  },
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom": "preact/compat",
    },
  },
  plugins: [
    new CompressionPlugin(),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
      name: false,
    },
    runtimeChunk: {
      name: (entrypoint) => `runtime-${entrypoint.name}`,
    },
  },
}

module.exports =
  process.env.NODE_ENV === "production"
    ? merge(baseConfig, prodConfig)
    : merge(baseConfig, devConfig)
