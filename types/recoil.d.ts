import "recoil"
declare module "recoil" {
  export function atomFamily<T, Parameter>(options: {
    key: string

    default:
      | RecoilValue<T>
      | Promise<T>
      | T
      | ((param: Parameter) => T | RecoilValue<T> | Promise<T>)

    dangerouslyAllowMutability?: boolean
  }): (param: Parameter) => RecoilState<T>

  function selectorFamily<T, Parameter>(options: {
    key: string

    get: (
      param: Parameter,
    ) => (context: { get: GetRecoilValue }) => Promise<T> | RecoilValue<T> | T

    set?: (
      param: Parameter,
    ) => (
      context: {
        get: GetRecoilValue
        set: SetRecoilState
        reset: ResetRecoilState
      },
      newValue: T | DefaultValue,
    ) => void

    dangerouslyAllowMutability?: boolean
  }): (param: Parameter) => RecoilState<T>
}
