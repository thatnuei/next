/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
}
