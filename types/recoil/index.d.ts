// Type definitions for recoil 0.0
// Project: https://github.com/facebookexperimental/recoil#readme
// Definitions by: Christian Santos <https://github.com/csantos42>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// Minimum TypeScript Version: 3.7

import {
  RecoilState,
  RecoilValue,
  RecoilValueReadOnly,
} from "./lib/core/recoilValue"

// Nominal Classes
// Recoil state
export { atom } from "./lib/core/atom"
// Hooks
export {
  useRecoilCallback,
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValue,
  useRecoilValueLoadable,
  useResetRecoilState,
  useSetRecoilState,
} from "./lib/core/hooks"
// Types
export { Loadable } from "./lib/core/loadable"
export { DefaultValue } from "./lib/core/node"
// Components
export { RecoilRoot } from "./lib/core/RecoilRoot"
// Other
export { isRecoilValue } from "./lib/core/recoilValue"
export { selector } from "./lib/core/selector"
export { RecoilValue, RecoilValueReadOnly, RecoilState }

// custom stuff
// uncomment later when it's actually added in recoil
// https://github.com/facebookexperimental/Recoil/issues/105
// export type GetRecoilValue = <T>(value: RecoilValue<T>) => T

// export function atomFamily<T, Parameter>(options: {
//   key: string

//   default:
//     | RecoilValue<T>
//     | Promise<T>
//     | T
//     | ((param: Parameter) => T | RecoilValue<T> | Promise<T>)

//   dangerouslyAllowMutability?: boolean
// }): (param: Parameter) => RecoilState<T>

// export function selectorFamily<T, Parameter>(options: {
//   key: string

//   get: (
//     param: Parameter,
//   ) => (options: { get: GetRecoilValue }) => Promise<T> | RecoilValue<T> | T

//   dangerouslyAllowMutability?: boolean
// }): (param: Parameter) => RecoilValueReadOnly<T>
