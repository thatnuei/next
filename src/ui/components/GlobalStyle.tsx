import { Global } from "@emotion/core"
import { lighten } from "polished"
import React from "react"
import { css } from "../styled"
import { AppTheme } from "../theme"

const globalStyle = (theme: AppTheme) => css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    font: 15px Roboto, sans-serif;
    background-color: ${theme.colors.theme2};
    color: ${theme.colors.text};
    line-height: 1.5;
    letter-spacing: 0.3px;

    word-break: break-word;
    overflow-wrap: break-word;

    overflow: hidden;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: "Roboto Condensed", sans-serif;
    font-weight: 300;
    line-height: 1.2;
  }

  button,
  input,
  textarea,
  select {
    background: transparent;
    font: inherit;
    color: inherit;
    text-align: left;
    border: 0;
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

  strong {
    font-weight: 500;
  }

  ul,
  li {
    list-style: none;
  }

  img,
  svg {
    vertical-align: top;
  }

  fieldset {
    border: none;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background-color: ${theme.colors.theme2};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${lighten(0.2, theme.colors.theme0)};
  }

  /* see https://github.com/WICG/focus-visible */
  .js-focus-visible :focus:not(.focus-visible),
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: none;
  }
`

function GlobalStyle() {
  return <Global<AppTheme> styles={globalStyle} />
}

export default GlobalStyle
