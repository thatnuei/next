import { transformAsync, TransformOptions } from "@babel/core"
import type { Transform, UserConfig } from "vite"
import * as reactPlugin from "vite-plugin-react"

const babelTransform = (options: TransformOptions = {}): Transform => ({
  test: (ctx) => !ctx.path.includes("node_modules"),
  async transform({ code, path }) {
    const result = await transformAsync(code, {
      filename: path.replace("\u0000", ""),
      ...options,
    })

    if (result && result.code) {
      return { code: result.code, map: result.map || undefined }
    }

    return code
  },
})

const config: UserConfig = {
  enableEsbuild: false,
  plugins: [reactPlugin],
  outDir: "build",

  optimizeDeps: {
    include: [
      "micro-observables/batchingForReactDom",
      "hoist-non-react-statics",
    ],
  },

  transforms: [babelTransform()],
}

export default config
