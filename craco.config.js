const { whenDev, whenProd } = require("@craco/craco")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

module.exports = {
  babel: {
    presets: ["@emotion/css-prop"],
    plugins: [
      ["@babel/proposal-decorators", { legacy: true }],
      ["@babel/proposal-class-properties", { loose: true }],
      ...whenProd(() => ["lodash"], []),
      ...whenDev(() => ["react-refresh/babel"], []),
    ],
  },
  webpack: {
    plugins: [...whenDev(() => [new ReactRefreshWebpackPlugin()], [])],
  },
}
