const { whenProd } = require("@craco/craco")

const purgecss = require("@fullhuman/postcss-purgecss")({
  content: ["./@(src|public)/**/*.@(ts|tsx|html|css)"],
})

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), ...whenProd(() => [purgecss], [])],
    },
  },
}
