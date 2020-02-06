export type Values<T> = T extends readonly (infer V)[] ? V : T[keyof T]

export type CompareFn<T> = (a: T, b: T) => number

export type OptionalArg<T> = T extends undefined ? [] : [T]

export type Dictionary<V> = { [K in string]?: V }

export type Mutable<T> = { -readonly [K in keyof T]: T[K] }

/**
 * By default, if you add `string` to a string literal union,
 * TS won't give autocomplete on the individual union members.
 * This type allows defining a union of strings that can also accept any string,
 * while also giving autocomplete to the union members
 *
 * @example
 * type Color = "red" | "blue" | "green" | StringWithAutocompleteHack
 */
export type StringWithAutocompleteHack = string & { __autocompleteHack?: never }
