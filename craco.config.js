// @ts-check
const tailwind = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const purgecss = require("@fullhuman/postcss-purgecss")

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
