import babel from "@babel/core"
import { Transform, UserConfig } from "vite"
import reactPlugin from "vite-plugin-react"

const babelTransform: Transform = {
  test: (file) => /tsx?$/.test(file.path),

  async transform({ code, path }) {
    const result = babel.transformSync(code, {
      filename: path,
    })
    if (result.code) {
      return { code: result.code, map: result.map }
    }
    return code
  },
}

const config: UserConfig = {
  jsx: "react",
  plugins: [reactPlugin],
  outDir: "build",
  enableEsbuild: true,
  transforms: [babelTransform],
  port: 8080,
  optimizeDeps: {
    include: ["fuzzysearch", "mobx-react-lite/batchingForReactDom"],
  },
}

export default config
