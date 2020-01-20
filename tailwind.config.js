module.exports = {
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      condensed: ['"Roboto Condensed"', "sans-serif"],
    },
    boxShadow: {
      default: "0px 2px 6px rgba(0, 0, 0, 0.5)",
      inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
      none: "none",
    },
    extend: {
      colors: {
        midnight: {
          100: "hsl(212, 42%, 85%)",
          200: "hsl(211, 42%, 75%)",
          300: "hsl(212, 43%, 65%)",
          400: "hsl(211, 42%, 55%)",
          500: "hsl(211, 42%, 45%)",
          600: "hsl(211, 43%, 35%)",
          700: "hsl(211, 42%, 25%)",
          800: "hsl(210, 42%, 18%)",
          900: "hsl(207, 44%, 13%)",
        },
        semiblack: {
          25: "rgba(0, 0, 0, 0.25)",
          50: "rgba(0, 0, 0, 0.50)",
          75: "rgba(0, 0, 0, 0.75)",
        },
      },
    },
  },
  variants: {},
  plugins: [],
}
