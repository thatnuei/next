// @ts-check
const tailwind = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const purgecss = require("@fullhuman/postcss-purgecss")
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin")

module.exports = ({ env }) => {
  const config = {
    style: {
      postcss: {
        plugins: [tailwind()],
      },
    },
    babel: {
      plugins: ["lodash", "styled-components"],
    },
    webpack: {
      plugins: [],
    },
  }

  if (env === "development") {
    config.webpack.plugins.push(new ReactRefreshWebpackPlugin())
    config.babel.plugins.push("react-refresh/babel")
  }

  if (env === "production") {
    config.style.postcss.plugins.push(
      autoprefixer(),
      purgecss({
        content: ["@(src|public)/**/*.@(ts|tsx)"],
      }),
    )
  }

  return config
}
