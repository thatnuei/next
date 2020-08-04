import { transformAsync, TransformOptions } from "@babel/core"
import type { Transform, UserConfig } from "vite"
import * as reactPlugin from "vite-plugin-react"

const babelTransform = (options: TransformOptions = {}): Transform => ({
  test: (ctx) => !ctx.path.includes("node_modules"),
  async transform({ code, path }) {
    const result = await transformAsync(code, {
      filename: path.replace("\u0000", ""),
      babelrc: false,
      configFile: false,
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
  minify: "esbuild", // terser breaks on things

  optimizeDeps: {
    include: [
      "lodash/fp",
      "micro-observables/batchingForReactDom",
      "hoist-non-react-statics",
    ],
  },

  alias: {
    "react": "preact/compat",
    "react-dom": "preact/compat",
  },

  transforms: [
    babelTransform({
      presets: [
        ["@babel/preset-env", { modules: false }],
        "@babel/preset-react",
        "@babel/preset-typescript",
        ["@emotion/babel-preset-css-prop", { autoLabel: "never" }], // autoLabel breaks css prop overrides
      ],
      plugins: [
        "@babel/plugin-proposal-class-properties",
        "babel-plugin-macros",
      ],
    }),
  ],
}

export default config
