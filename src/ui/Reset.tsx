import { css, Global } from "@emotion/react"
import React from "react"
import { themeBgColor, themeTextColor } from "./style"
import { AppTheme } from "./theme"

const reset = (theme: AppTheme) => css`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  :root {
    ${themeBgColor(2)(theme)};
    ${themeTextColor(theme)};
    font: 15px Roboto, sans-serif;
    line-height: 1.5;
    word-break: break-word;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  button,
  input,
  textarea,
  select {
    background: none;
    color: inherit;
    font: inherit;
    border: none;
    text-align: left;
    border-radius: 0;
  }

  button {
    cursor: pointer;
  }

  a {
    font: inherit;
    color: inherit;
    text-decoration: none;
  }

  fieldset {
    border: none;
  }

  ol,
  ul,
  li {
    list-style: none;
  }

  img,
  svg {
    display: block;
  }
`

export default function Reset() {
  return <Global styles={reset} />
}
