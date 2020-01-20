// @ts-check
const tailwind = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const purgecss = require("@fullhuman/postcss-purgecss")

const config = {
  plugins: [tailwind()],
}

if (process.env.NODE_ENV === "production") {
  config.plugins.push(
    autoprefixer(),
    // @ts-ignore
    purgecss({
      content: ["@(src|public)/**/*.@(ts|tsx)"],
    }),
  )
}

module.exports = config
