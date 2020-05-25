const { whenDev, whenProd } = require("@craco/craco")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

// TODO: make these plugins so this doesn't look as terrifying
module.exports = {
  plugins: [
    emotionCssPropPlugin(),
    ...whenDev(() => [reactRefreshPlugin()], []),
    ...whenProd(() => [preactAliasPlugin()], []),
  ],
}

function emotionCssPropPlugin() {
  return {
    plugin: {
      overrideCracoConfig({ cracoConfig }) {
        cracoConfig.babel = cracoConfig.babel || {}
        cracoConfig.babel.presets = cracoConfig.babel.presets || []
        cracoConfig.babel.presets.push([
          "@emotion/css-prop",
          // autoLabel breaks css prop overrides
          { autoLabel: "never" },
        ])
        return cracoConfig
      },
    },
  }
}

function reactRefreshPlugin() {
  return {
    plugin: {
      overrideWebpackConfig({ webpackConfig }) {
        webpackConfig.plugins.push(new ReactRefreshWebpackPlugin())

        // the refresh babel plugin crashes the build if it transpiles node_modules,
        // presumably because libs from node_modules run before
        // the refresh helper functions actually get defined by the webpack plugin?
        //
        // either way, our workaround is to explicitly add it as a loader here,
        // skipping over node_modules completely
        webpackConfig.module.rules.unshift({
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

        return webpackConfig
      },
    },
  }
}

function preactAliasPlugin() {
  return {
    plugin: {
      overrideWebpackConfig({ webpackConfig }) {
        webpackConfig.resolve = {
          ...webpackConfig.resolve,
          alias: {
            ...webpackConfig.resolve.alias,
            "react": "preact/compat",
            "react-dom": "preact/compat",
          },
        }
        return webpackConfig
      },
    },
  }
}
