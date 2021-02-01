import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

export default defineConfig({
	esbuild: {
		jsxInject: `import { createElement as _createElement, Fragment as _Fragment } from 'react'`,
		jsxFactory: `_createElement`,
		jsxFragment: `_Fragment`,
	},
	plugins: [reactRefresh()],
})
