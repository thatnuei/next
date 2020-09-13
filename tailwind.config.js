// @ts-check
const { rgb, rgba, shade } = require("polished")

// https://flatuicolors.com/palette/defo
const midnight = rgb(38, 65, 94)
const clouds = rgb(236, 240, 241)
const emerald = rgb(46, 204, 113)
const tomato = rgb(231, 76, 60)
const sunflower = rgb(241, 196, 15)
const carrot = rgb(230, 126, 34)
const river = rgb(52, 152, 219)

module.exports = {
	theme: {
		fontFamily: {
			body: `'Fira Sans', sans-serif`,
			header: `'Fira Sans Condensed', sans-serif`,
		},
		colors: {
			"midnight-0": midnight,
			"midnight-1": shade(0.3, midnight),
			"midnight-2": shade(0.5, midnight),

			white: clouds,
			black: midnight,
			"black-faded": rgba(0, 0, 0, 0.5),

			red: tomato,
			"red-faded": rgba(tomato, 0.2),
			green: emerald,
			"green-faded": rgba(emerald, 0.2),
			blue: river,
			"blue-faded": rgba(river, 0.2),
			yellow: sunflower,
			"yellow-faded": rgba(sunflower, 0.2),
			orange: carrot,
			"orange-faded": rgba(carrot, 0.2),
		},
		boxShadow: {
			default: `0 4px 10px rgba(0, 0, 0, 0.3)`,
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
