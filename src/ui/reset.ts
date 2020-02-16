import { css } from "@emotion/react"
import { themeBgColor, themeTextColor } from "./style"
import { AppTheme } from "./theme"

export const reset = (theme: AppTheme) => css`
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

  strong {
    font-weight: 500;
  }

  img,
  svg {
    display: block;
  }
`
