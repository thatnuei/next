import { css, Global } from "@emotion/core"
import React from "react"
import { AppTheme } from "./theme"

const reset = (theme: AppTheme) => css`
  * {
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }

  :root {
    background-color: ${theme.colors.background2};
    color: ${theme.colors.text};
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
    text-align: left;
    border: none;

    /* weird edge(?) bug: if we set this to 0, the border still shows up on select */
    border-radius: 0.0000001px;
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
