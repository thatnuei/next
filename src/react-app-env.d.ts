/// <reference types="react-scripts" />

declare module "twin.macro" {
  const tw: (strings: TemplateStringsArray, ...values: never[]) => any
  export default tw
}
