// @ts-check
const webpack = require("webpack")
const config = require("../webpack.config")
const {
  measureFileSizesBeforeBuild,
  printFileSizesAfterBuild,
} = require("react-dev-utils/FileSizeReporter")
const { promisify } = require("util")
const { join } = require("path")
const chalk = require("chalk")

const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024

const buildFolder = join(__dirname, "../build")

async function main() {
  const sizes = await measureFileSizesBeforeBuild(buildFolder)
  // @ts-ignore
  const stats = await promisify(webpack)(config)
  const timeSeconds = (stats.endTime - stats.startTime) / 1000

  console.log()

  if (stats.warnings && stats.warnings.length > 0) {
    console.log(chalk.yellow("Compiled with warnings.\n"))
    console.log(stats.warnings.join("\n\n"))
  } else {
    console.log(chalk.green("Compiled successfully.\n"))
  }

  console.log("File sizes after gzip:\n")
  printFileSizesAfterBuild(
    stats,
    sizes,
    buildFolder,
    WARN_AFTER_BUNDLE_GZIP_SIZE,
    WARN_AFTER_CHUNK_GZIP_SIZE,
  )

  console.log(`\nCompile time: ${timeSeconds}s\n`)
}

main().catch(console.error)
