module.exports = {
  mode: "jit",
  purge: ["index.html", "src/**/*.{ts,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    boxShadow: {
      DEFAULT: "0px 2px 8px rgba(0, 0, 0, 0.4)",
      normal: "0px 2px 12px rgba(0, 0, 0, 0.3)",
      inner: "0px 1px 4px rgba(0, 0, 0, 0.2) inset",
    },
    extend: {
      colors: {
        // https://flatuicolors.com/palette/defo
        midnight: {
          0: `hsl(211, 42%, 26%)`,
          1: `hsl(211, 42%, 18%)`,
          2: `hsl(211, 42%, 9%)`,
        },
        clouds: `rgb(236, 240, 241)`,
      },
      transitionDuration: {
        DEFAULT: "250ms",
      },
      fontFamily: {
        sans: `'Fira Sans', sans-serif`,
        condensed: `'Fira Sans Condensed', sans-serif`,
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
}
