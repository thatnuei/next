module.exports = {
  presets: ["@babel/env", "@babel/react", "@babel/typescript"],
  plugins: [
    ["@babel/proposal-decorators", { legacy: true }],
    ["@babel/proposal-class-properties", { loose: true }],
    "@babel/transform-runtime",
    "styled-components",
  ],
  env: {
    development: {
      plugins: ["react-refresh/babel"],
    },
    production: {
      plugins: ["lodash"],
    },
  },
}
