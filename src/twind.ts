import { rgba, shade } from "polished"
import { setup } from "twind"
import { css } from "twind/css"
import * as colors from "./ui/colors"
import { clouds, midnight } from "./ui/colors"

setup({
	theme: {
		fontFamily: {
			sans: `'Fira Sans', sans-serif`,
			condensed: `'Fira Sans Condensed', sans-serif`,
		},
		fontWeight: {
			"weight-light": "300",
			"weight-normal": "400",
			"weight-bold": "500",
		},
		colors: {
			"background-0": `var(--color-background-0)`,
			"background-1": `var(--color-background-1)`,
			"background-2": `var(--color-background-2)`,
			"text": `var(--color-text)`,

			"white": colors.clouds,
			"black": colors.midnight,
			"black-faded": rgba(0, 0, 0, 0.5),

			"red": colors.tomato,
			"red-faded": rgba(colors.tomato, 0.2),
			"green": colors.emerald,
			"green-faded": rgba(colors.emerald, 0.2),
			"blue": colors.river,
			"blue-faded": rgba(colors.river, 0.2),
			"yellow": colors.sunflower,
			"yellow-faded": rgba(colors.sunflower, 0.2),
			"orange": colors.carrot,
			"orange-faded": rgba(colors.carrot, 0.2),
		},
		boxShadow: {
			normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
			inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
		},
		spacing: {
			0: "0",
			1: "4px",
			2: "8px",
			3: "12px",
			4: "16px",
			5: "24px",
			6: "32px",
			8: "40px",
			10: "48px",
			12: "56px",
			16: "64px",
			20: "80px",
			24: "96px",
			32: "128px",
			40: "160px",
			48: "192px",
			56: "224px",
			64: "256px",
			px: "1px",
			px2: "2px",
			gap: "4px", // represents the separating gap between sections of some layouts
		},

		// TODO: change these names because they're not good
		fontSize: {
			"sm": "13px",
			"base": "16px",
			"xl": "20px",
			"2xl": "24px",
		},
	},
	preflight: (preflight, { theme }) =>
		css(preflight, {
			":root": {
				"color": theme("colors.text"),
				"background": theme("colors.background-2"),
				"wordBreak": "break-word",
				"letterSpacing": "0.1px",
				"--color-background-0": midnight,
				"--color-background-1": shade(0.3, midnight),
				"--color-background-2": shade(0.5, midnight),
				"--color-text": clouds,
			},
			"button, input, textarea, select": {
				textAlign: "left",
				borderRadius: 0,
				letterSpacing: "inherit",
			},
			".js-focus-visible :focus:not(.focus-visible)": {
				outline: "none",
			},
			".js-focus-visible :focus:not([data-focus-visible-added])": {
				outline: "none",
			},
		}),
})
