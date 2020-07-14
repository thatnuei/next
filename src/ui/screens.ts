import preval from "preval.macro"

const screens = preval`
  const resolveConfig = require(process.cwd() + '/node_modules/tailwindcss/resolveConfig.js')
  const config = resolveConfig(require(process.cwd() + '/tailwind.config.js'))
  module.exports = config.theme.screens
`

export const screenQueries = {
  small: `(max-width: ${screens.md})`,
  medium: `(min-width: ${screens.md}) and (max-width: ${screens.lg})`,
  large: `(min-width: ${screens.lg})`,
}
