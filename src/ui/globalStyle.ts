import { lighten, shade } from "polished"
import { textColor, themeBackgroundColor, themeColor } from "./colors"
import { css } from "./styled"

export default css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    font: 16px Roboto, sans-serif;
    color: ${textColor};
    background-color: ${themeBackgroundColor};
    word-break: break-word;
    line-height: 1.5;
  }

  :focus {
    outline: 2px solid hsla(219, 63%, 24%, 0.5);
    outline-offset: -2px;
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
