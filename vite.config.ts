import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig, Plugin } from "vite"
import macros from "vite-plugin-babel-macros"

export default defineConfig({
	esbuild: {
		jsxInject: `import { createElement as _createElement, Fragment as _Fragment } from 'react'`,
		jsxFactory: `_createElement`,
		jsxFragment: `_Fragment`,
	},
	plugins: [
		reactRefresh(),
		inject({ prefix: `import "@twind/macro";` }),
		macros(),
	],
	build: {
		sourcemap: true,
	},
})

function inject(options: { prefix?: string; postfix?: string }): Plugin {
	return {
		name: "inject",
		enforce: "pre",
		transform(source, filename) {
			if (/\.(j|t)sx?$/i.test(filename) && !filename.includes("node_modules")) {
				return `${options.prefix ?? ""}${source}${options.postfix ?? ""}`
			}
		},
	}
}
