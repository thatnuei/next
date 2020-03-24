import preval from "preval.macro"
import resolveConfig from "tailwindcss/resolveConfig"

const tailwindConfig = preval`
  module.exports = require('../../tailwind.config')
`

const fullConfig = resolveConfig(tailwindConfig)

export const screenQueries = {
  small: `(max-width: ${fullConfig.theme.screens.md})`,
  medium: `(min-width: ${fullConfig.theme.screens.md}) and (max-width: ${fullConfig.theme.screens.lg})`,
  large: `(min-width: ${fullConfig.theme.screens.lg})`,
}
