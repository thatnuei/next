const path = require("path")

module.exports = {
  roots: [process.cwd()],
  testMatch: ["**/*.test.(j|t)s?(x)"],
  moduleFileExtensions: ["js", "json", "jsx", "node", "ts", "tsx"],
  transform: {
    "^.+\\.tsx?$": ["babel-jest", require("./babel.config")],
  },
  setupFilesAfterEnv: [path.join(process.cwd(), "src/setupTests.ts")],
}
