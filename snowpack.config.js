module.exports = {
  plugins: ["@snowpack/plugin-babel"],
  scripts: {
    "mount:web_modules": "mount $WEB_MODULES --to /web_modules",
    "mount:src": "mount src",
    "mount:public": "mount public --to /",
    "mount:tailwind": "mount node_modules/tailwindcss/dist",
    "build:.ts,.tsx": "@snowpack/plugin-babel",
  },
  exclude: ["**/*.test.@(ts|tsx)", "**/src/test/**/*", "**/src/setupTests.ts"],
  devOptions: {
    port: 3000,
    open: "none",
  },
}
