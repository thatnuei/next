export type Values<T> = T[keyof T]

export type CompareFn<T> = (a: T, b: T) => number

export type OptionalArg<T> = T extends undefined ? [] : [T]

export type Dictionary<V> = { [K in string]?: V }

export type Mutable<T> = { -readonly [K in keyof T]: T[K] }
