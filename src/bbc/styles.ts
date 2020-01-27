import { css } from "../ui/styled"

const colors: { [color in string]?: string } = {
  white: "rgb(236, 240, 241)",
  black: "rgb(52, 73, 94)",
  red: "rgb(236, 93, 93)",
  blue: "rgb(52, 152, 219)",
  yellow: "rgb(241, 196, 15)",
  green: "rgb(46, 204, 113)",
  pink: "rgb(255,164,156)",
  gray: "rgb(149, 165, 166)",
  orange: "rgb(230, 126, 34)",
  purple: "rgb(201,135,228)",
  brown: "rgb(211, 84, 0)",
  cyan: "rgb(85, 175, 236)",
}

export const bbcColor = (name: string) =>
  css({ color: colors[name] ?? "inherit" })

export const linkIcon = css({
  "display": "inline",
  "marginRight": 2,
  "> svg": {
    verticalAlign: "text-bottom",
  },
})
