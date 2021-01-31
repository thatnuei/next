import preval from "preval.macro"

const screens = preval`
  const resolveConfig = require('tailwindcss/resolveConfig')
  const config = resolveConfig(require('../../tailwind.config'))
  module.exports = config.theme.screens
` as Record<string, string>

export const screenQueries = {
	small: `(max-width: ${screens.md})`,
	medium: `(min-width: ${screens.md}) and (max-width: ${screens.lg})`,
	large: `(min-width: ${screens.lg})`,
}
