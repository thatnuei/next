import { clouds, flist5 } from "./colors"
import { injectGlobal } from "./styled"

export function applyGlobalStyles() {
  injectGlobal`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    :root {
      font: 16px Roboto, sans-serif;
      color: ${clouds};
      background-color: ${flist5};
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Roboto Condensed', sans-serif;
      font-weight: 300;
    }
  `
}
