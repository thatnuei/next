#!node
// @ts-check
const webpack = require("webpack")
const WebpackDevServer = require("webpack-dev-server")
const { getDevConfig, getProdConfig } = require("./webpack.config")

const statsConfig = {
  modules: false,
  entrypoints: false,
  children: false,
  colors: true,
}

const commands = {
  build() {
    process.env.NODE_ENV = "production"
    process.env.BABEL_ENV = "production"

    webpack(getProdConfig(), (error, stats) => {
      if (error) {
        console.error(error)
        return
      }

      const output = stats.toString(statsConfig)

      console.info(output)
    })
  },

  dev() {
    process.env.NODE_ENV = "production"
    process.env.BABEL_ENV = "production"

    const compiler = webpack(getDevConfig())

    const server = new WebpackDevServer(compiler, {
      stats: statsConfig,
    })

    server.listen(3000, "0.0.0.0", (error) => {
      if (error) {
        console.error(error)
        return
      }
    })
  },

  test() {
    process.env.BABEL_ENV = "test"
    process.env.NODE_ENV = "test"

    const jest = require("jest")
    jest.run([
      "--config",
      require.resolve("./jest.config"),
      "--env",
      "jest-environment-jsdom-sixteen",
    ])
  },
}

const command = process.argv[2]
const runCommand = commands[command]

if (runCommand) {
  runCommand()
} else {
  console.error(`Unknown command "${command}"`)
  process.exit(1)
}
