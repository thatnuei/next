const pkg = require("./package.json")

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  moduleNameMapper: {
    "lodash-es": "lodash",
  },
  globals: {
    APP_NAME: pkg.name,
    APP_VERSION: pkg.version,
  },
}
