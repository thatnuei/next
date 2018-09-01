// @ts-check
const { join } = require("path")
const HtmlPlugin = require("html-webpack-plugin")
const CleanPlugin = require("clean-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin")

const rootFolder = __dirname
const sourceFolder = join(rootFolder, "src")
const buildFolder = join(rootFolder, "build")
const publicFolder = join(rootFolder, "public")

/** @type {import('webpack').Configuration} */
const config = {
  context: rootFolder,
  entry: join(sourceFolder, "index"),
  output: {
    path: buildFolder,
    filename: "[name].[hash].js",
    publicPath: "/",
  },
  module: {
    rules: [{ test: /\.tsx?$/, use: "babel-loader", include: [sourceFolder] }],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    mainFields: ["module", "jsnext:main", "main"],
  },
  // @ts-ignore
  plugins: [
    new HtmlPlugin({
      template: join(sourceFolder, "index.html"),
    }),
    new CleanPlugin(buildFolder, { verbose: false }),
    new CopyPlugin([{ from: publicFolder, to: buildFolder }]),
    new ForkTsCheckerWebpackPlugin({
      silent: true,
    }),
  ],
  mode: "development",
}

module.exports = config
