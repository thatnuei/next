export type Values<T> = T[keyof T]

export type CompareFn<T> = (a: T, b: T) => number

export type OptionalArg<T> = T extends undefined ? [] : [T]

export type Dictionary<V> = Record<string, V | undefined>
