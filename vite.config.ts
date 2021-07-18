/// <reference types="vite/client" />
import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"
import windi from "vite-plugin-windicss"

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
})
