module.exports = {
  extends: "@snowpack/app-scripts-react",
  exclude: ["**/*.test.@(ts|tsx)", "**/src/test/**/*"],
  devOptions: {
    port: 3000,
    open: "none",
  },
}
