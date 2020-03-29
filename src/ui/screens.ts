import preval from "preval.macro"

const tailwindConfig = preval`
  const resolveConfig = require('tailwindcss/resolveConfig')
  module.exports = resolveConfig(require('../../tailwind.config'))
`

export const screenQueries = {
  small: `(max-width: ${tailwindConfig.theme.screens.md})`,
  medium: `(min-width: ${tailwindConfig.theme.screens.md}) and (max-width: ${tailwindConfig.theme.screens.lg})`,
  large: `(min-width: ${tailwindConfig.theme.screens.lg})`,
}
