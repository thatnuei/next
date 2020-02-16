const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

module.exports = {
  babel: {
    presets: ["@emotion/css-prop"],
  },
  webpack: {
    configure(config, { env }) {
      if (env === "development") addReactRefresh(config)

      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          "react": "preact/compat",
          "react-dom": "preact/compat",
        },
      }

      return config
    },
  },
}

function addReactRefresh(config) {
  config.plugins.push(
    new ReactRefreshWebpackPlugin({ disableRefreshCheck: true }),
  )

  // the refresh babel plugin crashes the build if it transpiles node_modules,
  // presumably because libs from node_modules run before
  // the refresh helper functions actually get defined by the webpack plugin?
  //
  // either way, our workaround is to explicitly add it as a loader here,
  // skipping over node_modules completely
  config.module.rules.unshift({
    test: /\.(js|ts)x?$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve("babel-loader"),
      options: {
        babelrc: false,
        configFile: false,
        plugins: [require.resolve("react-refresh/babel")],
      },
    },
  })
}
