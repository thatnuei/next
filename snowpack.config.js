module.exports = {
  plugins: ["@snowpack/plugin-babel"],
  mount: {
    "src": "/src",
    "public": "/",
    "node_modules/tailwindcss/dist": "/node_modules/tailwindcss/dist",
  },
  exclude: ["**/*.test.@(ts|tsx)", "**/src/test/**/*", "**/src/setupTests.ts"],
  devOptions: {
    port: 3000,
    open: "none",
  },
}
