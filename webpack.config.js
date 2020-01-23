// @ts-check
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const isProduction = process.env.NODE_ENV === "production"
const isDevelopment = !isProduction

const cssExtractLoader = {
  loader: MiniCssExtractPlugin.loader,
  options: {
    hmr: isDevelopment,
  },
}

/** @type {import('webpack').Configuration} */
const config = {
  mode: isProduction ? "production" : "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [cssExtractLoader, "css-loader", "postcss-loader"],
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
  output: {
    path: `${__dirname}/build`,
    filename: "[name].[hash].js",
    publicPath: "/",
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
    isProduction && new OptimizeCSSAssetsPlugin(),
    isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  optimization: {
    runtimeChunk: true,
  },
  devServer: {
    publicPath: "/",
    contentBase: `${__dirname}/public`,
  },
}

module.exports = config
