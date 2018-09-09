export type Values<T> = T[keyof T]

export type CompareFn<T> = (a: T, b: T) => number
