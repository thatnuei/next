/// <reference types="vite/client" />
import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"
import windi from "vite-plugin-windicss"
import pkg from "./package.json"

export default defineConfig({
	esbuild: {
		jsxInject: `import * as jsx$ from 'react'`,
		jsxFactory: `jsx$.createElement`,
		jsxFragment: `jsx$.Fragment`,
	},
	plugins: [reactRefresh(), windi()],
	build: {
		sourcemap: true,
	},
	define: {
		APP_NAME: `"${pkg.name}"`,
		APP_VERSION: `"${pkg.version}"`,
	},
})

declare global {
	const APP_NAME: string
	const APP_VERSION: string
}
