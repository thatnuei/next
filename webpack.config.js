// @ts-check
const webpack = require("webpack")
const { join } = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")
const WebpackPwaManifest = require("webpack-pwa-manifest")
const merge = require("webpack-merge")
const { rgb } = require("polished")

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
    rules: [
      { test: /\.tsx?$/, use: "babel-loader", include: [sourceFolder] },
      {
        test: /\.(png|jpg|ttf|woff|woff2|mp3|ogg|wav)$/,
        use: { loader: "url-loader", options: { name: "[name].[hash].ext" } },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    mainFields: ["module", "jsnext:main", "main"],
    symlinks: false,
  },
  plugins: [
    new HtmlPlugin({
      template: join(sourceFolder, "index.html"),
      meta: [
        {
          "http-equiv": "Content-Security-Policy",
          content: `
            default-src 'self' 'unsafe-inline'
            ${process.env.NODE_ENV === "production" ? "" : "'unsafe-eval'"}
            data:
            https://fonts.googleapis.com
            https://fonts.gstatic.com
            https://www.f-list.net
            https://static.f-list.net
            wss://chat.f-list.net
          `,
        },
      ],
    }),
    new WebpackPwaManifest({
      short_name: "next",
      name: "next",
      icons: [
        {
          src: join(rootFolder, "public/favicon.ico"),
          sizes: [64, 32, 24, 16],
        },
      ],
      start_url: "/index.html",
      display: "standalone",
      theme_color: rgb(60, 60, 60),
      background_color: rgb(30, 30, 30),
      inject: true,
    }),
    new CleanWebpackPlugin(),
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
}

const sizeLimit = 500 * 1000 // 500KB

/** @type {webpack.Configuration} */
const prodConfig = {
  mode: "production",
  devtool: "source-map",
  output: {
    filename: "js/[name].[contenthash].js",
  },
  plugins: [new webpack.HashedModuleIdsPlugin()],
  optimization: {
    runtimeChunk: "single",
  },
  performance: {
    maxAssetSize: sizeLimit,
    maxEntrypointSize: sizeLimit,
  },
}

/** @type {webpack.Configuration} */
const electronConfig = {
  target: "electron-renderer",
  output: {
    publicPath: ".",
  },
}

function getConfig(env) {
  return process.env.NODE_ENV === "production"
    ? merge(baseConfig, prodConfig, env.electron ? electronConfig : {})
    : merge(baseConfig, devConfig)
}

module.exports = getConfig
