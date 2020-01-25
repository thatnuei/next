// @ts-check
const webpack = require("webpack")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require("path")

const isProduction = process.env.NODE_ENV === "production"
const isDevelopment = !isProduction

/** @type {import('webpack').Configuration} */
const config = {
  mode: isProduction ? "production" : "development",
  entry: "./src/index.tsx",
  output: {
    path: `${__dirname}/build`,
    filename: "[name].[hash].js",
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: "babel-loader",
        include: [path.join(__dirname, "src")],
      },
      {
        test: /\.css$/,
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(mp3|ogg)$/,
        use: {
          loader: "url-loader",
          options: { filename: "[name].[hash].[ext]", limit: 8192 },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      chunksSortMode: "dependency",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
    }),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{ from: "public" }]),
    isProduction && new OptimizeCSSAssetsPlugin(),
    isDevelopment &&
      new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }),
  ].filter(Boolean),
  devtool: isProduction ? "source-map" : "eval-source-map",
  stats: {
    children: false,
    entrypoints: false,
    modules: false,
    excludeAssets: /\.map$/,
  },
  performance: {
    hints: false,
  },
  optimization: {
    runtimeChunk: true,
  },
  devServer: {
    publicPath: "/",
    contentBase: `${__dirname}/public`,
  },
}

module.exports = config
