/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transform: {
    "\\.(js|ts)x?$": "@sucrase/jest-plugin",
  },
  moduleNameMapper: {
    // jest can't transform es modules
    "lodash-es": "lodash",
  },
}
