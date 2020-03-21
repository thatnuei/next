/// <reference types="react-scripts" />

declare module "twin.macro" {
  import { CSSObject } from "@emotion/react"
  const tw: (strings: TemplateStringsArray, ...values: never[]) => CSSObject
  export default tw
}
