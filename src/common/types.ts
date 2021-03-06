export type Dict<T> = {
  readonly [key: string]: T
}

export type TruthyMap = {
  readonly [key: string]: true
}

export type ValueOf<T> = T extends readonly unknown[] ? T[number] : T[keyof T]

export type DeepReadonly<T> = T extends Record<string, unknown>
  ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
  : T

export type NonEmptyArray<T> = readonly [T, ...T[]]

export type Mutable<T> = T extends Record<string, unknown>
  ? { -readonly [K in keyof T]: T[K] }
  : T extends readonly [...infer V]
  ? V
  : T

export type Falsy = false | 0 | "" | null | undefined

export type OptionalKeys<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>
