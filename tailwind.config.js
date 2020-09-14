// @ts-check
const { rgb, shade } = require("polished")

// https://flatuicolors.com/palette/defo
const midnight = rgb(38, 65, 94)

module.exports = {
	theme: {
		extend: {
			colors: {
				midnight: {
					0: midnight,
					1: shade(0.3, midnight),
					2: shade(0.5, midnight),
				},
			},
		},
		fontFamily: {
			body: `'Fira Sans', sans-serif`,
			header: `'Fira Sans Condensed', sans-serif`,
		},
		boxShadow: {
			default: `0 4px 10px rgba(0, 0, 0, 0.3)`,
			inner: `0 0 3px rgba(0, 0, 0, 0.3) inset`,
		},
	},
	variants: {},
	plugins: [],
	purge: ["./src/**/*.{ts,tsx,html}"],
	future: {
		removeDeprecatedGapUtilities: true,
		purgeLayersByDefault: true,
	},
	experimental: {
		applyComplexClasses: true,
	},
}
