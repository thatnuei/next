/// <reference types="vite/client" />
import reactRefresh from "@vitejs/plugin-react-refresh"
import { defineConfig } from "vite"

export default defineConfig({
	esbuild: {
		jsxInject: `import * as jsx$ from 'react'`,
		jsxFactory: `jsx$.createElement`,
		jsxFragment: `jsx$.Fragment`,
	},
	plugins: [reactRefresh()],
	build: {
		sourcemap: true,
	},
})
