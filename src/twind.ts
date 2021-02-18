import { setup } from "twind"
import { css } from "twind/css"

setup({
	theme: {
		extend: {
			colors: {
				// https://flatuicolors.com/palette/defo
				midnight: {
					0: `hsl(211, 42%, 26%)`,
					1: `hsl(211, 42%, 18%)`,
					2: `hsl(211, 42%, 9%)`,
				},
				clouds: `rgb(236, 240, 241)`,
			},
			transitionDuration: {
				DEFAULT: "250ms",
			},
			fontFamily: {
				sans: `'Fira Sans', sans-serif`,
				condensed: `'Fira Sans Condensed', sans-serif`,
			},
			boxShadow: {
				DEFAULT: "0px 2px 12px rgba(0, 0, 0, 0.5)",
				normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
				inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
			},
		},
	},
	preflight: (preflight, { theme }) =>
		css(preflight, {
			"body": {
				color: theme("colors.clouds"),
				background: theme("colors.midnight.2"),
				wordBreak: "break-word",
				letterSpacing: "0.1px",
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
