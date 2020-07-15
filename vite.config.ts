import babel from "@babel/core"
import { Transform, UserConfig } from "vite"
import reactPlugin from "vite-plugin-react"

const babelTransform: Transform = {
  test: (file) => /tsx?$/.test(file.path),

  transform({ code, path }) {
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
  plugins: [reactPlugin],
  outDir: "build",
  enableEsbuild: false,
  transforms: [babelTransform],
  port: 8080,
  optimizeDeps: {
    include: ["fuzzysearch"],
  },
}

export default config
