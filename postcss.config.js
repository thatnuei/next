// @ts-check
const tailwind = require("tailwindcss")
const autoprefixer = require("autoprefixer")
const purgecss = require("@fullhuman/postcss-purgecss")
const postcssImport = require("postcss-import")

const isProduction = process.env.NODE_ENV === "production"

module.exports = {
  plugins: [
    postcssImport,
    tailwind,
    isProduction && autoprefixer(),
    // @ts-ignore
    isProduction && purgecss({ content: ["@(src|public)/**/*.@(ts|tsx)"] }),
  ].filter(Boolean),
}
