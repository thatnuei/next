import { lighten } from "polished"
import { createGlobalStyle, css } from "./styled"

const globalStyle = css`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    font: 16px Roboto, sans-serif;
    background-color: ${(props) => props.theme.colors.theme2};
    color: ${(props) => props.theme.colors.text};
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

  button {
    background: transparent;
    font: inherit;
    color: inherit;
    border: none;
    text-align: left;
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

  /* see https://github.com/WICG/focus-visible */
  /* :not(:focus-visible) {
    outline: none;
  } */
  .js-focus-visible :focus:not(.focus-visible) {
    outline: 0;
  }
  .js-focus-visible :focus:not([data-focus-visible-added]) {
    outline: 0;
  }

  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track,
  ::-webkit-scrollbar-corner {
    background-color: ${({ theme }) => theme.colors.theme2};
  }

  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => lighten(0.2, theme.colors.theme0)};
  }
`

const GlobalStyle = createGlobalStyle`
  ${globalStyle};
`

export default GlobalStyle
