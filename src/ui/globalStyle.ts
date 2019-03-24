import { lighten, shade } from "polished"
import { createGlobalStyle } from "styled-components"
import { textColor, themeBackgroundColor, themeColor } from "./colors"
import { css } from "./styled"

const globalStyle = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    background-color: ${themeBackgroundColor};

    font: 16px Roboto, sans-serif;
    color: ${textColor};
    line-height: 1.5;
    letter-spacing: 0.3px;

    word-break: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
  }

  :focus {
    outline: none;
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

  button {
    background: transparent;
    margin: 0;
    padding: 0;
    font: inherit;
    color: inherit;
    border: none;
    text-align: left;
  }

  a {
    font: inherit;
    color: inherit;
    text-decoration: none;
  }

  ul,
  li {
    list-style: none;
  }

  img,
  svg {
    vertical-align: top;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background-color: ${shade(0.5, themeBackgroundColor)};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${lighten(0.2, themeColor)};
  }
`

const GlobalStyle = createGlobalStyle`
  ${globalStyle};
`

export default GlobalStyle
